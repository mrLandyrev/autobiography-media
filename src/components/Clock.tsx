import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { Papper } from "./Papper";

export const Clock: FC = () => {
    const [time, setTime] = useState<string>("");
    const [date, setDate] = useState<string>("");
    
    useEffect(() => {
        const timeInterval = setInterval(() => {
            setTime(Intl.DateTimeFormat("ru", {
                timeStyle: "short",
            }).format(Date.now()))
            setDate(Intl.DateTimeFormat("ru", {
                weekday: "long",
                day: "2-digit",
                month: "long",
            }).format(Date.now()))
        }, 1000);
        return () => clearInterval(timeInterval);
    }, [setTime, setDate]);

    return <Wrapper>
        <Label style={{fontSize: 30}}>{time}</Label>
        <Label>{date}</Label>
    </Wrapper>
};

const Wrapper = styled(Papper)`
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
`;

const Label = styled.div`
    text-align: center;
    font-size: 20px;
`;