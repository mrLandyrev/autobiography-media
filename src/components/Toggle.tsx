import styled from "styled-components";

export type ToggleProps = Partial<{
    active: boolean,
    variant: "full" | "fit",
}>;

export const Toggle = styled.div<ToggleProps>`
    width: ${props => props.variant === "full" ? "100%" :
                      props.variant === "fit" ? "fit-content" :
                      "64px"};
    height: ${props => props.variant === "full" ? "100%" : "64px"};
    border-radius: ${props => props.variant === "full" ? "20px" : "10px"};
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.default};
    color: ${props => props.active ? "white" : "gray"};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: 200ms;

    & > * {
        width: ${props => props.variant === "full" ? "50%" :
                          props.variant === "fit" ? "fit-content" :
                          "40px"} !important;
        height: ${props => props.variant === "full" ? "50%" :
                          props.variant === "fit" ? "fit-content" :
                          "40px"} !important;
    }
`;