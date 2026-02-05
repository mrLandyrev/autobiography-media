import React from "react";
import { Papper } from "./Papper";

export const Panel: React.FC<{ children: React.ReactNode, width?: number, height?: number, isOpen: boolean }> = ({ children, width, height, isOpen }) => {
    return <Papper style={{position: "relative", display: isOpen ? 'block' : 'none'}}>
        <div style={{
            position: "absolute",
            left: 12,
            top: 12,
            height: height ? height - 24 : "calc(100% - 24px)",
            width: width ? width - 24 : "calc(100% - 24px)",
        }}>
            { children }
        </div>
    </Papper>
};