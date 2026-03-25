import { FC, useCallback, useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { StepsWidget } from "./Steps";
import { Navigation } from "../Dashboard/Navigation";
import { MapLayerMouseEvent } from "maplibre-gl";
import { setActiveRoute } from "../../store/routingSlice";
import { GeoPoint, Route } from "../../types/geo";
import { useLazyNearestQuery, useLazyRouteQuery } from "../../store/rotingApi";
import { useMqtt } from "../../mqtt";
import { Papper } from "../../components/Papper";
import { Label } from "../../components/Label";
import { Layer, Source } from "react-map-gl/maplibre";
import { Toggle } from "../../components/Toggle";
import { formatRouteDistance, formatRouteTime } from "../../utils/formatters";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

export const NavigationPage: FC = () => {
    const theme = useTheme();
    const [getRoute] = useLazyRouteQuery();
    const { value: userPosition } = useMqtt("/navi/position/gps");
    const { value: activeRoute, publish: setActiveRoute} = useMqtt("/navi/active/route");
    const { publish: setActiveStep } = useMqtt("/navi/active/step");
    const { publish: publishWaypoints } = useMqtt("/navi/active/waypoints");

    const [waypoints, setWaypoints] = useState<Array<GeoPoint>>([]);
    const [editWaypointIndex, setEditWaypointIndex] = useState(-1);
    const [destination, setDestination] = useState<Route | null>(null);
    
    const goTo = useCallback(async (e: MapLayerMouseEvent) => {
        if (editWaypointIndex === -1) {
            setWaypoints((waypoints) => {
                setEditWaypointIndex(waypoints.length);
                return [...waypoints, { lat: e.lngLat.lat, lon: e.lngLat.lng }]
            });
            return;
        }

        setWaypoints((waypoints) => [...waypoints.slice(0, editWaypointIndex), { lat: e.lngLat.lat, lon: e.lngLat.lng }, ...waypoints.slice(editWaypointIndex+1)])

    }, [setWaypoints, editWaypointIndex, setEditWaypointIndex]);

    useEffect(() => {
        if (waypoints.length === 0 || !userPosition) {
            setDestination(null);
            return;
        }

        (async () => {
            const route = await getRoute([userPosition, ...waypoints]);
            if (!route.data) {
            return;
        }
        setDestination(route.data);
        })()
    }, [setDestination, userPosition, waypoints]);

    const removeWaypoint = useCallback((index: number) => {
        setWaypoints((waypoints) => {
            return [...waypoints.slice(0, index), ...waypoints.slice(index + 1)];
        });
    }, [setWaypoints, setEditWaypointIndex]);

    const run = useCallback(() => {
        setWaypoints((waypoints) => {
            publishWaypoints(waypoints);
            return [];
        });
        setEditWaypointIndex(-1);
        setActiveRoute(destination);
        setActiveStep(0);
    }, [destination, setActiveRoute, setActiveStep, setDestination, setWaypoints, setEditWaypointIndex]);

    return <>
        <MapWrapper>
            <Navigation onClick={goTo} zoom={17}>
                {
                    !!destination && <Source id="dest-route-source" type="geojson" data={destination.geometry}>
                        <Layer
                            id="dest-route-layer"
                            type="line"
                            paint={{
                                'line-color': theme.colors.secondary,
                                'line-width': 10,
                                'line-blur': 0.5
                            }}
                        />
                    </Source>
                }
            </Navigation>
        </MapWrapper>
        <Wrapper>
            {
                !!destination && <DestinationWrapper>
                    <Papper>
                        <DestinationContent>
                            <DestinationList>
                                {
                                    destination.legs.map((leg, index) => 
                                        <Destination
                                            variant={index === editWaypointIndex ? "primary" : "default"}
                                            onClick={() => setEditWaypointIndex(index)}
                                        >
                                            <DestinationInfo>
                                                <Label>{leg.summary || ""}</Label>
                                                <Label>{formatRouteDistance(leg.distance)}</Label>
                                                <Label>{formatRouteTime(leg.duration)}</Label>
                                            </DestinationInfo>
                                            <DestinationDelete onClick={() => removeWaypoint(index)}>
                                                <ClearOutlinedIcon style={{ fontSize: 30 }}/>
                                            </DestinationDelete>
                                        </Destination>
                                    )
                                }
                                <Papper
                                    variant={-1 === editWaypointIndex ? "primary" : "default"}
                                    onClick={() => setEditWaypointIndex(-1)}
                                >
                                    <Label>+ Add point</Label>
                                </Papper>
                            </DestinationList>
                            <Papper variant="primary" onClick={run}>
                                <Label>
                                    Поехали
                                </Label>
                                <Label>
                                    {formatRouteTime(destination.duration)}/{formatRouteDistance(destination.distance)}
                                </Label>
                            </Papper>
                        </DestinationContent>
                    </Papper>
                </DestinationWrapper>
            }
            <StepsWrapper>
                <StepsWidget/>
            </StepsWrapper>
        </Wrapper>
    </>
};

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    z-index: 0;
    grid-template-columns: repeat(4, 1fr);

    & > * {
        overflow: hidden;
    }
`;

const MapWrapper = styled.div`
    width: 1920px;
    height: 720px;
    position: absolute;
    top: 0;
    left: 0;
`;

const StepsWrapper = styled.div`
    grid-column: 4/span 1;
    z-index: 1;
`;

const DestinationWrapper = styled.div`
    grid-column: 1/span 1;
    z-index: 1;
`;

const DestinationContent = styled.div`
    display: grid;
    grid-template-rows: 1fr auto;
    gap: 20px;
    height: 100%;
    overflow: hidden;
`;

const DestinationList = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 100%;
    height: fit-content;
    gap: 20px;
    overflow: hidden scroll;
`;

const Destination = styled(Papper)`
    display: grid;
    grid-template-columns: 1fr auto;
`;

const DestinationInfo = styled.div``;
const DestinationDelete = styled.div`
    background: ${props => props.theme.colors.primary};
    height: calc(100% + 40px);
    width: 60px;
    display: grid;
    place-items: center;
    margin: -20px -20px -20px 0;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
`;