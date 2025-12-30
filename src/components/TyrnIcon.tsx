import { FC } from "react";
import TurnSlightRightOutlinedIcon from '@mui/icons-material/TurnSlightRightOutlined';
import TurnRightOutlinedIcon from '@mui/icons-material/TurnRightOutlined';
import StraightOutlinedIcon from '@mui/icons-material/StraightOutlined';
import TurnSharpRightOutlinedIcon from '@mui/icons-material/TurnSharpRightOutlined';
import TurnLeftOutlinedIcon from '@mui/icons-material/TurnLeftOutlined';
import TurnSlightLeftOutlinedIcon from '@mui/icons-material/TurnSlightLeftOutlined';
import TurnSharpLeftOutlinedIcon from '@mui/icons-material/TurnSharpLeftOutlined';
import UTurnLeftOutlinedIcon from '@mui/icons-material/UTurnLeftOutlined';

export const TurnIcon:FC<{ maneur: string }> = ({maneur: direction}) => {
    switch (direction) {
        case "right": return <TurnRightOutlinedIcon style={{fontSize: 30}}/>;
        case "slight right": return <TurnSlightRightOutlinedIcon style={{fontSize: 30}}/>;
        case "sharp right": return <TurnSharpRightOutlinedIcon style={{fontSize: 30}}/>;
        case "straight": return <StraightOutlinedIcon style={{fontSize: 30}}/>;
        case "uturn": return <UTurnLeftOutlinedIcon style={{fontSize: 30}}/>;
        case "left": return <TurnLeftOutlinedIcon style={{fontSize: 30}}/>;
        case "slight left": return <TurnSlightLeftOutlinedIcon style={{fontSize: 30}}/>;
        case "sharp left": return <TurnSharpLeftOutlinedIcon style={{fontSize: 30}}/>;
        default: return <>{direction}</>
    }
} 