import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import styled from "styled-components";
import { Papper } from "../../components/Papper";
import { Label } from "../../components/Label";

export const Forecast: React.FC = () => {
    const forecast = useSelector((state: RootState) => state.weatherReducer.forecast);
    const formatter = useMemo(() => Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        hour12: true,

        timeZone: "Europe/Moscow",
    }), []);

    return <Wrapper>
        {
            forecast.map((step, index) => <Element variant={index === 2 ? "primary" : "default"}>
                <Label>
                    {index === 2 ? "now" : formatter.format(step.time).toLowerCase()}
                </Label>
                <Icon src={`/weather/${step.pict}_${step.isDaylight ? "day" : "night"}.svg`}/>
                <Label>
                    {step.temp.toFixed()}*C
                </Label>
            </Element>)
        }
    </Wrapper>
};

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Element = styled(Papper)`
    display: grid;
    grid-template-columns: 1fr 48px 64px;
    place-items: center start;
    gap: 20px;
`;

const Icon = styled.img`
    width: 48px;
    height: 48px;
`;