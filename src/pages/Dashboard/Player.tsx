import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Papper } from "../../components/Papper";
import { useMqtt } from "../../mqtt";
import { blue } from "@mui/material/colors";

export const Player: React.FC = () => {

    const { value } = useMqtt("/power/left");
    const [alive, setAlive] = useState(0);

    useEffect(() => {
        setAlive(3);
        const t = setInterval(() => {
            setAlive(alive => {
                if (alive <= 0 ) {
                    clearInterval(t);
                    return 0;
                }
                return alive - 0.01;
            });
        }, 10);

        return () => clearInterval(t);
    }, [value]);

    return <Wrapper>
        <Not alive={alive}>{value}</Not>
    </Wrapper>
}

const Wrapper = styled(Papper)`
    position: absolute;
    width: 400px;
    height: 150px;
    left: calc(50% - 200px);
    bottom: 30px;
`;

const Not = styled.div<{ alive: number }>`
    opacity: ${props => props.alive > 1 ? 1 : props.alive};
`;