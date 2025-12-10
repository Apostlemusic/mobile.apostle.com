import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  ImageBackground,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import tw from "twrnc";
import Slider from "@react-native-community/slider";
import { useAudio } from "@/contexts/AudioContext";
import { usePlayer } from "../player/PlayerContext";

import { FullPlayer } from "../player/FullPlayer";
import { LyricsPlayer } from "../player/LyricsPlayer";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function MusicPlayerModal({ visible, onClose }: Props) {
  const { currentSong } = useAudio();
  const [showLyrics, setShowLyrics] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { audioUrl, isPlaying, currentTrack, onAudioRefAttach, volume } = usePlayer();

  useEffect(() => {
    if (audioRef.current) {
      onAudioRefAttach(audioRef.current);
    }
  }, [onAudioRefAttach]);

  useEffect(() => {
    if (!audioRef.current) return;

    // Load the current source
    audioRef.current.src = audioUrl ?? '';
    audioRef.current.load();

    // Auto-play if requested
    if (isPlaying && audioUrl) {
      audioRef.current
        .play()
        .catch(() => {
          // Autoplay policy: swallow silently or show a toast
        });
    } else {
      audioRef.current.pause();
    }
  }, [audioUrl, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  if (!currentSong) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={tw`flex-1 bg-black bg-opacity-80`}>
        {!showLyrics ? (
          <FullPlayer
            onClose={onClose}
            onLyricsToggle={() => setShowLyrics(true)}
          />
        ) : (
          <LyricsPlayer
            onClose={() => { onClose(); setShowLyrics(false); }}
            onBack={() => setShowLyrics(false)}
          />
        )}
      </View>
    </Modal>
  );
}
