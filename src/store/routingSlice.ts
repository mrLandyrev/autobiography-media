import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GeocoderPlace, GeoPoint, Route } from "../types/geo";

export interface RoutingState {
    step: number;
    active: Route | undefined;
    userPosition: GeoPoint;
    nearest: string;
    searchQuery: string;
    searchResult: Array<GeocoderPlace>;
    selectedResult: GeocoderPlace | undefined;
    selectedResultRoute: Route | undefined;
}

const initialState: RoutingState = {
    step: 0,
    active: undefined,
    userPosition: {
        lon: 38.852879,
        lat: 47.215912,
    },
    nearest: "",
    searchQuery: "",
    searchResult: [],
    selectedResult: undefined,
    selectedResultRoute: undefined,
}

export const routingSlice = createSlice({
    name: "routing",
    initialState,
    reducers: {
        setStep: (state, action: PayloadAction<number>) => {
            state.step = action.payload;
        },
        updateSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery += action.payload;
        },
        backpaceSearchQuery: (state) => {
            if (state.searchQuery.length === 0 || state.searchQuery.length === 1) {
                state.searchQuery = "";
            } else {
                state.searchQuery = state.searchQuery.slice(0, -1);
            }
        },
        clearSearchQuery: (state) => {
            state.searchQuery = "";
        },
        setActiveRoute: (state) => {
            state.searchQuery = "";
            state.searchResult = [];
            state.active = state.selectedResultRoute;
            state.step = 0;
            state.selectedResult = undefined;
            state.selectedResultRoute = undefined;
        },
        setActive: (state, action: PayloadAction<Route | undefined>) => {
            state.searchQuery = "";
            state.searchResult = [];
            state.active = action.payload;
            state.step = 0;
            state.selectedResult = undefined;
            state.selectedResultRoute = undefined;
        },
        setSearchResult: (state, action: PayloadAction<Array<GeocoderPlace>>) => {
            if (state.searchResult === action.payload) {
                return;
            }
            state.searchResult = action.payload;
            state.selectedResult = undefined;
            state.selectedResultRoute = undefined;
        },
        setSelectedResult: (state, action: PayloadAction<GeocoderPlace | undefined>) => {
            if (state.selectedResult === action.payload) {
                return;
            }
            state.selectedResult = action.payload;
            state.selectedResultRoute = undefined;
        },
        setSelectedResultRoute: (state, action: PayloadAction<Route | undefined>) => {
            state.selectedResultRoute = action.payload;
        },
        setUserPosition: (state, action: PayloadAction<GeoPoint>) => {
            state.userPosition = action.payload;
        },
        setNearest: (state, action: PayloadAction<string>) => {
            state.nearest = action.payload;
        },
    },
})

export const {
    setStep,
    updateSearchQuery,
    clearSearchQuery,
    backpaceSearchQuery,
    setActiveRoute,
    setSearchResult,
    setSelectedResult,
    setSelectedResultRoute,
    setUserPosition,
    setNearest,
    setActive,
} = routingSlice.actions;
export const routingReducer = routingSlice.reducer;