import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useMqtt } from "../mqtt";
import { Papper } from "./Papper";

export const Notification: FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Record<string, Omit<MessageProps, "onTimeout" | "channel">>>({});
    const { value } = useMqtt("/power/left");
    const { value: pr } = useMqtt("/power/right");
    useEffect(() => {
        setMessages((messages) => {
            messages["/power/left"] = {
                text: value?.toString() || "",
                lifetime: 3,
            };
            return {...messages};
        });
    }, [value, setMessages]);

    useEffect(() => {
        setMessages((messages) => {
            messages["/power/right"] = {
                text: pr?.toString() || "",
                lifetime: 3,
            };
            return {...messages};
        });
    }, [pr, setMessages]);

    const onEnd = useCallback((channel: string) => {
        setMessages((messages) => {
            delete messages[channel];

            return {...messages};
        })
    }, [setMessages])

    return <Wrapper>
            {children}
            <MessagesBox>
                {
                    Object.entries(messages).map(([channel, message]) => <Message key={channel+message.text} {...message} channel={channel} onTimeout={onEnd} />)
                }
            </MessagesBox>
        </Wrapper>
};

const Wrapper = styled.div`
    width: 1920px;
    height: 720px;
    position: relative;
`;

const MessagesBox = styled.div`
    position: absolute;
    top: 0;
    left: 400px;
    right: 400px;
    display: flex;
    height: fit-content;
    flex-direction: column;
`;

type MessageProps = {
    channel: string;
    text: string;
    lifetime: number;
    onTimeout: (channel: string) => void;
};

const Message: FC<MessageProps> = ({ text, onTimeout, channel, lifetime }) => {
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        console.log("up");
        const start = Date.now();
        const interval = setInterval(() => {
            const now = Date.now();
            if (now > (start + lifetime * 1000)) {
                onTimeout(channel);
                clearInterval(interval);
                setProgress(1);
                return;
            }
            setProgress((now - start) / (lifetime * 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [text, lifetime, channel, onTimeout, setProgress]);

    return <MessageWrapper progress={progress}>{channel} {text}</MessageWrapper>
};

const MessageWrapper = styled(Papper)<{ progress: number }>`
    opacity: ${props => 1 - props.progress};
`;