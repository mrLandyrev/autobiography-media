import styled from "styled-components";
export type PapperProps = {
    variant?: "default" | "primary" | "secondary",
    disabled?: boolean,
}

const t = styled.div`
 background: ${(props) => props.theme.colors.primary};
`;

export const Papper = styled.div<PapperProps>`
    width: 100%;
    height: 100%;
    border: 2px solid ${(props) => 
        props.variant == "primary" ? props.theme.colors.primary:
        props.variant == "secondary" ? props.theme.colors.secondary:
        "gray"};
    border-radius: 12px;
    background: #000000cf;
    padding: 12px;
    color: white;
    font-size: 30px;
    line-height: 30px;
    opacity: ${props => !!props.disabled ? 0.5 : 1};
`;