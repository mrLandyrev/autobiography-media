import React from "react";
import { useStateQuery } from "../store/searchTracksApi";

export const PlayerService: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useStateQuery(undefined, {
        pollingInterval: 1000,
    })
    
    return <>
        {children}
    </>
};