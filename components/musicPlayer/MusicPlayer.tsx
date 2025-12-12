import React, { useState, useEffect } from "react";
import { Modal, View } from "react-native";
import tw from "twrnc";
import { useAudio } from "@/contexts/AudioContext";
import { FullPlayer } from "../player/FullPlayer";
import { LyricsPlayer } from "../player/LyricsPlayer";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function MusicPlayerModal({ visible, onClose }: Props) {
  const { currentSong } = useAudio();
  const [showLyrics, setShowLyrics] = useState(false);

  useEffect(() => {
    if (!visible) setShowLyrics(false);
  }, [visible]);

  if (!visible || !currentSong) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={tw`flex-1 bg-black/80`}>
        {!showLyrics ? (
          <FullPlayer onClose={onClose} onLyricsToggle={() => setShowLyrics(true)} />
        ) : (
          <LyricsPlayer onClose={() => setShowLyrics(false)} onBack={() => setShowLyrics(false)} />
        )}
      </View>
    </Modal>
  );
}
