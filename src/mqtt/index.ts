import mqtt from "mqtt";
import { useCallback, useEffect, useState } from "react";
import { GeoPoint, Route } from "../types/geo";
import { Forecast } from "../types/forecast";

type Topics = {
    "/engine/speed": number;
    "/engine/rpm": number;
    "/power/left": number;
    "/power/right": number;
    "/navi/active/route": Route | null;
    "/navi/active/step": number | null;
    "/navi/position/gps": GeoPoint | null;
    "/navi/position/bearing": number | null;
    "/navi/active/waypoints": Array<GeoPoint>;
    "/weather/forecast": Array<Forecast>;
    "/music/current": { id: string | null, current: number, total: number };
    "/music/toggle": any;
    "/music/next": any;
    "/music/prev": any;
    "/music/status": "empty" | "pending" | "playing" | "stopped";
    "/music/queue": { q: Array<string>, p: number };
}

const client = mqtt.connect("ws://127.0.0.1:1884");

type Handler = <T extends keyof Topics>(data: Topics[T]) => void;

const handlers: Record<string, Record<string, Handler>> = {};
const addHandler = (topic: string, handler: Handler): string => {
    if (!handlers[topic]) {
        client.subscribe(topic);
        handlers[topic] = {};
    }

    const id = (Math.random() * Number.MAX_SAFE_INTEGER).toString();

    handlers[topic][id] = handler;

    return id;
};

client.on("message", (topic, payload) => {
    if (!handlers[topic]) {
        return;
    }

    let data: any = null;
    try {
        data = JSON.parse(payload.toString());
    } catch {}

    Object.values(handlers[topic]).forEach((handler) => {
        handler(data);
    });
});

const removeHandler = (topic: string, id: string) => {
    if (!handlers[topic] || !handlers[topic][id]) {
        throw Error("remove handler error");
    }

    delete handlers[topic][id];

    if (Object.keys(handlers[topic]).length === 0) {
        client.unsubscribe(topic);
        delete handlers[topic];
    }
}

const publishValue = <T extends keyof Topics>(topic: T, data: Topics[T], retain: boolean) => {
    client.publish(topic, JSON.stringify(data), {
        retain,
    });
}; 

export const useMqtt = <T extends keyof Topics>(topic: T) => {
    const [value, setValue] = useState<Topics[T] | undefined>(undefined);

    useEffect(() => {
        const handler: Handler = (data) => {
            setValue(data as Topics[T]);
        }
        const id = addHandler(topic, handler);
        return () => removeHandler(topic, id);
    }, [])

    const publish = useCallback((data: Topics[T], retain: boolean = true) => {
        publishValue(topic, data, retain);
    }, [])

    return { value, publish }
}