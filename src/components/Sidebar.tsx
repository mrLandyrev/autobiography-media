import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined';
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Link, NavLink } from "react-router";
import { Papper } from "./Papper";
import { Clock } from "./Clock";

export const Sidebar: FC = () => {
    return <Wrapper>
        <Container>
            <Section to={"/navigation"}>
                <NavigationOutlinedIcon />
            </Section>
            <Section to={"/"}>
                <LibraryMusicOutlinedIcon />
            </Section>
            <Section to={"/youtube"}>
                <YouTubeIcon />
            </Section>
        </Container>
        <Clock/>
    </Wrapper>
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 128px;
    gap: 12px;
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
    color: #363636;
    border-radius: 12px;
    position: static;
    &:visited {
        color: #363636;
    }
    &.active {
        background: ${props => props.theme.colors.default};
        color: ${props => props.theme.colors.primary};
    }
    & * {
        font-size: 50px !important;
    }
`