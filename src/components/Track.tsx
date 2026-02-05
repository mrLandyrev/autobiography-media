import { FC, useEffect } from "react"
import styled, { css, keyframes } from "styled-components"
import { useDraggable } from "@dnd-kit/core";
import { TrackType } from "../types/tracks";
import { useLazyCacheQuery, usePlayTrackMutation } from "../store/searchTracksApi";

export const Track: FC<TrackType & {isDownloading: boolean}> = ({ id, title, authors, cover, downloaded, isDownloading }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    });
    const [triggerPlay] = usePlayTrackMutation();
    const [triggerCache, { data }] = useLazyCacheQuery();
    useEffect(() => {
        if (data === "ok") {
            downloaded = true;
        }
    }, [data]);
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;
    return <Wrapper
            ref={setNodeRef} style={style} {...listeners} {...attributes}
            onClick={() => downloaded ? triggerPlay({
                queue_id: "feed",
                track: id
            }) : triggerCache(id) }
            isDownloading={isDownloading}
        >
        <Cover src={cover} />
        <Info>
            <Title>{title}</Title>
            <Authors>{authors.join(", ")}</Authors>
        </Info>
        <Actions>
            {
                !!downloaded && <Play/>
            }
        </Actions>
    </Wrapper>
}

const DownloadingAnimation = keyframes`
    0% {
        background: #222222;
    }
    100% {
        background: #494949;
    }
`;

const downloadingAnimation = css`1s ${DownloadingAnimation} infinite;`

const Wrapper = styled.div<{ isDownloading: boolean }>`
    min-width: 320px;
    width: 100%;
    height: 64px;
    border-radius: 12px;
    display: flex;
    column-gap: 12px;
    place-items: center start;
    overflow: hidden;
    border: 2px solid gray;
    background: #222222;
    animation: ${props => props.isDownloading ? downloadingAnimation : "none"};
    min-height: 64px;
`

const Cover = styled.img`
    width: 64px;
    height: 64px;
    background: black;
`;

const Info = styled.div`
`;

const Title = styled.div`
    color: white;
    font-size: 30px;
`;
const Authors = styled.div`
    color: #a0a0a0;
    font-size: 20px;
`;

const Actions = styled.div``;
const Play = styled.div`
    width: 10px;
    height: 10px;
    background: green;
`;