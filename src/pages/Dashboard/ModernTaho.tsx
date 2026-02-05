import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import styled from "styled-components";

export const ModernTaho: React.FC = () => {
    const rpm = useSelector((state: RootState) => state.engineReducer.rpm);

    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!ref.current) {
            return;
        }
        const context = ref.current.getContext("2d");
        if (!context) {
            return;
        }

        context.clearRect(0, 0, 720, 720);

        context.moveTo(0, 720);
        context.lineTo(500, 720);

    }, [ref.current, rpm])

    return <Wrapper>
        <Canvas ref={ref} width={720} height={720}/>
    </Wrapper>
};

const Wrapper = styled.div`
    position: absolute;
    top: 0px;
    right: 0px;
    width: 720px;
    height: 720px;
`;

const Canvas = styled.canvas`
    position: absolute;
    width: 720px;
    height: 720px;
    top: 0px;
    right: 0px;
`;