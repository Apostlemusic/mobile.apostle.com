import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // icons
import LinearGradient from "react-native-linear-gradient";
import tw from "twrnc";
import { useAudio } from "@/contexts/AudioContext";
import MusicPlayerModal from "./MusicPlayer";
import { usePlayer } from "../player/PlayerContext";
import { useTheme } from "@/contexts/ThemeContext";
import AuthorLink from "@/components/reusable/AuthorLink";

const MiniPlayer = () => {
  const { mode } = useTheme();
  const { 
    currentSong, 
    isPlaying, 
    playPauseSong, 
    handleNext, 
    handlePrev,
    progress,
    duration,
    formatTime 
  } = useAudio();

  const { playPauseToggle, previous } = usePlayer();

  const [showFullPlayer, setShowFullPlayer] = useState(false);

  // console.log('🎵 MiniPlayer render - currentSong:', currentSong?.title || 'None');

  // Use placeholder values when no song is playing
  const songTitle = currentSong?.title || "No Song Playing";
  const songAuthor = currentSong?.author || "Select a song to start";
  const songImage =
    currentSong?.trackImg || "https://via.placeholder.com/150x150?text=No+Song";
  const currentTime = currentSong ? formatTime(progress / 1000) : "0:00";
  const totalDuration = currentSong ? formatTime(duration / 1000) : "0:00";
  const textColor = mode === "dark" ? "#f3f4f6" : "#000000";
  const mutedColor = mode === "dark" ? "#9ca3af" : "#999999";
  const gradientColors = currentSong
    ? mode === "dark"
      ? ["#2f3341", "#1b1f2b"]
      : ["#77999B", "#81888842"]
    : mode === "dark"
      ? ["#2d2d35", "#111117"]
      : ["#CCCCCC", "#E0E0E0"];

  return (
    <>
      <Pressable 
        style={tw`absolute bottom-[5%] left-0 right-0 w-full mx-auto rounded-t-3xl`}
        onPress={() => currentSong && setShowFullPlayer(true)} // Only open if song is playing
        disabled={!currentSong} // Disable press when no song
      >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        locations={[0.5, 1]} // 60% solid, 40% fade
        style={tw`flex-row items-center justify-between p-3 pb-10 pt-2 rounded-t-3xl ${!currentSong ? 'opacity-60' : ''}`}
      >
        {/* Cover Art */}
        <Image
          source={{ uri: songImage }}
          style={tw`w-12 h-12 rounded-xl bg-gray-300 dark:bg-[#23232b]`}
          resizeMode="cover"
        />

        {/* Song Info */}
        <View style={tw`flex-1 ml-3`}>
          <Text style={[tw`font-semibold text-base ${!currentSong ? 'italic' : ''}`, { color: textColor }]} numberOfLines={1}>
            {songTitle}
          </Text>
          {currentSong ? (
            <AuthorLink
              name={songAuthor}
              style={[tw`text-xs`, { color: textColor }]}
              numberOfLines={1}
            />
          ) : (
            <Text
              style={[tw`text-xs italic`, { color: textColor }]}
              numberOfLines={1}
            >
              {songAuthor}
            </Text>
          )}
        </View>

        <View>
          <View style={tw`flex-row items-center gap-2`}>
            <Pressable onPress={handlePrev} disabled={!currentSong}>
              <Ionicons 
                name="play-skip-back" 
                size={24} 
                color={currentSong ? textColor : mutedColor} 
              />
            </Pressable>
            <Pressable 
              onPress={() => currentSong && playPauseSong(currentSong)}
              disabled={!currentSong}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={26}
                color={currentSong ? textColor : mutedColor}
              />
            </Pressable>
            <Pressable onPress={handleNext} disabled={!currentSong}>
              <Ionicons 
                name="play-skip-forward" 
                size={24} 
                color={currentSong ? textColor : mutedColor} 
              />
            </Pressable>
          </View>

          {/* Timer */}
          <View style={tw`ml-3 mt-1`}>
            <Text style={[tw`text-xs font-medium ${!currentSong ? 'opacity-50' : ''}`, { color: textColor }]}> 
              {currentTime} | {totalDuration}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>

    {/* Full Player Modal */}
    <MusicPlayerModal 
      visible={showFullPlayer} 
      onClose={() => setShowFullPlayer(false)} 
    />
    </>
  );
};

export default MiniPlayer;
