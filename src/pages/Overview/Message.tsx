import React from "react";
import { Papper } from "../../components/Papper";
import styled from "styled-components";
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import { Label } from "../../components/Label";

export const Message: React.FC = () => {
    return <Wrapper>
        <Label>
            @ "Оставайтесь голодными, оставайтесь безрассудными"
        </Label>
    </Wrapper>
};

const Wrapper = styled(Papper)`
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-gap: 10px;
    place-items: center start;
`;