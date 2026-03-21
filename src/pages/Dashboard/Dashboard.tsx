import React from "react";
import { Navigation } from "./Navigation";
import { Speedometer } from "./Speedometer";
import { Player } from "./Player";
import { ModernTaho } from "./ModernTaho";

export const Dashboard: React.FC = () => {
    return<>
        <Navigation zoom={17}/>
        <Speedometer style={{
            position: "absolute",
            left: 30,
            bottom: 30,
        }}/>
        <Player/>
        <ModernTaho/>
    </>
}