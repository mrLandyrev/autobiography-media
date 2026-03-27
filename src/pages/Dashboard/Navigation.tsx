import Map, { Layer, MapLayerMouseEvent, MapRef, Marker, Source, ViewStateChangeEvent } from "react-map-gl/maplibre";
import React, { FC, useCallback, useEffect, useRef, ReactNode, useState, useMemo } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useMqtt } from "../../mqtt";
import NavigationRoundedIcon from '@mui/icons-material/NavigationRounded';
import { useTheme } from "styled-components";
import 'maplibre-gl/dist/maplibre-gl.css';
import { Papper } from "../../components/Papper";
import { TurnIcon } from "../../components/TyrnIcon";
import { GeoPoint } from "../../types/geo";
import { useLazyRouteQuery } from "../../store/rotingApi";
import SportsScoreOutlinedIcon from '@mui/icons-material/SportsScoreOutlined';

export type NavigationProps = {
    zoom?: number;
    onClick?: (e: MapLayerMouseEvent) => void;
    children?: ReactNode;
};

export const Navigation: FC<NavigationProps> = ({ onClick, children, zoom }) => {
    const theme = useTheme();
    const mapRef = useRef<MapRef | null>(null);
    const { value: userPosition } = useMqtt("/navi/position/gps");
    const { value: activeRoute, publish: setActiveRoute} = useMqtt("/navi/active/route");
    const { value: step } = useMqtt("/navi/active/step");
    const [auto, setAuto] = useState<boolean>(true);

    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        return () => {
            if (timerRef.current !== undefined) {
                clearTimeout(timerRef.current);
                timerRef.current = undefined;
            };
        };
    }, [setAuto, timerRef])

    const userInterctionEndHandler = useCallback((e: ViewStateChangeEvent) => {
        if(!e.originalEvent?.isTrusted) {
            return;
        }
        if (timerRef.current !== undefined) {
            clearTimeout(timerRef.current);
            timerRef.current = undefined;
        }
        setAuto(false);
        timerRef.current = setTimeout(() => {
            setAuto(true);
            timerRef.current = undefined;
        }, 5 * 1000);
    }, [setAuto, timerRef]);

    useEffect(() => {
        if (!mapRef.current || !userPosition || !auto) {
            return;
        }

        mapRef.current.fitBounds([userPosition, userPosition], { zoom: zoom || 15, linear: true });
    }, [userPosition, mapRef.current, zoom, auto])

    return <Map
        ref={mapRef}
        initialViewState={{
            longitude: userPosition?.lon || 0,
            latitude: userPosition?.lat || 0,
            zoom: zoom || 19,
            pitch: 71,
            bearing: 68.1,
        }}
        reuseMaps={true}
        style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
        }}
        onClick={onClick}
        mapStyle="http://127.0.0.1:8086/styles/maptiler-basic/style.json"
        onMoveEnd={userInterctionEndHandler}
        onZoom={userInterctionEndHandler}
        onRotateEnd={userInterctionEndHandler}
    >
        {
            !!activeRoute && activeRoute.legs.map((leg, index, arr) =>

                <Marker
                    longitude={leg.steps.at(-1)!.maneuver.location[0]}
                    latitude={leg.steps.at(-1)!.maneuver.location[1]}
                >
                    <Papper
                        style={{ width: "fit-content", height: "fit-content", transform: "translate(50%, -50%)" }}
                        variant={"primary"}
                    >
                        { arr.length - 1 === index ? <TurnIcon maneur="finish"/> : index + 1}
                    </Papper>
                </Marker>
            )
        }
        {
            !!activeRoute && (step !== null && step !== undefined) && !!activeRoute.legs[0].steps[step] && <Marker
                longitude={activeRoute.legs[0].steps[step].maneuver.location[0]}
                latitude={activeRoute.legs[0].steps[step].maneuver.location[1]}
            >
                <Papper
                    style={{ width: "fit-content", height: "fit-content", transform: "translate(50%, -50%)" }}
                    variant={"primary"}
                >
                    <TurnIcon maneur={activeRoute.legs[0].steps[step].maneuver.modifier} />
                </Papper>
            </Marker>
        }
        {
            !!activeRoute && <Source id="route-source" type="geojson" data={activeRoute.geometry}>
                <Layer
                    id="route-layer"
                    type="line"
                    paint={{
                        'line-color': theme.colors.primary,
                        'line-width': 10,
                        'line-blur': 0.5
                    }}
                />
            </Source>
        }
        {
            userPosition && <Marker
                longitude={userPosition.lon}
                latitude={userPosition.lat}
                pitchAlignment="map"
                rotationAlignment="map"
            >  
                <NavigationRoundedIcon style={{fontSize: 40, color: "white"}}/>
            </Marker>
        }
        {
            children
        }
    </Map>
}