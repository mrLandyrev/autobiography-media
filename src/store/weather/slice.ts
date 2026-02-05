import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Forecast } from "./types"
import { engineReducer, engineSlice } from "../engine/engineSlice";

export type WeatherState = {
    forecast: Array<Forecast>;
}

const initialState: WeatherState = {
    forecast: [],
}

export const weatherSlice = createSlice({
    name: "weather",
    initialState,
    reducers: {
        setForecast: (state, action: PayloadAction<Array<Forecast>>) => {
            state.forecast = action.payload;
        },
    }
});

export const { setForecast } = weatherSlice.actions;
export const weatherReducer = weatherSlice.reducer;