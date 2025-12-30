export type GeocoderPlace = GeoPoint & {
    display_name: string;
    name: string;
};

export type GeoPoint = {
    lat: number,
    lon: number,
}

export type GeoJSON = {
    coordinates: [[number, number]];
    type: "LineString";
}

export type Route = {
    geometry: GeoJSON,
    legs: Array<{
        steps: Array<RouteStep>,
    }>
};

export type RouteStep = {
    maneuver: {
        modifier: string,
        location: [
            number,
            number,
        ],
        bearing_before: number,
    },
    name: string,
}