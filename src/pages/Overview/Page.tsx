import React, { useState } from "react";
import { Papper } from "../../components/Papper";
import styled from "styled-components";
import { Clock } from "./Clock";
import { Forecast } from "./Forecast";
import { Navigator } from "./Navigator";
import { Player } from "./Player";
import { Toggle } from "../../components/Toggle";
import AirRoundedIcon from '@mui/icons-material/AirRounded';
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useMqtt } from "../../mqtt";

export const OverviewPage: React.FC = () => {
    const { value: pl } = useMqtt("/power/left");
    const { value: pr } = useMqtt("/power/right");
    const left = useSelector((state: RootState) => state.climateReducer.left);
    const right = useSelector((state: RootState) => state.climateReducer.right);

    return <>
        <Background src="/wallpapper.jpg"/>
        <Wrapper>
            <FirstWidget>
                <Clock/>
                <Forecast/>
            </FirstWidget>
            <Player/>
            <ComforWrapper>
                <Toggle
                    variant="full"
                    active={pl != 0}
                    style={(pl || 0) < 0 ? { background: "blue" } : {}}
                >
                    <AirRoundedIcon/>
                    {pl}
                </Toggle>
                <Toggle
                    variant="full"
                    active={pr != 0}
                    style={(pr || 0) < 0 ? { background: "blue" } : {}}
                >
                    <AirRoundedIcon/>
                    {pr}
                </Toggle>
                <Toggle variant="full">
                    <AirRoundedIcon/>
                </Toggle>
            </ComforWrapper>
            <Navigator/>
        </Wrapper>
    </>
};

const FirstWidget = styled(Papper)`
    display: grid;
    grid-template-rows: 140px 1fr;
    gap: 20px;
`;

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(4, 1fr);

    & > * {
        overflow: hidden;
    }
`;


const Background = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
`;

const ComforWrapper = styled(Papper)`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 20px;
`;