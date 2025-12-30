import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GeoPoint, GeoJSON, Route } from "../types/geo";


type RouteResponse = {
    routes: Array<Route>;
};


export const routingApi = createApi({
    reducerPath: "routingApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://192.168.2.105:5000" }),
    endpoints: (builder) => ({
        route: builder.query<Route | undefined, Array<GeoPoint>>({
            query: (points) => {
                const q = points.map((point) => `${point.lon},${point.lat}`).join(";")
                return `route/v1/driving/${q}?overview=full&geometries=geojson&steps=true`;
            },
            transformResponse: (baseQueryReturnValue: RouteResponse) => {
                if (baseQueryReturnValue.routes.length === 0) {
                    return undefined;
                }
                return baseQueryReturnValue.routes[0];
            },
        })
    }),
})

export const { useLazyRouteQuery } = routingApi;