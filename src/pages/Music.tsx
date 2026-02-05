import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { SearchTracks } from "../components/SearchTracks";
import { Player } from "../components/Player";

export const MusicPage: FC = () => {
    return <Wrapper>
        <SearchTracks />
        <Player />
    </Wrapper>
};

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    z-index: 0;
    padding-left: 142px;
    gap: 12px;
    grid-template-columns: 800px 1fr;
    & > * {
        overflow: hidden;
    }
`