import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type EngineState = {
    rpm: number;
    speed: number;
}

const initialState: EngineState = {
    rpm: 0,
    speed: 0,
}

export const engineSlice = createSlice({
    name: "engine",
    initialState,
    reducers: {
        setRpm: (state, action: PayloadAction<number>) => {
            state.rpm = action.payload;
        },
        setSpeed: (state, action: PayloadAction<number>) => {
            state.speed = action.payload;
        },
    },
})

export const {setRpm, setSpeed} = engineSlice.actions;
export const engineReducer = engineSlice.reducer;