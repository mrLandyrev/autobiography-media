import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RoutingState {
    step: number;
}

const initialState: RoutingState = {
    step: 0,
}

export const routingSlice = createSlice({
    name: "routing",
    initialState,
    reducers: {
        setStep: (state, action: PayloadAction<number>) => {
            state.step = action.payload;
        },
    }
})

export const { setStep } = routingSlice.actions;
export const routingReducer = routingSlice.reducer;