import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { PlayerProvider } from "@/components/player/PlayerContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PlayerProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </PlayerProvider>
    </GestureHandlerRootView>
  );
}
