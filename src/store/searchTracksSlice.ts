import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tracksApi } from "./searchTracksApi";
import { TrackType } from "../types/tracks";

export interface SearchTracksState {
    query: string;
    list: Array<TrackType & { isDownloading: boolean }>;
};

const initialState: SearchTracksState = {
    query: "",
    list: [],
}

export const searchTracksSlice = createSlice({
    name: "searchTracks",
    initialState,
    reducers: {
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            tracksApi.endpoints.searchTracks.matchFulfilled,
            (state, action) => {
                state.list = action.payload.map((track) => ({
                    ...track,
                    isDownloading: false,
                }));
            },
        );
        builder.addMatcher(
            tracksApi.endpoints.cache.matchFulfilled,
            (state, action) => {
                state.list.forEach((x) => {
                    if (x.id !== action.meta.arg.originalArgs) {
                        return;
                    }
                    x.downloaded = true;
                    x.isDownloading = false;
                })
            }
        );
        builder.addMatcher(
            tracksApi.endpoints.cache.matchPending,
            (state, action) => {
                state.list.forEach((x) => {
                    if (x.id !== action.meta.arg.originalArgs) {
                        return;
                    }
                    x.isDownloading = true;
                })
            },
        );
    },
});

export const { setQuery } = searchTracksSlice.actions;
export const searchTracksReducer = searchTracksSlice.reducer;