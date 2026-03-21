import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GeoPoint, GeoJSON, Route } from "../types/geo";


type RouteResponse = {
    routes: Array<Route>;
};

type NearestResponse = {
    waypoints: Array<{name: string}>;
};


export const routingApi = createApi({
    reducerPath: "routingApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:5000" }),
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
        }),
        nearest: builder.query<string | null, GeoPoint>({
            query: (point) => {
                const q = `${point.lon},${point.lat}`;
                return `nearest/v1/driving/${q}`;
            },
            transformResponse: (response: NearestResponse) => {
                if (response.waypoints.length === 0) {
                    return null;
                }
                return response.waypoints[0].name;
            },
        })
    }),
})

export const { useLazyRouteQuery, useRouteQuery, useLazyNearestQuery } = routingApi;