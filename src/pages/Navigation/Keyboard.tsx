import React, { useCallback, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "../../keyboard.css";
import 'react-simple-keyboard/build/css/index.css';
import { setQuery } from "../../store/searchTracksSlice";
import { useDispatch } from "react-redux";
import { backpaceSearchQuery, updateSearchQuery } from "../../store/routingSlice";

export const NavigationKeyboard: React.FC = () => {
    const [lay, setLay] = useState("ru");
    const dispatch = useDispatch();

    const onKeyPress = useCallback((btn: string) => {
        switch (btn) {
            case "{nmb}":
                setLay("nmb");
                break;
            case "{let}":
                setLay("ru");
                break;
            case "{space}":
                dispatch(updateSearchQuery(" "))
                break;
            case "{bksp}":
                dispatch(backpaceSearchQuery())
                break;
            default:
                dispatch(updateSearchQuery(btn))
                break;
        }
    }, [setLay]);

    return <Keyboard
        layout={{
            'ru': [
                "й ц у к е н г ш щ х ъ",
                "ф ы в а п р о л д ж э",
                "я ч с м и т ь б ю {bksp}",
                "{nmb} {space}",
            ],
            'nmb': [
                "1 2 3 4 5 6 7 8 9 0",
                "! @ # $ % ^ & * ( )",
                ". ? /",
                "{let} {space}",
            ],
        }}
        display={{
            "{bksp}": "<",
            "{nmb}": "!123",
            "{space}": "  ",
            "{let}": "qwe"
        }}
        layoutName={lay}
        onKeyPress={onKeyPress}
        theme={"hg-theme-default hg-layout-default myTheme"}
    />
};