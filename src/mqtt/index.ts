import mqtt from "mqtt";
import { useCallback, useEffect, useState } from "react";
import { GeoPoint, Route } from "../types/geo";

type Topics = {
    "/engine/speed": number;
    "/engine/rpm": number;
    "/power/left": number;
    "/power/right": number;
    "/navi/active/route": Route | null;
    "/navi/active/step": number | null;
    "/navi/position/gps": GeoPoint | null;
    "/navi/active/waypoints": Array<GeoPoint>;
}

const client = mqtt.connect("ws://192.168.2.71:9001");

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

    const data = JSON.parse(payload.toString());

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

const publishValue = <T extends keyof Topics>(topic: T, data: Topics[T]) => {
    client.publish(topic, JSON.stringify(data), {
        retain: true,
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

    const publish = useCallback((data: Topics[T]) => {
            publishValue(topic, data)
    }, [])

    return { value, publish }
}