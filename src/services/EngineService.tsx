import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setRpm, setSpeed } from "../store/engine/engineSlice";
import mqtt from "mqtt";
import { setCurrent, setQueue, setQueuePosition, setStatus } from "../store/searchTracksSlice";
import { setLeft, setRight } from "../store/climate/slice";

export const EngineService: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const client = mqtt.connect("ws://192.168.2.71:9001");
        client.subscribe("/engine/#");
        client.subscribe("/music/#")
        client.subscribe("/power/#")
        client.on("message", (topic, payload) => {
            switch (topic) {
                case "/engine/speed":
                    dispatch(setSpeed(+payload.toString()));
                    break;
                case "/engine/rpm":
                    dispatch(setRpm(+payload.toString()));
                    break;
                case "/music/status":
                    dispatch(setStatus(payload.toString() as any));
                    break;
                case "/music/current":
                    dispatch(setCurrent(+payload.toString()));
                    break;
                case "/music/queue":
                    dispatch(setQueue(JSON.parse(payload.toString())));
                    break;
                case "/music/queue_position":
                    dispatch(setQueuePosition(JSON.parse(payload.toString())));
                    break;
                case "/power/left":
                    dispatch(setLeft(JSON.parse(payload.toString())));
                    break;
                case "/power/right":
                    dispatch(setRight(JSON.parse(payload.toString())));
                    break;
            }
        });
    }, []);


    return <>{children}</>
};