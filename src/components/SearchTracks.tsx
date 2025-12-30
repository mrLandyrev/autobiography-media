import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../store/store";
import { setQuery } from "../store/searchTracksSlice";
import { useSearchTracksQuery } from "../store/searchTracksApi";
import { Track } from "./Track";
import useDebounce from "../utils/useDebounce";
import { SearchInput } from "./SearchInput";

export const SearchTracks: FC = () => {
    const query = useSelector((state: RootState) => state.searchTracksSlice.query);
    const list = useSelector((state: RootState) => state.searchTracksSlice.list);
    const dispatch = useDispatch();
    const debouncedQ = useDebounce(query, 1000);
    const { isFetching } = useSearchTracksQuery(debouncedQ);

    return <Wrapper>
        <SearchInput value={query} />
        <List>
            {
                !!isFetching
                    ?
                    <div style={{color: "white"}}>"loading"</div>
                    :
                    <ListContent>
                        {
                            list.map((track) => <Track {...track} />)
                        }
                    </ListContent>
            }

        </List>
    </Wrapper>
};

const Wrapper = styled.div`
    height: 100%;
    width: 400px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow: hidden;
    z-index: 1;
`;

const List = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 12px;
    padding: 8px;
    overflow-y: scroll;
    border: 2px solid gray;
`;

const ListContent = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;
