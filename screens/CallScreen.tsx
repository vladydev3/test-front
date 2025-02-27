import Caller from "@/app/components/UI/Caller";
import { useUser } from "@/context/UserContext";
import {
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-native-sdk";
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Alert, Platform } from "react-native";
import { PERMISSIONS, requestMultiple } from "react-native-permissions";

export default function CallScreen() {
  const { user, token } = useUser();
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    const requestAndUpdatePermissions = async () => {
      if (Platform.OS === "ios") {
        // Request camera and mic permissions on iOS
        const results = await requestMultiple([
          PERMISSIONS.IOS.CAMERA,
          PERMISSIONS.IOS.MICROPHONE,
        ]);
      } else if (Platform.OS === "android") {
        // Request camera, mic, bluetooth and notification permissions on Android
        const results = await requestMultiple([
          PERMISSIONS.ANDROID.CAMERA,
          PERMISSIONS.ANDROID.RECORD_AUDIO,
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        ]);
        if (
          results[PERMISSIONS.ANDROID.CAMERA] === "granted" &&
          results[PERMISSIONS.ANDROID.RECORD_AUDIO] === "granted" &&
          results[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] === "granted"
        ) {
          setPermissionsGranted(true);
        }
      }
    };
    requestAndUpdatePermissions();
  }, []);

  if (!user || !token) {
    return (
      <View style={styles.container}>
        <Text>No user found. Please log in.</Text>
      </View>
    );
  }

  if (!permissionsGranted) {
    return (
      <View style={styles.container}>
        <Text>Requesting permissions...</Text>
      </View>
    );
  }

  const streamUser = {
    id: "1",
    name: user.name,
    image: `https://getstream.io/random_png/?id=1&name=${user.name}`,
  } as User;

  const apiKey = "5uvmbdmkb74t";

  const client = useMemo(() => {
    console.log("Creating new StreamVideoClient with user:", streamUser);
    return new StreamVideoClient({
      apiKey,
      user: streamUser,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSJ9.RTOqUPdNd-fu-xm8H__6Uh909Kx1EoOVTvLBIYb7bnw",
    });
  }, [apiKey, streamUser, token]);

  return (
    <View style={styles.container}>
      <StreamVideo client={client}>
        <Caller callId="1" />
      </StreamVideo>
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
