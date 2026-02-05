import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Forecast } from "./types";

export const weatherApi = createApi({
    reducerPath: "weatherApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://192.168.2.46:5665" }),
    endpoints: (builder) => ({
        getForecast: builder.query<Array<Forecast>, undefined>({
            query: () => "",
        }),
    }),
})

export const { useLazyGetForecastQuery } = weatherApi;
