import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrackType } from '../types/tracks';
import { PlayerData } from '../types/playerState';

export const tracksApi = createApi({
    reducerPath: "tracksApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://192.168.2.105:8077/" }),
    endpoints: (builder) => ({
        searchTracks: builder.query<Array<TrackType>, string>({
            query: (query) => `search?query=${query}`,
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
        pause: builder.query<undefined, undefined>({
            query: () => `pause`,
        }),
        cont: builder.query<undefined, undefined>({
            query: () => `cont`,
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
    useLazyPauseQuery,
    useLazyContQuery,
} = tracksApi;