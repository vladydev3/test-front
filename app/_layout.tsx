import AppNavigator from "@/navigation/AppNavigator";
import { UserProvider } from "@/context/UserContext";
import { ChatProvider } from "@/context/ChatProvider"; // Importa el ChatProvider

export default function RootLayout() {
  return (
    <UserProvider>
      <ChatProvider> {/* Envolvemos toda la app con el ChatProvider */}
        <AppNavigator />
      </ChatProvider>
    </UserProvider>
  );
}
