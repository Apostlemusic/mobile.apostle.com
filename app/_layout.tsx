import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { PlayerProvider } from "@/components/player/PlayerContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/contexts/ThemeContext";

const ThemedRoot = () => {
  const { colors, mode } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <PlayerProvider>
          <ThemedRoot />
        </PlayerProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
