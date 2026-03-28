import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Papper } from "../../components/Papper";
import Map, { Layer, MapRef, Marker, Source } from "react-map-gl/maplibre";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import styled, { useTheme } from "styled-components";
import { Label } from "../../components/Label";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import WarehouseRoundedIcon from '@mui/icons-material/WarehouseRounded';
import { useLazyRouteQuery } from "../../store/rotingApi";
import { GeoPoint } from "../../types/geo";
import { TurnIcon } from "../../components/TyrnIcon";
import { Toggle } from "../../components/Toggle";
import { useMqtt } from "../../mqtt";
import { Navigation } from "../Dashboard/Navigation";
import { formatRouteDistance, formatRouteTime } from "../../utils/formatters";

const home: GeoPoint = {
    lon: 38.852879,
    lat: 47.215912,
};

const garage: GeoPoint = {
    lon: 38.896491,
    lat: 47.274764,
}

export const Navigator: React.FC = () => {
    const theme = useTheme();
    const { value: userPosition } = useMqtt("/navi/position/gps");
    const nearest = useSelector((state: RootState) => state.routingSlice.nearest);
    const mapRef = useRef<MapRef>(null);
    const [m, sm] = useState(false);
    const [getRoute] = useLazyRouteQuery();
    const {value: activeRoute, publish: setActiveRoute} = useMqtt("/navi/active/route");
    const activeStep = useSelector((state: RootState) => state.routingSlice.step);
    const { publish: publishWaypoints } = useMqtt("/navi/active/waypoints");
    const {value: distanceToNextPoint } = useMqtt("/navi/active/distanceToNextPoint");

    const checkTo = useCallback((point: GeoPoint) => {
        const lastStep = activeRoute?.legs.at(-1)?.steps.at(-1)?.maneuver.location;
        if (!lastStep) {
            return false;
        }
        const dist = Math.sqrt((lastStep[0] - point.lon) ** 2 + (lastStep[1] - point.lat) ** 2);
        return dist < 0.001;
    }, [activeRoute]);


    const checkToHome = useMemo(() => checkTo(home), [checkTo]);
    const checkToGarage = useMemo(() => checkTo(garage), [checkTo]);

    const goTo = useCallback(async (point: GeoPoint) => {
        if (!userPosition) {
            return;
        }
        const toHomeRoute = await getRoute([userPosition, point]);
        publishWaypoints([point]);
        setActiveRoute(toHomeRoute.data || null);
    }, [setActiveRoute, userPosition])

    const goToHome = useCallback(() => goTo(home), [goTo]);
    const goToGarage = useCallback(() => goTo(garage), [goTo]);


    const clear = useCallback(() => {
        setActiveRoute(null);
    }, [setActiveRoute]);

    useEffect(() => {
        if (!mapRef.current || !userPosition) {
            return;
        }

        mapRef.current.fitBounds([userPosition, userPosition], { zoom: 15 });
    }, [userPosition, mapRef.current])

    return <Wrapper>
        <MapWrapper>
            <Navigation zoom={17}/>
        </MapWrapper>
        {
            activeRoute && <StepWrapper variant="primary">
                <TurnIcon maneur={activeRoute.legs[0].steps[activeStep].maneuver.modifier} />
                <Label>
                    {formatRouteDistance(distanceToNextPoint || 0)} на {activeRoute.legs[0].steps[activeStep].name}
                </Label>
            </StepWrapper>
        }
        <Data>
            {
                !!userPosition && <Position>
                    <Row>
                        <Label variant="secondary">Позиция</Label>
                        <Label>{userPosition.lat.toFixed(2)}/{userPosition.lon.toFixed(2)}</Label>
                    </Row>
                    {
                        !!nearest && <Row>
                            <Label variant="secondary">Рядом с </Label>
                            <Label>{nearest}</Label>
                        </Row>
                    }
                </Position>
            }
            
            {
                activeRoute && <div>
                    <Label variant="header">
                        {formatRouteTime(activeRoute.duration)}
                    </Label>
                    <Label variant="secondary">
                        {formatRouteDistance(activeRoute.distance)}
                    </Label>
                </div>
            }
            <Actions>
                <Toggle active={m} onClick={() => sm(m => !m)}>
                    {
                        m
                            ? <VolumeUpRoundedIcon style={{ fontSize: 40 }} />
                            : <VolumeOffRoundedIcon style={{ fontSize: 40 }} />
                    }
                </Toggle>
                <Toggle active={checkToHome} onClick={goToHome}>
                    <HomeRoundedIcon/>
                </Toggle>
                <Toggle active={checkToGarage} onClick={goToGarage}>
                    <WarehouseRoundedIcon/>
                </Toggle>
                <Toggle active={false} onClick={clear}>
                    <ClearOutlinedIcon/>
                </Toggle>
            </Actions>
        </Data>
    </Wrapper>
}

const Wrapper = styled(Papper)`
    display: grid;
    grid-template-rows: 2fr 1fr;
    gap: 20px;
    position: relative;
`;

const MapWrapper = styled.div`
    margin: -20px -20px 0 -20px;
    position: relative;
`;

const Data = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const Position = styled.div``;

const Row = styled.div`
    display: grid;
    grid-template-columns: 110px 1fr;
`;

const Actions = styled.div`
    display: flex;
    gap: 20px;
`;

const StepWrapper = styled(Papper)`
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    width: auto;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
`;