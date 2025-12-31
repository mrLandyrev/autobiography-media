import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { StepsWidget } from "../widgets/Steps";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setStep } from "../store/routingSlice";

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
    const theme = useTheme();
    const currentStep = useSelector((state: RootState) => state.routingSlice.step);

    const fitMap = useCallback((data: Array<GeoPoint>, bearing?: number) => {
        if (!mapRef.current) {
            return;
        }
        mapRef.current.fitBounds(fitPoints(data), { bearing: bearing || 0, pitch: 60, padding: { top: 100, bottom: 100, left: 100, right: 400 + 12 + (!!selectedResult ? 400 + 12 : 0) }, maxZoom: 16 });
    }, [mapRef.current])

    useEffect(() => {
        if (!routeData || routeData.legs.length == 0 || routeData.legs[0].steps.length < currentStep) {
            return;
        }
        const step = routeData.legs[0].steps[currentStep];
        fitMap([{ lat: step.maneuver.location[1], lon: step.maneuver.location[0] }], step.maneuver.bearing_before)
    }, [fitMap, routeData, currentStep])

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
            reuseMaps={true}
            mapStyle="http://192.168.2.71:8086/styles/maptiler-basic/style.json"
            maxParallelImageRequests={4}
        >
            {
                data && data.map((place) => {
                    return <>
                        {
                            (!selectedResult || selectedResult === place) && <Marker
                                longitude={place.lon}
                                latitude={place.lat}
                            >
                                <div style={{ width: 10, height: 10, background: theme.colors.primary, color: "white" }}></div>
                            </Marker>
                        }
                    </>
                })
            }
            {
                routeData && <Marker
                        longitude={routeData.legs[0].steps[currentStep].maneuver.location[0]}
                        latitude={routeData.legs[0].steps[currentStep].maneuver.location[1]}
                    >
                        <Papper
                            style={{ width: "fit-content", height: "fit-content", transform: "translate(50%, -50%)" }}
                            variant={"primary"}
                        >
                            <TurnIcon maneur={routeData.legs[0].steps[currentStep].maneuver.modifier} />
                        </Papper>
                    </Marker>
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
        {
            routeData?.legs[0]?.steps && <StepsWidget steps={routeData.legs[0].steps}/>
        }
        <DataWrapper withKeyboard={showKeyboard && !selectedResult} split={!!selectedResult}>
                <PlaceInfo>
                    {
                        selectedResult && <>
                            {selectedResult.display_name}
                            <button onClick={() => triggerGenerateRoute([userPoint, selectedResult])}>Generate route</button>
                            <button onClick={() => setSelectedResult(undefined)}>Close</button>
                        </>
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
    overflow: visible;
    position: relative;
    justify-content: end;
    align-items: end;
    z-index: 0;
    padding-left: 150px;
`

const DataWrapper = styled.div<{ withKeyboard: boolean, split: boolean }>`
    width: fit-content;
    display: grid;
    height: ${props => props.withKeyboard || props.split ? "100%" : "250px"};
    grid-template-columns: ${props => props.split ? "400px 400px" : "0px 800px"};;
    grid-template-rows: ${props => props.withKeyboard && !props.split ? "1fr 300px" : "1fr 0px"};
    gap: 12px;
    z-index: 1;
    > * {
        overflow: hidden;
    }
    transition: 1s;
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