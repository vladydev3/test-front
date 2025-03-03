import React, { createContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { OverlayProvider, Chat } from "stream-chat-react-native";
import { ReactNode } from "react";
import { useUser } from "./UserContext";

const API_KEY = "5uvmbdmkb74t"; // Reemplaza con tu API Key de Stream

const chatClient = StreamChat.getInstance(API_KEY);


interface ChatContextType {
    chatClient: StreamChat;
}

export const ChatContext = createContext<ChatContextType | null>(null);


export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [clientReady, setClientReady] = useState(false);
    const user = useUser()
    useEffect(() => {
        const connectUser = async () => {
            try {
                await chatClient.connectUser(
                    {
                        id: user.user?.id ?? '',
                        name: user.user?.name ?? '',
                        image: "https://randomuser.me/api/portraits/men/1.jpg",
                    },
                    chatClient.devToken("usuario1") // Token solo para pruebas, en producción usa un backend.
                );
                setClientReady(true);
            } catch (error) {
                console.error("Error conectando usuario:", error);
            }
        };

        connectUser();

        return () => {
            chatClient.disconnectUser();
        };
    }, []);

    if (!clientReady) return null; // Espera a que el cliente esté listo

    return (
        <ChatContext.Provider value={{ chatClient }}>
            <OverlayProvider>
                <Chat client={chatClient}>{children}</Chat>
            </OverlayProvider>
        </ChatContext.Provider>
    );
};
