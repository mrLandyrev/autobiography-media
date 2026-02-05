import { configureStore } from "@reduxjs/toolkit";
import { searchTracksReducer } from "./searchTracksSlice";
import { tracksApi } from "./searchTracksApi";
import { geocoderApi } from "./geocoderApi";
import { routingApi } from "./rotingApi";
import { routingReducer } from "./routingSlice";
import { engineReducer } from "./engine/engineSlice";
import { weatherReducer } from "./weather/slice";
import { weatherApi } from "./weather/api";
import { climateReducer } from "./climate/slice";

export const store = configureStore({
    reducer: {
        searchTracksSlice: searchTracksReducer,
        routingSlice: routingReducer,
        engineReducer: engineReducer,
        weatherReducer: weatherReducer,
        climateReducer: climateReducer,
        [tracksApi.reducerPath]: tracksApi.reducer,
        [geocoderApi.reducerPath]: geocoderApi.reducer,
        [routingApi.reducerPath]: routingApi.reducer,
        [weatherApi.reducerPath]: weatherApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        tracksApi.middleware,
        geocoderApi.middleware,
        routingApi.middleware,
        weatherApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;