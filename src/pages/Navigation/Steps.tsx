import React, { useEffect, useRef } from "react";
import { Papper } from "../../components/Papper";
import styled from "styled-components";
import { TurnIcon } from "../../components/TyrnIcon";
import { useMqtt } from "../../mqtt";
import { Label } from "../../components/Label";
import { Route, RouteStep } from "../../types/geo";
import { formatRouteDistance } from "../../utils/formatters";

export const StepsWidget: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
    const {value: currentStep, publish: setCurrentStep} = useMqtt("/navi/active/step");
    const {value: activeRoute, publish: setActiveRoute} = useMqtt("/navi/active/route");
    const stepsRef = useRef<Array<HTMLDivElement | null>>(new Array());

    useEffect(() => {
        if (currentStep === null || currentStep === undefined) {
            return;
        }
        stepsRef.current[currentStep]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',

        })
    }, [currentStep, stepsRef])

    return <Wrapper style={style}>
        <Content>
            {
                !!activeRoute && activeRoute.legs.reduce((acc, leg) => [...acc, ...leg.steps], new Array<RouteStep>(0)).map((step, index, arr) =>
                    <Element ref={(e) => { stepsRef.current[index] = e }}>
                        <ElementContent onClick={() => setCurrentStep(index)} variant={index === currentStep ? "primary" : "default"}>
                            { index === currentStep && index > 0 && <Label>{formatRouteDistance(arr[index-1].distance)}</Label> }
                            <ElementGraph>
                                <TurnIcon maneur={step.maneuver.modifier} size={"high"}/>
                                {!!step.name && <Label>{" на " + step.name}</Label>}
                            </ElementGraph>
                        </ElementContent>
                    </Element>
                )
            }
        </Content>
    </Wrapper>
};

const Wrapper = styled(Papper)`
    overflow: hidden scroll;
`;

const Content = styled.div`
    display: flex;
    gap: 20px;
    width: 100%;
    height: 100%;
    flex-direction: column;
    overflow: hidden scroll;
`;

const Element = styled.div`
    max-width: 100%;
`

const ElementContent = styled(Papper)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
`;

const ElementGraph = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-around;
`;