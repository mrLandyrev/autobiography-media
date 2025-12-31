import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { SearchTracks } from "../components/SearchTracks";
import { Player } from "../components/Player";
import { PlayerService } from "../services/player.service";

export const MusicPage: FC = () => {
    return <PlayerService>
        <Wrapper>
            <Player />
            <SearchTracks />
        </Wrapper>
    </PlayerService>
};

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: end;
    grid-gap: 12px;
    overflow: hidden;
    position: relative;
    & > * {
        overflow: hidden;
    }
`