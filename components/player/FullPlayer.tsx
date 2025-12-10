import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import tw from "twrnc";
import Slider from "@react-native-community/slider";
import { useAudio } from "@/contexts/AudioContext";
import { Waveform } from "./Waveform";
import { Controls } from "./Controls";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { MoreMenu } from './MoreMenu';
import { QueueModal } from './QueueModal';

interface FullPlayerProps {
  onClose: () => void;
  onLyricsToggle: () => void;
}

export function FullPlayer({ onClose, onLyricsToggle }: FullPlayerProps) {
  const [showMore, setShowMore] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const {
    currentSong,
    progress,
    duration,
    formatTime,
    handleSliderChange,
  } = useAudio();

  // Use seconds for progress and duration
  const progressSec = progress / 1000;
  const durationSec = duration / 1000;

  if (!currentSong) return null;

  return (
    <>
    <View style={tw`flex-1`}>
      <Image
        source={{ uri: currentSong.trackImg }}
        style={tw`absolute w-full h-full`}
        blurRadius={0}
      />
      <View style={tw`absolute inset-0 bg-black opacity-50`} />

      <View style={tw`flex-row items-center justify-between p-4 pt-10`}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="chevron-back" size={32} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-white font-medium`}>
          {currentSong.title} - {currentSong.author}
        </Text>
        <TouchableOpacity onPress={() => setShowMore(true)}>
          <MaterialIcons name="more-vert" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <View style={tw`flex-1 justify-end`}>
        <View style={tw`bg-white bg-opacity-30 p-4 rounded-[40px] m-3`}>
          <TouchableOpacity onPress={onLyricsToggle} style={tw`mb-4`}>
            <Text style={tw`text-white text-center text-xs `}>Show Lyrics</Text>
          </TouchableOpacity>

          <Waveform progress={durationSec > 0 ? progressSec / durationSec : 0} />

          <View style={tw`flex-row items-center justify-between mt-3`}>
            <Text style={tw`text-white text-xs`}>{formatTime(progressSec)}</Text>
            <Text style={tw`text-white text-xs`}>{formatTime(durationSec)}</Text>
          </View>

          <Slider
            minimumValue={0}
            maximumValue={durationSec}
            value={progressSec}
            onValueChange={(value) => handleSliderChange(value * 1000)}
            minimumTrackTintColor="white"
            maximumTrackTintColor="rgba(255,255,255,0.4)"
            thumbTintColor="white"
          />

          <Controls />
        </View>
      </View>
    </View>
    <MoreMenu
      visible={showMore}
      onClose={() => setShowMore(false)}
      onShowQueue={() => setShowQueue(true)}
    />
    <QueueModal
      visible={showQueue}
      onClose={() => setShowQueue(false)}
    />
    </>
  );
}
