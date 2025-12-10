import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import TrackPlayer, { State } from "react-native-track-player";
import { usePlayer } from "./PlayerContext";

export function Controls() {
  const { playPauseToggle, next, previous } = usePlayer();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkState = async () => {
      try {
        const s = await TrackPlayer.getState();
        if (mounted) setIsPlaying(s === State.Playing);
      } catch {}
    };
    checkState();
    const interval = setInterval(checkState, 800);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={tw`flex-row justify-between items-center mt-3`}>
      <TouchableOpacity onPress={() => { /* TODO: add shuffle */ }}>
        <MaterialIcons name="shuffle" size={28} color={"white"} />
      </TouchableOpacity>

      <TouchableOpacity onPress={previous}>
        <Ionicons name="play-skip-back" size={32} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={async () => {
          await playPauseToggle();
          const s = await TrackPlayer.getState();
          setIsPlaying(s === State.Playing);
        }}
        style={tw`px-3 py-3 rounded-full`}
      >
        {isPlaying ? (
          <Ionicons name="pause" size={50} color="white" />
        ) : (
          <Ionicons name="play" size={50} color="white" />
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={next}>
        <Ionicons name="play-skip-forward" size={32} color="white" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => { /* TODO: add repeat */ }}>
        <MaterialIcons name="repeat" size={28} color={"white"} />
      </TouchableOpacity>
    </View>
  );
}
