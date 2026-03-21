import { configureStore } from "@reduxjs/toolkit";
import { searchTracksReducer } from "./searchTracksSlice";
import { tracksApi } from "./searchTracksApi";
import { geocoderApi } from "./geocoderApi";
import { routingApi } from "./rotingApi";
import { routingReducer } from "./routingSlice";
import { engineReducer } from "./engine/engineSlice";
import { climateReducer } from "./climate/slice";

export const store = configureStore({
    reducer: {
        searchTracksSlice: searchTracksReducer,
        routingSlice: routingReducer,
        engineReducer: engineReducer,
        climateReducer: climateReducer,
        [tracksApi.reducerPath]: tracksApi.reducer,
        [geocoderApi.reducerPath]: geocoderApi.reducer,
        [routingApi.reducerPath]: routingApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        tracksApi.middleware,
        geocoderApi.middleware,
        routingApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;