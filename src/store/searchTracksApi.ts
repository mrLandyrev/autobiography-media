import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrackType } from '../types/tracks';
import { PlayerData } from '../types/playerState';
import { q } from 'react-router/dist/development/index-react-server-client-CCjKYJTH';

export const tracksApi = createApi({
    reducerPath: "tracksApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://192.168.2.105:8076/" }),
    endpoints: (builder) => ({
        searchTracks: builder.query<Array<TrackType>, string>({
            query: (query) => `search?q=${query}`,
            keepUnusedDataFor: 0,
        }),
        cache: builder.query<string, string>({
            query: (query) => `cache/${query}`,
            onQueryStarted: async (query, a) => {
                try {
                    // a.queryFulfilled.finally(() => {
                    //     a.dispatch(tracksApi.endpoints.playTrack.initiate(query));
                    // });
                } catch {}
            },
        }),
        state: builder.query<PlayerData, undefined>({
            query: () => `status`,
            keepUnusedDataFor: 0,
        }),
        info: builder.query<TrackType, string>({
            query: (query) => `info/${query}`,
            keepUnusedDataFor: 0,
        }),
        playTrack: builder.mutation<undefined, { track?: string, queue_id?: string, position?: number }>({
            query: (body) => ({
                url: "playPlaylist",
                body: {
                    track: body.track || "",
                    queue_id: body.queue_id || "feed",
                    position: body.position ?? -1
                },
                method: "POST",
            })
        }),
        playQueue: builder.mutation<undefined, {q: Array<string>, p: number}>({
            query: (body) => ({
                url: `play?q=${body.q.join("&q=")}&p=${body.p}`,
                method: "GET",
            }),
        }),
        addToQueue: builder.mutation<undefined, {q: Array<string>}>({
            query: (body) => ({
                url: `add?q=${body.q.join("&q=")}`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useSearchTracksQuery,
    useCacheQuery,
    usePlayTrackMutation,
    useLazyCacheQuery,
    useStateQuery,
    useInfoQuery,
    usePlayQueueMutation,
    useAddToQueueMutation,
} = tracksApi;