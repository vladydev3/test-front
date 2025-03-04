import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { IconDownload, IconPlus } from "@tabler/icons-react-native";
import { useUser } from "@/context/UserContext";
import { UserRespository } from "@/repository/auth/userRepository";
import { AuthService } from "@/services/auth/authService";
import { ILoginRequest } from "@/types/auth";
import { useRouter } from "expo-router";

const LoginScreen: React.FC = () => {
  const repository = new UserRespository(
    process.env.EXPO_PUBLIC_API_URL as string
  );
  const userService = new AuthService(repository);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const { token, setToken, user, setUser } = useUser();

  const handleLogin = async () => {
    if (!email.trim()) setError("El correo electrónico es obligatorio");
    if (!password.trim()) setError("La contraseña es obligatoria");
    const loginFormData: ILoginRequest = {
      email: email,
      password: password,
    };
    try {
      const response = await userService.login(loginFormData);
      setToken(response.streamToken);
      setUser({
        id: response.id,
        name: response.name,
      });

      console.log("user object: ", response);

      Alert.alert("Correcto", "Inicio de sesion exitoso");
      router.replace("/")
    } catch (error) {
      setError("Error al iniciar sesión");
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Inicie sesión</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <View style={styles.buttonContent}>
            <IconDownload color="white" />
            <Text style={styles.buttonText}>Iniciar</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6", // bg-gray-100
  },
  formContainer: {
    width: "80%", // w-4/5
    padding: 16, // p-4
    backgroundColor: "white",
    borderRadius: 8, // rounded-lg
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // shadow-md equivalent
  },
  title: {
    fontSize: 24, // text-2xl
    fontWeight: "bold",
    textAlign: "center",
    color: "#1e1b4b", // text-purple-950
    marginBottom: 16, // mb-4
  },
  inputGroup: {
    marginBottom: 12, // mb-3
  },
  label: {
    fontSize: 14, // text-sm
    fontWeight: "500", // font-medium
    marginBottom: 4, // mb-1
    color: "#1e1b4b", // text-purple-950
  },
  input: {
    height: 40, // h-10
    borderWidth: 1,
    borderColor: "#d1d5db", // border-gray-300
    borderRadius: 4, // rounded
    paddingHorizontal: 8, // px-2
    color: "#1e1b4b", // text-purple-950
  },
  button: {
    backgroundColor: "#7c3aed", // bg-purple-600
    padding: 12, // p-3
    borderRadius: 6, // rounded-md
    marginTop: 40, // mt-10
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8, // gap-x-2
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});
export default LoginScreen;
