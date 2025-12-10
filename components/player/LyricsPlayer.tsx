import React from "react";
import { View, Text, ImageBackground, ScrollView, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { useAudio } from "@/contexts/AudioContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

interface LyricsPlayerProps {
  onClose: () => void;
  onBack: () => void;
}

export function LyricsPlayer({ onClose, onBack }: LyricsPlayerProps) {
  const { currentSong } = useAudio();

  if (!currentSong) return null;

  return (
    <ImageBackground
      source={{ uri: currentSong.trackImg }}
      blurRadius={20}
      style={tw`flex-1 p-4 pt-10`}
    >
      <View style={tw`flex-row items-center justify-between p-4 pt-10`}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="chevron-back" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={tw`mt-8`}>
        <Text style={tw`text-gray-300 text-sm mb-5`}>({currentSong.title})</Text>

        {/* Placeholder for lyrics - lyrics feature can be added later */}
        <View style={tw`items-center justify-center mt-20`}>
          <Text style={tw`text-white text-lg font-bold mb-4`}>🎵</Text>
          <Text style={tw`text-white text-center opacity-70`}>
            Lyrics not available for this song
          </Text>
          <Text style={tw`text-white text-center opacity-50 mt-2 text-sm`}>
            Enjoying: {currentSong.title}
          </Text>
        </View>
      </ScrollView>

      {/* Mini player at bottom */}
      <View style={tw`mt-auto bg-white bg-opacity-30 rounded-xl p-4`}>
        <Text style={tw`text-white font-semibold`}>{currentSong.title}</Text>
        <Text style={tw`text-white opacity-80 text-sm`}>{currentSong.author}</Text>
      </View>
    </ImageBackground>
  );
}
