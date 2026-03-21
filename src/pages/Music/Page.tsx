import React, { useCallback, useMemo } from "react";
import { useAddToQueueMutation, useInfoQuery, usePlayQueueMutation, usePlayTrackMutation, useSearchTracksQuery } from "../../store/searchTracksApi";
import { Label } from "../../components/Label";
import { Papper } from "../../components/Papper";
import styled from "styled-components";
import { TrackType } from "../../types/tracks";
import { Toggle } from "../../components/Toggle";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import { useMqtt } from "../../mqtt";
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import { NavigationKeyboard } from "../Navigation/Keyboard";
import { Player } from "../Overview/Player";

export const MusicPage: React.FC = () => {
    const {data: tracksList} = useSearchTracksQuery("");
    const {value: queue} = useMqtt("/music/queue");
    const [play] = usePlayQueueMutation();
    const [addToQueue] = useAddToQueueMutation();
    const addHandler = useCallback((id: string) => {
            addToQueue({ q: [id] });
    }, [addToQueue])

    const onPlayQueueHandler = useCallback((id: string) => {
        if (!queue) {
            return;
        }
        const p = queue.q.findIndex(x => x === id);
        if (p === -1) {
            return;
        }
        play({ q: queue.q, p});
    }, [play, queue])

    const onPlayTrackHandler = useCallback((id: string) => {
        play({ q: [id], p: 0 });
    }, [play]);

    return <Split>
        <Player/>
        <Papper>
            <TracksList>
                {
                    !!queue && queue.q.map((track) =><QueueTrack id={track} onPlay={onPlayQueueHandler}/>)
                }
            </TracksList>
        </Papper>
        <Find>
            <TracksList>
                {
                    !!tracksList && tracksList.map((track) =><Track track={track} onPlay={onPlayTrackHandler} onQueue={addHandler}/>)
                }
            </TracksList>
            <NavigationKeyboard/>
        </Find>
    </Split>
};

const Split = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    height: 100%;
    gap: 20px;
`;

const Find = styled(Papper)`
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 1fr;
    overflow: hidden;
    gap: 10px;
    grid-column: span 2;
`;

const TracksList = styled.div`
    width: 100%;
    height: 100%;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const QueueTrack: React.FC<{ id: string, onPlay: (id: string) => void }> = ({id, onPlay}) => {
    const {data: track} = useInfoQuery(id);
    return <>{
        !!track && <Track onPlay={onPlay} track={track}/>
    }</>
};

const Track: React.FC<{ track: TrackType, onPlay: (id: string) => void, onQueue?: (id: string) => void }> = ({ track, onPlay, onQueue }) => {
    const { value: current } = useMqtt("/music/current");
    const playHandler = useCallback(() => {
            onPlay(track.id);
    }, [onPlay, track])
    const addHandler = useCallback(() => {
        if (!onQueue || !track) {
            return
        }
        onQueue(track.id);
    }, [onQueue, track])
    const proggress = useMemo(() => {
        if (!current || current.id !== track.id) {
            return 0;
        }
        return current.current / current.total;
    }, [track, current])

    return <TrackWrapper>
        <TrackProggress progress={proggress}/>
        <TrackInfoWrapper>
            <TrackCover src={track.cover}/>
            <TrackTextWrapper>
                <Label>{track.title}</Label>
                <Label variant="secondary">{track.authors.join(", ")}</Label>
            </TrackTextWrapper>
        </TrackInfoWrapper>
        <TrackControlsWrapper>
            {
                !!onQueue && 
                    <Toggle onClick={addHandler}>
                        <QueueMusicIcon/>
                    </Toggle>
            }
            <Toggle onClick={playHandler}>
                <PlayArrowRoundedIcon/>
            </Toggle>
        </TrackControlsWrapper>
    </TrackWrapper>
};

const TrackWrapper = styled(Papper)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    position: relative;
    overflow: hidden;
    min-height: fit-content;
    max-height: fit-content;
`;

const TrackProggress = styled.div<{progress: number}>`
    position: absolute;
    left: 0;
    right: ${props => 100 - 100 * props.progress}%;
    top: 0;
    bottom: 0;
    background: ${props => props.theme.colors.primary};
    opacity: 0.5;
    transition: right 1s linear;
`;

const TrackInfoWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    z-index: 1;
`;

const TrackCover = styled.img`
    width: 64px;
    height: 64px;
    border-radius: 10px;
`;

const TrackTextWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const TrackControlsWrapper = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: row;
    z-index: 1;
`;
