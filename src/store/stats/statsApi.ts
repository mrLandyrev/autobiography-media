import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



export const statsApi = createApi({
    reducerPath: "statsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8428" }),
    endpoints: (builder) => ({
        workingTime: builder.query<any, string>({
            query: (query) => {
                return `/api/v1/query_range?query=${query}&start=-5m&end-10s&step=5s`;
            },
            transformResponse: (resp: any) => {
                return resp;
            },
        }),
    }),
})

export const { useWorkingTimeQuery, useLazyWorkingTimeQuery } = statsApi;