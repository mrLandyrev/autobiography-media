import React, { useEffect, useMemo } from "react";
import { useStateQuery } from "../store/searchTracksApi";
import mqtt from "mqtt";


export const PlayerService: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // useStateQuery(undefined, {
    //     pollingInterval: 1000,
    // })

    
    return <>
        {children}
    </>
};