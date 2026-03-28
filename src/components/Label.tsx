import styled from "styled-components";

export type LabelProps = Partial<{
    variant: "secondary" | "header";
}>

export const Label = styled.div<LabelProps>`
    color: ${props => props.variant === "secondary" ? "gray" : "white"};
    font-weight: ${props => props.variant === "secondary" ? 300 : 400};
    font-size: ${props => props.variant === "header" ? "40px" : "20px"};
    line-height: ${props => props.variant === "header" ? "40px" : "20px"};
`;