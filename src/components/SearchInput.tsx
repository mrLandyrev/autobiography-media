import { FC, SyntheticEvent, useCallback, useState } from "react";
import styled from "styled-components";
import { Papper } from "./Papper";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

type Props = {
    placeholder?: string;
    value: string;
    onFocusedChange?: (state: boolean) => void;
    onClear?: () => void;
};

export const SearchInput: FC<Props> = ({ value, placeholder, onFocusedChange, onClear }) => {

    const [focused, setFocsed] = useState(false);

    const onClick = useCallback(() => {
        setFocsed(v => {
            v = !v;
            onFocusedChange?.(v);
            return v;
        })
    }, [setFocsed, onFocusedChange]);

    const onClearClick = useCallback((e: SyntheticEvent<any>) => {
        e.preventDefault();
        e.stopPropagation();
        onClear?.()
    }, [onClear])

    return <Wrapper onClick={() => onClick?.()} variant={focused ? "primary" : "default"}>
        <SearchOutlinedIcon style={{ fontSize: 30 }} />
        {
            focused || value
                ? <Value>{value}</Value>
                : <Placeholder>{placeholder || "Найти"}</Placeholder>
        }
        <ClearOutlinedIcon style={{ fontSize: 30 }} onClick={onClearClick}/>
    </Wrapper>
}

const Wrapper = styled(Papper)`
    display: grid;
    grid-template-columns: auto 1fr auto;
    overflow: hidden;
    gap: 6px;
`

const Placeholder = styled.div`
    color: gray;
`;
const Value = styled.div`
    width: 100%;
    overflow-x: scroll;
    overflow-wrap: break-word;
`;