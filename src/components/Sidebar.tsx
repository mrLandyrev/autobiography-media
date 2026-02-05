import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined';
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Link, NavLink } from "react-router";
import { Papper } from "./Papper";
import { Clock } from "../pages/Overview/Clock";

export const Sidebar: FC = () => {
    return <Wrapper>
        <Container>
            <Section to={"overview"}>
                <DirectionsCarFilledOutlinedIcon />
            </Section>
            <Section to={"navigation"}>
                <NavigationOutlinedIcon />
            </Section>
            <Section to={"music"}>
                <LibraryMusicOutlinedIcon />
            </Section>
            <Section to={"youtube"}>
                <YouTubeIcon />
            </Section>
        </Container>
    </Wrapper>
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 128px;
    gap: 20px;
`;

const Container = styled(Papper)`
    display: flex;
    flex-direction: column;
`;

const Section = styled(NavLink)`
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    color: gray;
    border-radius: 20px;
    position: static;
    transition: 200ms;
    &:visited {
        color: gray;
    }
    &.active {
        background: ${props => props.theme.colors.primary};
        color: white;
    }
    & * {
        font-size: 50px !important;
    }
`