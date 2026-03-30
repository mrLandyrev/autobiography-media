import { FC, useCallback } from "react";
import { useMqtt } from "../../mqtt";
import styled from "styled-components";
import { Papper } from "../../components/Papper";
import { Label } from "../../components/Label";
import { RouteStep } from "../../types/geo";
import { formatRouteDistance, formatRouteTime } from "../../utils/formatters";
import { TurnIcon } from "../../components/TyrnIcon";
import { Toggle } from "../../components/Toggle";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

export const NavigationBar: FC<{}> = ({}) => {
    const { value: currentStep } = useMqtt("/navi/active/step");
    const { value: activeRoute, publish: setActiveRoute } = useMqtt("/navi/active/route");
    const { value: distanceToNextPoint } = useMqtt("/navi/active/distanceToNextPoint");

    const clear = useCallback(() => {
        setActiveRoute(null);
    }, [setActiveRoute]);

    return <Spacer>
        {
            activeRoute && <>
                <Papper>
                    <Toggle onClick={clear}>
                        <ClearOutlinedIcon />
                    </Toggle>
                </Papper>
                <Papper>
                    <Info>
                        <Label variant="header">{formatRouteTime(activeRoute.duration)}</Label>
                        <Label variant="secondary">{formatRouteDistance(activeRoute.distance)}</Label>
                    </Info>
                </Papper>
                <StepsWrapper>
                    <Steps>
                        {
                            activeRoute.legs.reduce((acc, leg) => [...acc, ...leg.steps], new Array<RouteStep>(0)).map((step, index, arr) => <>
                                <Toggle active={index === currentStep && distanceToNextPoint! < 50}>
                                    <TurnIcon maneur={step.maneuver.modifier} />
                                </Toggle>
                                <Distance variant="fit" progress={index + 1 === currentStep ? 1 - distanceToNextPoint! / step.distance : 0}>
                                    <Label style={{ padding: "0 20px" }} variant={index + 1 === currentStep ? undefined : "secondary"}>{formatRouteDistance(step.distance)}</Label>
                                </Distance>
                            </>
                            )
                        }
                    </Steps>
                </StepsWrapper>
            </>
        }
    </Spacer>
};

const Spacer = styled.div`
    display: grid;
    gap: 20px;
    grid-template-columns: auto auto 1fr;

    & > * {
        overflow: hidden;
    }
`;

const Info = styled.div`
`;

const StepsWrapper = styled.div`
    position: relative;
    width: fit-content;
    max-width: 100%;

    &::before {
        content: "";
        position: absolute;
        width: 20px;
        background: linear-gradient(to right, ${props => props.theme.colors.default}, transparent);
        height: 100%;
        left: 0;
        top: 0;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
    }

    &::after {
        content: "";
        position: absolute;
        width: 20px;
        background: linear-gradient(to left, ${props => props.theme.colors.default}, transparent);
        height: 100%;
        right: 0;
        top: 0;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
    }
`;

const Steps = styled(Papper)`
    display: flex;
    overflow: scroll;
    gap: 10px;
    align-items: center;
    width: fit-content;
    max-width: 100%;

    & > * {
        flex-shrink: 0;
    }
`;

const Distance = styled(Toggle) <{ progress: number }>`
    position: relative;

    & > * {
        z-index: 1;
    }

    &::after {
        border-radius: inherit;
        content: "";
        position: absolute;
        top: 0;
        width: ${props => (props.progress) * 100}%;
        bottom: 0;
        left: 0;
        background: ${props => props.theme.colors.primary};
        z-index: 0;
    }
`;