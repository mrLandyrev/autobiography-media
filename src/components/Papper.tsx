import styled from "styled-components";
export type PapperProps = {
    variant?: "default" | "primary" | "secondary" | "borderless",
    disabled?: boolean,
    isHidden?: boolean,
}

export const Papper = styled.div<PapperProps>`
    width: 100%;
    height: 100%;
    border-radius: 20px;
    background: ${props => 
        props.variant === "primary" ? props.theme.colors.primary :
        props.variant === "secondary" ? props.theme.colors.secondary :
        props.theme.colors.default
    };
    padding: ${props => props.variant === "borderless" ? 0 : "20px"};
    color: white;
    font-size: 30px;
    line-height: 30px;
    opacity: ${props => !!props.isHidden ? 0 : !!props.disabled ? 0.5 : 1};
    transition: opacity 1s;
`;