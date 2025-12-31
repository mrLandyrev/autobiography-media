import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tracksApi } from "./searchTracksApi";
import { TrackType } from "../types/tracks";

export interface SearchTracksState {
    query: string;
    list: Array<TrackType & { isDownloading: boolean }>;
    status: "playing" | "paused" | "empty";
    current: number;
    queue: Array<string>;
    position: number;
};

const initialState: SearchTracksState = {
    query: "",
    list: [],
    status: "empty",
    current: 0,
    queue: [],
    position: 0,
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
        builder.addMatcher(
            tracksApi.endpoints.state.matchFulfilled,
            (state, action) => {
                state.status = action.payload.status;
                state.current = action.payload.current;
                state.queue = action.payload.queue;
                state.position = action.payload.queue_position;
            },
        )
    },
});

export const { setQuery } = searchTracksSlice.actions;
export const searchTracksReducer = searchTracksSlice.reducer;