import React from "react";
import { Papper } from "../components/Papper";

export const Youtube: React.FC = () => {
    return <Papper variant={"borderless"}>
            <iframe id="ytplayer" width="1720" height="720" style={{paddingLeft: 200}}
  src="https://www.youtube.com/embed/1PPjLNLTpUA?autoplay=1&origin=http://example.com"></iframe>
        </Papper>
};