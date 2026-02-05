import { FC } from "react";
import TurnSlightRightOutlinedIcon from '@mui/icons-material/TurnSlightRightOutlined';
import TurnRightOutlinedIcon from '@mui/icons-material/TurnRightOutlined';
import StraightOutlinedIcon from '@mui/icons-material/StraightOutlined';
import TurnSharpRightOutlinedIcon from '@mui/icons-material/TurnSharpRightOutlined';
import TurnLeftOutlinedIcon from '@mui/icons-material/TurnLeftOutlined';
import TurnSlightLeftOutlinedIcon from '@mui/icons-material/TurnSlightLeftOutlined';
import TurnSharpLeftOutlinedIcon from '@mui/icons-material/TurnSharpLeftOutlined';
import UTurnLeftOutlinedIcon from '@mui/icons-material/UTurnLeftOutlined';
import SportsScoreOutlinedIcon from '@mui/icons-material/SportsScoreOutlined';

export const TurnIcon:FC<{ maneur: string, size?: "small" | "high" }> = ({maneur, size}) => {
    switch (maneur) {
        case "right": return <TurnRightOutlinedIcon style={{fontSize: size == "high" ? 100 : 30}}/>;
        case "slight right": return <TurnSlightRightOutlinedIcon style={{fontSize: size == "high" ? 100 : 30}}/>;
        case "sharp right": return <TurnSharpRightOutlinedIcon style={{fontSize: size == "high" ? 100 : 30}}/>;
        case "straight": return <StraightOutlinedIcon style={{fontSize: size == "high" ? 100 : 30}}/>;
        case "uturn": return <UTurnLeftOutlinedIcon style={{fontSize: size == "high" ? 100 : 30}}/>;
        case "left": return <TurnLeftOutlinedIcon style={{fontSize: size == "high" ? 100 : 30}}/>;
        case "slight left": return <TurnSlightLeftOutlinedIcon style={{fontSize: size == "high" ? 100 : 30}}/>;
        case "sharp left": return <TurnSharpLeftOutlinedIcon style={{fontSize: size == "high" ? 100 : 30}}/>;
        case "finish": return <SportsScoreOutlinedIcon style={{fontSize: size == "high" ? 100 : 30}}/>;
        default: return <>{maneur}</>
    }
} 