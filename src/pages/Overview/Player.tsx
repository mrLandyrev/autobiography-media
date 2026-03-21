import React, { useCallback } from "react";
import { Papper } from "../../components/Papper";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import styled from "styled-components";
import { useInfoQuery } from "../../store/searchTracksApi";
import { Label } from "../../components/Label";
import { Toggle } from "../../components/Toggle";
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import { useMqtt } from "../../mqtt";

export const Player: React.FC = () => {
    const { value } = useMqtt("/music/current");
    const { publish: toggle } = useMqtt("/music/toggle");
    const { publish: next } = useMqtt("/music/next");
    const { publish: prev } = useMqtt("/music/prev");
    const { value: status } = useMqtt("/music/status");
    const { data } = useInfoQuery(value?.id ?? "");

    const onPlayPauseClick = useCallback(() => {
        toggle(1, false);
    }, [toggle]);

    return <Wrapper>
        <CoverWrapper>
            <Cover src={!!data ? data.cover : ""}/>
            <Progress>
                <ProgressBar progress={!!value ? value.current/value.total * 100 : 0 }/>
            </Progress>
        </CoverWrapper>
        <Data>
            <Info>
                <Label variant="secondary">{data?.authors.join("/")}</Label>
            </Info>
            <Label variant="header">{data?.title}</Label>
            <Actions>
                <Toggle active={false} onClick={() => prev(1, false)}>
                    <SkipPreviousRoundedIcon/>
                </Toggle>
                <Toggle active={true} onClick={onPlayPauseClick}>
                    {
                        status === "playing"
                        ? <PauseRoundedIcon/>
                        : <PlayArrowRoundedIcon/>
                    }
                </Toggle>
                <Toggle active={false} onClick={() => next(1, false)}>
                    <SkipNextRoundedIcon/>
                </Toggle>
            </Actions>
        </Data>
    </Wrapper>
};

const Wrapper = styled(Papper)`
    display: grid;
    grid-template-rows: 2fr 1fr;
    gap: 20px;
    & > * {
        overflow: hidden;
    }
`;

const CoverWrapper = styled.div`
    margin: -20px -20px 0 -20px;
    position: relative;
`;

const Cover = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;


const Data = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const Info = styled.div``;


const Actions = styled.div`
    display: flex;
    gap: 20px;
`;

const Progress = styled.div`
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 10px;
    background: ${props => props.theme.colors.default};
`;

const ProgressBar = styled.div<{ progress: number }>`
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: ${props => props.theme.colors.primary};
    width: ${props => props.progress}%;
    transition: width 1s;
`;