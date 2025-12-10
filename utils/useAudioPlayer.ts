// utils/useAudioPlayer.ts
// This hook now simply re-exports the AudioContext for backward compatibility
import { useAudio } from "@/contexts/AudioContext";

export const useAudioPlayer = () => {
  return useAudio();
};