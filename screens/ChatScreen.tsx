import React, { useContext, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Channel, MessageList, MessageInput, ChannelList } from "stream-chat-react-native";
import { ChatContext } from "@/context/ChatProvider";
import type { Channel as ChannelType } from "stream-chat";

export const ChatScreen = () => {
    const chatContext = useContext(ChatContext);
    const chatClient = chatContext ? chatContext.chatClient : null;

    const [channel, setChannel] = useState<ChannelType | null>(null);

    const filters = { type: "messaging", members: { $in: ["usuario1"] } };
    const sort = { last_message_at: -1 };

    if (!chatClient) {
        return <ActivityIndicator size="large" />;
    }

    return channel ? (
        <Channel channel={channel}>
            <MessageList />
            <MessageInput />
        </Channel>
    ) : (
        <ChannelList filters={filters} onSelect={(channel) => setChannel(channel)} />
    );
};
