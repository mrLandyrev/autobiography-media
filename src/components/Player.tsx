import { FC, useContext, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useInfoQuery, usePlayTrackMutation, useStateQuery } from "../store/searchTracksApi";
import { Papper } from "./Papper";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const formatTime = (seconds: number): string => {
    const m = Math.trunc(seconds / 60)
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' + s : s}`
};

export const Player: FC = () => {
    const queue = useSelector((state: RootState) => state.searchTracksSlice.queue);
    const current = useSelector((state: RootState) => state.searchTracksSlice.current);
    const position = useSelector((state: RootState) => state.searchTracksSlice.position);
    const [triggerPlay] = usePlayTrackMutation()

    const qRef = useRef<HTMLDivElement | null>(null);
    const [pos, setPos] = useState(0);

    useEffect(() => {
        if (!qRef.current) {
            return;
        }

        const handler = () => {
            console.log("scroll")
            if (!qRef.current) {
                return
            }
            setPos(Math.round((qRef.current.scrollLeft-142) / 150));
            console.log(qRef.current.scrollLeft)
        }

        qRef.current.onscroll = handler;
    }, [qRef.current, setPos])

    return <Wrapper>
        <Queue ref={qRef}>
        <div style={{ minWidth: 142,  border: "1px solid red" }}>1</div>
            {
                queue.map((track, index) => <Track
                    id={track}
                    active={index === position}
                    current={index === position ? current : undefined}
                    rotated={pos !== index}
                    offseted={pos > index}
                    onClick={() => triggerPlay({ position: index })}
                />
                )
            }
        <div style={{ minWidth: 1920 - 142, height: 100, border: "1px solid red" }}>1</div>
        </Queue>
    </Wrapper>
}

const Track: FC<{ id: string, current?: number, rotated: boolean, offseted: boolean, active: boolean, onClick: () => {} }> = ({ id, current, rotated, active, offseted, onClick }) => {
    const { data } = useInfoQuery(id)
    return <Anchor rotated={rotated} onClick={onClick}>
        <Box rotated={rotated} variant={active ? "primary" : 'default'} offseted={offseted}>
            {
                data && <>
                    <Cover src={data?.cover} />
                    <Title>
                        {data.title}
                    </Title>
                    <Authors>
                        {data.authors.join(", ")}
                    </Authors>
                    {
                        current != undefined && <>
                            <Timeline>
                                <TimelineValue>
                                    {formatTime(current)}
                                </TimelineValue>
                                <TimelineValue>
                                    {formatTime(data.total)}
                                </TimelineValue>
                            </Timeline>
                            <TimelineGraph progress={current / data.total * 100} />
                        </>
                    }
                </>
            }
        </Box>
    </Anchor>
}

const Anchor = styled.div<{ rotated?: boolean }>`
    height: 500px;
    min-width: 500px;
    position: relative;
    perspective: 1000px;
    /* transition: min-width 500ms linear; */
    /* z-index: ${props => props.rotated ? 0 : 1}; */
    transition: z-index 500ms;
`;

const Box = styled(Papper)<{ rotated: boolean, offseted: boolean }>`
    width: 500px;
    height: 500px;
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: center right;
    transition: transform 500ms linear;
    z-index: ${props => props.rotated ? 0 : 1};
`;

const Queue = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    overflow-x: scroll;
    perspective: 720px;
    border: 1px solid red;
`;

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    color: white;
    position: absolute;
    left: 0;
    top: 0;
`;

const Title = styled.div`
    color: white;
    font-size: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
const Authors = styled.div`
    color: #a0a0a0;
    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
const Timeline = styled.div`
    display: flex;
    justify-content: space-between;
`;

const TimelineGraph = styled.div<{ progress: number }>`
    flex-grow: 1;
    width: 100%;
    height: 5px;
    background: #474747;
    position: relative;

    &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background: white;
        width: ${props => props.progress}%;
        transition: width 1s;
    }
`;

const TimelineValue = styled.div`
    color: #a0a0a0;
    font-size: 15px;
`;


const Cover = styled.img`
    width: 400px;
    height: 400px;
    background: black;
`;