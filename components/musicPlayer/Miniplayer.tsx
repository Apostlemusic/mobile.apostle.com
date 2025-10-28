import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // icons
import { LinearGradient } from "expo-linear-gradient";
import tw from "twrnc";
import { useAudio } from "@/contexts/AudioContext";

const MiniPlayer = () => {
  const { currentSong } = useAudio();
  const [isPlaying, setIsPlaying] = useState(true);

  const songTitle = currentSong?.title || "No Song Playing";
  const songAuthor = currentSong?.author || "Unknown Artist";
  const songImage =
    currentSong?.trackImg || "https://via.placeholder.com/150x150";
  const duration = currentSong?.duration || "0:00";
  const currentTime = currentSong?.currentTime || "0:00";

  return (
    <Pressable style={tw`absolute bottom-[5%] left-0 right-0 w-full mx-auto rounded-t-3xl`}>
      <LinearGradient
        colors={["#77999B", "#81888842"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        locations={[0.5, 1]} // 60% solid, 40% fade
        style={tw`flex-row items-center justify-between p-3 pb-10 pt-2 rounded-t-3xl`}
      >
        {/* Cover Art */}
        <Image
          source={{ uri: songImage }}
          style={tw`w-12 h-12 rounded-xl bg-gray-300`}
          resizeMode="cover"
        />

        {/* Song Info */}
        <View style={tw`flex-1 ml-3`}>
          <Text style={tw`text-black font-semibold text-base`} numberOfLines={1}>
            {songTitle}
          </Text>
          <Text style={tw`text-black text-xs`} numberOfLines={1}>
            {songAuthor}
          </Text>
        </View>

        <View>
          <View style={tw`flex-row items-center gap-2`}>
            <Ionicons name="play-skip-back" size={24} color="black" />
            <Pressable onPress={() => setIsPlaying(!isPlaying)}>
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={26}
                color="black"
              />
            </Pressable>
            <Ionicons name="play-skip-forward" size={24} color="black" />
          </View>

          {/* Timer */}
          <View style={tw`ml-3 mt-1`}>
            <Text style={tw`text-black text-xs font-medium`}>
              {currentTime} | {duration}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

export default MiniPlayer;
