import React from "react";
import { Stack } from "expo-router";
import { PlayerProvider } from "../components/player/PlayerContext";
import TrackPlayer from "react-native-track-player";

// Register the playback service
TrackPlayer.registerPlaybackService(() => require('../services/trackPlayerService').playbackService);

export default function RootLayout() {
  // Remove duplicate setup; PlayerProvider will initialize as needed
  return (
    <PlayerProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PlayerProvider>
  );
}
