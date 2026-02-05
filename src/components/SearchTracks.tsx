import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../store/store";
import { setQuery } from "../store/searchTracksSlice";
import { useSearchTracksQuery } from "../store/searchTracksApi";
import { Track } from "./Track";
import useDebounce from "../utils/useDebounce";
import { SearchInput } from "./SearchInput";
import Keyboard from "react-simple-keyboard";
import { Papper } from "./Papper";

export const SearchTracks: FC = () => {
    const query = useSelector((state: RootState) => state.searchTracksSlice.query);
    const list = useSelector((state: RootState) => state.searchTracksSlice.list);
    const debouncedQ = useDebounce(query, 1000);
    const { isFetching } = useSearchTracksQuery(debouncedQ);

    return <Wrapper>
        <List>
            {
                !!isFetching
                    ?
                    <div style={{color: "white"}}>"loading"</div>
                    :
                    <>
                        {
                            list.map((track) => <Track {...track} />)
                        }
                    </>
            }

        </List>
        <SearchInput value={query} />
        <Keyboard layout={{
            'ru': [
                "1 2 3 4 5 6 7 8 9 0",
                "\u0439 \u0446 \u0443 \u043a \u0435 \u043d \u0433 \u0448 \u0449 \u0437 \u0445 \u044a",
                "\u0444 \u044b \u0432 \u0430 \u043f \u0440 \u043e \u043b \u0434 \u0436 \u044d",
                "\u044f \u0447 \u0441 \u043c \u0438 \u0442 \u044c \u0431 \u044e",
                "{space} {bksp} / ,",
            ]
        }} layoutName="ru"/>
    </Wrapper>
};

const Wrapper = styled(Papper)`
    display: grid;
    gap: 12px;
    z-index: 1;
    grid-template-rows: 1fr auto 300px;
    & > * {
        overflow: hidden;
    }
`;

const List = styled.div`
    overflow-y: scroll;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;
