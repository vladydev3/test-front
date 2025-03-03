import { useUser } from "@/context/UserContext";
import {
  Call,
  CallContent,
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  User,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, Button, GestureResponderEvent } from "react-native";

export default function Caller({ callId }: { callId: string }) {
  const [call, setCall] = useState<Call | null>(null);
  const client = useStreamVideoClient();
  const user = useUser().user
  const token = useUser().token
  useEffect(() => {
    if (client && user && token) {
      console.log("Connecting user with token...", token);
      client
        .connectUser(
          { id: user.id, name: user.name } as User,
          token
        )
        .then(() => {
          console.log("User connected successfully");
          const _call = client.call("default", callId);
          if (_call) {
            setCall(_call);
            _call
              .join({ create: true })
              .then(() => {
                console.log("You have joined the call!!!");
              })
              .catch((e) => {
                console.log("ERROR joining call: ", e);
              });
          }
        })
        .catch((e) => {
          console.log("ERROR connecting user: ", e);
        });
    } else {
      console.log("Client, user, or token is missing");
    }
  }, [client, user, token, callId]);

  useEffect(() => {
    return () => {
      if (call && call.state.callingState !== CallingState.LEFT) {
        call.leave()
          .then(() => {
            console.log("Call left successfully");
            client?.disconnectUser()
          })
          .catch((e) => {
            console.log("ERROR leaving call: ", e);
          });
      }
    };
  }, [call]);

  if (!call) {
    return (
      <View style={styles.container}>
        <Text>Joining call...</Text>
      </View>
    );
  }

  function goToHomeScreen(): void {
    if (call) {
      call.leave();
    }
    router.replace("/");
  }

  return (
    <StreamCall call={call}>
      <View style={styles.container}>
        <CallContent
          onHangupCallHandler={goToHomeScreen}
        />
        <Text>Calling</Text>
      </View>
    </StreamCall>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  callContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  callingText: {
    fontSize: 20,
    marginBottom: 20,
  },
  startCallButton: {
    backgroundColor: "#93c5fd",
    padding: 16,
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
  },
  endCallButton: {
    backgroundColor: "#ef4444",
    padding: 16,
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
