import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ClimateState = {
    left: number;
    right: number;
}

const initialState: ClimateState = {
    left: 0,
    right: 0,
}

export const climateSlice = createSlice({
    name: "climate",
    initialState,
    reducers: {
        setLeft: (state, action: PayloadAction<number>) => {
            state.left = action.payload;
        },
        setRight: (state, action: PayloadAction<number>) => {
            state.right = action.payload;
        },
    },
})

export const {setLeft, setRight} = climateSlice.actions;
export const climateReducer = climateSlice.reducer;