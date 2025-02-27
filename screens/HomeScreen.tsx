import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Call: undefined;
};

export default function HomeScreen({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) {
  return (
    <View style={styles.container}>
      <Button title="Login" onPress={() => navigation.navigate("Login")} />
      <Button title="Llamada" onPress={() => navigation.navigate("Call")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
