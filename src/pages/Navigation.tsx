import { FC, useCallback, useEffect, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import Map, { Layer, MapRef, Marker, Source } from "react-map-gl/maplibre";
import { SearchInput } from "../components/SearchInput";
import useDebounce from "../utils/useDebounce";
import { useSearchQuery } from "../store/geocoderApi";
import { GeocoderPlace, GeoPoint, RouteStep } from "../types/geo";
import { useLazyRouteQuery } from "../store/rotingApi";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./keyboard.css";
import 'maplibre-gl/dist/maplibre-gl.css';
import { Papper } from "../components/Papper";
import { TurnIcon } from "../components/TyrnIcon";

const userPoint = {
    lon: 38.852879,
    lat: 47.215912,
}

const fitPoints = (data: Array<GeoPoint>): [[number, number], [number, number]] => {
    const minLat = Math.min(...data.map(x => x.lat))
    const maxLat = Math.max(...data.map(x => x.lat))
    const minLon = Math.min(...data.map(x => x.lon))
    const maxLon = Math.max(...data.map(x => x.lon))
    return [[minLon, minLat], [maxLon, maxLat]]
}

export const NavigationPage: FC = () => {
    const [query, setQuery] = useState<string>("");
    const debouncedQuery = useDebounce(query, 1000);
    const { data, isFetching } = useSearchQuery(debouncedQuery);
    const mapRef = useRef<MapRef | null>(null);
    const [selectedResult, setSelectedResult] = useState<GeocoderPlace | undefined>(undefined);
    const [triggerGenerateRoute, { data: routeData }] = useLazyRouteQuery();
    const [showKeyboard, setShowKeyboard] = useState(false);
    const keyboardRef = useRef<any | null>(null);
    const [routeStep, setRouteStep] = useState<number | undefined>(undefined);
    const theme = useTheme();
    const stepsRef = useRef<Array<HTMLElement | null>>(new Array());

    const fitMap = useCallback((data: Array<GeoPoint>, bearing?: number) => {
        if (!mapRef.current) {
            return;
        }
        mapRef.current.fitBounds(fitPoints(data), { bearing: bearing || 0, pitch: 60, padding: { top: 100, bottom: 100, left: 100, right: 400 + 12 + (!!selectedResult ? 400 + 12 : 0) }, maxZoom: 16 });
    }, [mapRef.current])

    
    const selectRouteStep = useCallback((index: number) => {
        if (!routeData || routeData.legs.length == 0 || routeData.legs[0].steps.length < index) {
            return;
        }
        const step = routeData.legs[0].steps[index];
        setRouteStep(index);
        fitMap([{ lat: step.maneuver.location[1], lon: step.maneuver.location[0] }], step.maneuver.bearing_before)
        stepsRef.current[index]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        })
    }, [fitMap, routeData, stepsRef.current])

    useEffect(() => {
        setTimeout(() => {
            if (!mapRef.current) {
                return;
            }
            const exprectedPoints: Array<GeoPoint> = [];
            if (!!routeData) {
                exprectedPoints.push(...routeData.geometry.coordinates.map(coord => ({ lon: coord[0], lat: coord[1] })));
            }
            if (!!selectedResult) {
                fitMap([selectedResult, ...exprectedPoints]);
                return
            }
            if (!data || data.length === 0) {
                return
            }
            fitMap([...data, ...exprectedPoints])
        }, 0)
    }, [fitMap, data, selectedResult, routeData]);

    return <Wrapper>
        <Map
            ref={mapRef}
            initialViewState={{
                longitude: userPoint.lon,
                latitude: userPoint.lat,
                zoom: 15,
                bearing: 68.1,
                pitch: 0,
            }}
            workerCount={3}
            style={{
                width: 1920,
                height: 720,
                position: "absolute",
                top: 0,
                left: 0,
            }}
            mapStyle="http://192.168.2.105:8086/styles/maptiler-basic/style.json"
        >
            {
                data && data.map((place) => {
                    return <>
                        {
                            (!selectedResult || selectedResult === place) && <Marker
                                longitude={place.lon}
                                latitude={place.lat}
                            >
                                <div style={{ width: 10, height: 10, background: "red", color: "white" }}></div>
                            </Marker>
                        }
                    </>
                })
            }
            {
                routeData && routeData.legs[0].steps.map((step, index) => {
                    return <Marker
                        longitude={step.maneuver.location[0]}
                        latitude={step.maneuver.location[1]}
                        style={{ zIndex: routeStep === index ? 1 : 0}}
                        
                    >
                        <Papper
                            style={{ width: "fit-content", height: "fit-content", transform: "translate(50%, -50%)" }}
                            disabled={!!(routeStep && index < routeStep)}
                            variant={routeStep === index ? "secondary" : "default"}
                            onClick={() => {selectRouteStep(index)}}
                        >
                            <TurnIcon maneur={step.maneuver.modifier}/>
                        </Papper>
                    </Marker>
                })
            }
            {
                routeData && <Source id="route-source" type="geojson" data={routeData.geometry}>
                    <Layer
                        id="route-layer"
                        type="line"
                        paint={{
                            'line-color': theme.colors.secondary,
                            'line-width': 10,
                            'line-blur': 0.5
                        }}
                    />
                </Source>
            }
        </Map>
        <DataWrapper withKeyboard={showKeyboard}>
            <PlaceInfo>
                {
                    selectedResult && <>
                        {selectedResult.display_name}
                        <button onClick={() => triggerGenerateRoute([userPoint, selectedResult])}>Generate route</button>
                        <button onClick={() => setSelectedResult(undefined)}>Close</button>
                    </>
                }
                {
                    !selectedResult && routeData && routeData.legs[0] && <SearchResult>
                        {
                            routeData.legs[0].steps.map((step, index) => <SearchResultItem
                                onClick={() => {selectRouteStep(index)}}
                                disabled={routeStep == undefined || index < routeStep}
                                variant={routeStep === index ? "secondary" : "default"}
                                ref={(e) => {stepsRef.current[index] = e}}
                            >
                                <TurnIcon maneur={step.maneuver.modifier}/>{!!step.name && " на " + step.name}
                            </SearchResultItem>)
                        }
                    </SearchResult>
                }
            </PlaceInfo>
            <Search>
                <SearchInput value={query} onFocusedChange={(state) => setShowKeyboard(state)} onClear={() => { keyboardRef.current?.clearInput(); setQuery(""); }} />
                {
                    isFetching && <SearchResultItem>"Loading"</SearchResultItem>
                }
                <SearchResult>
                    {
                        data && data.map((place) =>
                            <SearchResultItem onClick={() => setSelectedResult(place)} variant={place == selectedResult ? "secondary" : "default"}>
                                {place.name}
                            </SearchResultItem>
                        )
                    }
                </SearchResult>
            </Search>
            <KeyboardWrapper>
                <Keyboard layout={{
                    'ru': [
                        "1 2 3 4 5 6 7 8 9 0",
                        "\u0439 \u0446 \u0443 \u043a \u0435 \u043d \u0433 \u0448 \u0449 \u0437 \u0445 \u044a",
                        "\u0444 \u044b \u0432 \u0430 \u043f \u0440 \u043e \u043b \u0434 \u0436 \u044d",
                        "\u044f \u0447 \u0441 \u043c \u0438 \u0442 \u044c \u0431 \u044e",
                        "{space} {bksp} / ,",
                    ]
                }} layoutName="ru" onChange={(input) => setQuery(input)} keyboardRef={r => keyboardRef.current = r} />
            </KeyboardWrapper>
        </DataWrapper>
    </Wrapper>
};

const KeyboardWrapper = styled(Papper)`
    grid-column: 1/3;
    padding: 0;
`;

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    gap: 12px;
    overflow: hidden;
    position: relative;
    justify-content: end;
`

const MapWrapper = styled.div`
    position: absolute;
    inset: 0;
`;

const DataWrapper = styled.div<{ withKeyboard: boolean }>`
    width: fit-content;
    height: 100%;
    display: grid;
    grid-template-columns: 400px 400px;
    grid-template-rows: 1fr ${props => props.withKeyboard ? "300px" : "0"};
    gap: 12px;
    z-index: 1;
    transition: grid-template-rows 1s;
    > * {
        overflow: hidden;
    }
    margin-right: 12px;
`;

const PlaceInfo = styled(Papper)`
    color: white;
    overflow: auto hidden;
    white-space: break-spaces;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const Search = styled(Papper)`
    display: grid;
    grid-gap: 12px;
    grid-template-rows: auto 1fr auto;
`;

const SearchResult = styled.div`
    width: 100%;
    height: fit-content;
    max-height: 100%;
    display: grid;
    grid-gap: 12px;
    overflow: hidden auto;
`;

const SearchResultItem = styled(Papper)``;