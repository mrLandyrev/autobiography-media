import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import styled, { useTheme } from "styled-components";
import { RootState } from "../../store/store";
import { useMqtt } from "../../mqtt";

export const Speedometer: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
    const { value: speed } = useMqtt("/engine/speed");
    return <Wrapper style={style}>
        <Indicator/>
        <OuterCircle/>
        <InnerCircleOutline>
            <InnerCircle/>
        </InnerCircleOutline>
        <Value>
            {speed}
            <ValueUnit>
                km/h
            </ValueUnit>
        </Value>
        <Unit>
            rpm*100
        </Unit>
    </Wrapper>
};

const Wrapper = styled.div`
    width: 400px;
    height: 400px;
    background: ${props => props.theme.colors.default};
    border-radius: 50%;
    box-shadow: 0 0 30px 5px ${props => props.theme.colors.default};
    position: relative;
    display: grid;
    place-items: center;
`;

const Indicator: React.FC = () => {
    const ref = useRef<HTMLCanvasElement>(null);
    const theme = useTheme();
    const { value: rpm } = useMqtt("/engine/rpm");

    useEffect(() => {
        if (!ref.current || rpm === undefined) {
            return;
        }

        const context = ref.current.getContext("2d");

        if (!context) {
            return;
        }

        context.clearRect(0, 0, 400, 400);
        context.strokeStyle = theme.colors.primary;
        context.lineWidth = 75;
        context.beginPath();
        context.arc(200, 200, 162.5, Math.PI / 4 * 3, Math.PI / 4 * 3 + (Math.PI * (3/2) / 70 * rpm / 100));
        context.stroke();

        for (let i = 0; i <= 14; i++) {
            context.lineWidth = 2;
            context.fillStyle = i > 10 ? "red" : "white";
            context.strokeStyle = i > 10 ? "red" : "white";
            const angle = (Math.PI / 4 * 3) + Math.PI * (3/2) / 14 * i;
            const x = Math.cos(angle);
            const y = Math.sin(angle);
            context.beginPath();
            context.moveTo(200 + x * 200, 200 + y * 200);
            context.lineTo(200 + x * 175, 200 + y * 175);
            context.stroke();

            if (!(i % 2)) {
                context.lineWidth = 1;
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.font = "15px Science Gothic"
                context.fillText((i / 2 * 10).toFixed(0), 200 + x * 155, 200 + y * 155)
            }
        }

    }, [ref.current, rpm]);

    return <IndicatorCanvas width={400} height={400} ref={ref}/>
};

const IndicatorCanvas = styled.canvas`
    width: 400px;
    height: 400px;
`;

const OuterCircle = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 50%;
    top: 0;
    left: 0;
    /* border: 2px solid white; */
`;

const InnerCircleOutline = styled.div`
    width: 250px;
    height: 250px;
    position: absolute;
    border-radius: 50%;
    top: 75px;
    left: 75px;
    /* background-image: conic-gradient(white 135deg, ${props => props.theme.colors.default} 135deg 225deg, white 225deg); */
`;

const InnerCircle = styled.div`
    border-radius: 50%;
    position: absolute;
    /* background: ${props => props.theme.colors.default}; */
    left: 5px;
    top: 5px;
    right: 5px;
    bottom: 5px;
`;


const Unit = styled.div`
    color: white;
    position: absolute;
    bottom: 30px;
    font-size: 15px;
`;

const Value = styled.div`
    color: white;
    position: absolute;
    font-size: 70px;
    display: flex;
    align-items: center;
    line-height: 70px;
    flex-direction: column;
`;

const ValueUnit = styled.div`
    font-size: 15px;
    height: 15px;
    line-height: 15px;
`