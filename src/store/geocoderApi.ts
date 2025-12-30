import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GeocoderPlace } from "../types/geo";

type SearchResponse = Array<GeocoderPlace & {
    lat: string;
    lon: string;
}>;

export const geocoderApi = createApi({
    reducerPath: "geocoderApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://192.168.2.71:8087" }),
    endpoints: (builder) => ({
        search: builder.query<Array<GeocoderPlace>, string>({
            query: (query) => `search?q=${query}`,
            transformResponse: (response: SearchResponse) => response.map(place => ({
                ...place,
                lat: +place.lat,
                lon: +place.lon,
            }))
        })
    }),
})

export const { useSearchQuery } = geocoderApi;