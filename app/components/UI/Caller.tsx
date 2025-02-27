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
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, Button, GestureResponderEvent } from "react-native";

export default function Caller({ callId }: { callId: string }) {
  const [call, setCall] = useState<Call | null>(null);
  const client = useStreamVideoClient();

  useEffect(() => {
    const _call = client?.call("default", callId);
    // client?.connectUser();
    console.log("call created...", _call);
    _call?.join({ create: true }).then(() => {
      setCall(_call);
      console.log("you have joined to a call!!!");
      console.log("call value: ", call);
    }).catch((e: any) => {
      console.log("ERROR: ", e);
    })
  }, [client, callId]);

  useEffect(() => {
    return () => {
      // cleanup the call on unmount if the call was not left already
      if (call?.state.callingState !== CallingState.LEFT) {
        call?.leave();
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
