import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { PlayerProvider } from "@/components/player/PlayerContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { View, Platform, StatusBar as RNStatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/contexts/ThemeContext";
import Toast from "react-native-toast-message";

const ThemedRoot = () => {
  const { colors, mode } = useTheme();

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight ?? 0 : 0,
      }}
    >
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </SafeAreaView>
  );
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <PlayerProvider>
          <ThemedRoot />
          <Toast />
        </PlayerProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
