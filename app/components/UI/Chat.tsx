import React, { createContext, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { OverlayProvider, Chat } from 'stream-chat-react-native';
import { ReactNode } from 'react';

const API_KEY = 'TU_API_KEY_DE_STREAM'; // Reemplaza con tu API Key de Stream

const chatClient = StreamChat.getInstance(API_KEY);

export const ChatContext = createContext<{ chatClient: StreamChat | null }>({ chatClient: null });


interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    const connectUser = async () => {
      try {
        await chatClient.connectUser(
          {
            id: 'usuario1',
            name: 'Juan Pérez',
            image: 'https://randomuser.me/api/portraits/men/1.jpg',
          },
          chatClient.devToken('usuario1') // Token solo para pruebas, en producción usa un backend.
        );
        setClientReady(true);
      } catch (error) {
        console.error('Error conectando usuario:', error);
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
