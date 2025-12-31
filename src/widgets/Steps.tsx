import React, { useEffect, useRef } from "react";
import { Papper } from "../components/Papper";
import styled from "styled-components";
import { RouteStep } from "../types/geo";
import { TurnIcon } from "../components/TyrnIcon";
import { Styles } from "styled-components/dist/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setStep } from "../store/routingSlice";

export const StepsWidget: React.FC<{ steps: Array<RouteStep>, style?: React.CSSProperties }> = ({ steps, style }) => {
    const currentStep = useSelector((state: RootState) => state.routingSlice.step);
    const dispatch = useDispatch();
    const stepsRef = useRef<Array<HTMLDivElement | null>>(new Array());

    useEffect(() => {
        stepsRef.current[currentStep]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',

        })
    }, [currentStep, stepsRef])

    return <Wrapper style={style}>
        <Content>
            {
                steps.map((step, index) =>
                    <Element ref={(e) => { stepsRef.current[index] = e }}>
                        <ElementContent disabled={index != currentStep} onClick={() => dispatch(setStep(index))} variant={index === currentStep ? "primary" : "default"}>
                            <TurnIcon maneur={step.maneuver.modifier} size={"high"}/>{!!step.name && " на " + step.name}
                        </ElementContent>
                    </Element>
                )
            }
        </Content>
    </Wrapper>
};

const Wrapper = styled.div`
    height: 150px;
    z-index: 1;
    overflow: scroll;
`;

const Content = styled.div`
    display: flex;
    gap: 20px;
    width: 100%;
    height: 100%;
`;

const Element = styled.div`
    max-width: 80%;
`

const ElementContent = styled(Papper)`
    min-width: 150px;
    width: content;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
`;