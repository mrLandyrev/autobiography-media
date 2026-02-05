import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { Papper } from "../../components/Papper";
import { Label } from "../../components/Label";

export const Clock: FC = () => {
    const [time, setTime] = useState<string>("");
    const [date, setDate] = useState<string>("");
    
    useEffect(() => {
        const update = (time: number) => {
            setTime(Intl.DateTimeFormat("ru", {
                timeStyle: "short",
            }).format(time))
            setDate(Intl.DateTimeFormat("ru", {
                weekday: "long",
                day: "2-digit",
                month: "long",
            }).format(time))
        }
        update(Date.now())
        const timeInterval = setInterval(() => {
            update(Date.now())
        }, 1000);
        return () => clearInterval(timeInterval);
    }, [setTime, setDate]);

    return <Wrapper>
        <Label variant="header">{time}</Label>
        <Label variant="secondary">{date}</Label>
    </Wrapper>
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
`;

const Time = styled.div`
    text-align: center;
    font-size: 50px;
    line-height: 50px;
`;