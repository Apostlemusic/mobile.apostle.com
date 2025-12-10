import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import TrackPlayer, {
  State,
  Event,
  usePlaybackState,
  useProgress,
  useActiveTrack,
  RepeatMode,
  Track,
} from "react-native-track-player";

interface Song {
  trackId: string;
  trackUrl: string;
  title: string;
  trackImg: string;
  author: string;
}

interface AudioContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  isShuffle: boolean;
  isRepeat: boolean;
  playingTrackId: string | null;
  queue: Song[];
  playPauseSong: (song: Song) => void;
  setCurrentSong: (song: Song) => void;
  handleSliderChange: (value: number) => void;
  handlePrev: () => void;
  handleNext: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (song: Song) => Promise<void>;
  removeFromQueue: (trackId: string) => Promise<void>;
  shuffleQueue: () => Promise<void>;
  refreshQueue: () => Promise<void>;
  formatTime: (time: number) => string;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);

  // Use TrackPlayer hooks
  const playbackState = usePlaybackState();
  const { position, duration } = useProgress();
  const activeTrack = useActiveTrack();

  const isPlaying = playbackState.state === State.Playing;
  const progress = position * 1000; // Convert to milliseconds
  const trackDuration = duration * 1000; // Convert to milliseconds

  useEffect(() => {
    // Listen for track changes
    const trackChangedListener = TrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      async (data) => {
        if (data.track) {
          const track = await TrackPlayer.getActiveTrack();
          if (track) {
            setCurrentSong({
              trackId: track.id as string,
              title: track.title || "Unknown",
              author: track.artist || "Unknown Artist",
              trackImg: track.artwork as string,
              trackUrl: track.url as string,
            });
            setPlayingTrackId(track.id as string);
          }
        }
      }
    );

    const queueListener = TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async () => {
      refreshQueue();
    });

    refreshQueue();

    return () => {
      trackChangedListener.remove();
      queueListener.remove();
    };
  }, []);
  const refreshQueue = async () => {
    try {
      const q = await TrackPlayer.getQueue();
      const mapped: Song[] = q.map(t => ({
        trackId: t.id as string,
        trackUrl: t.url as string,
        title: t.title || 'Unknown',
        trackImg: (t.artwork as string) || 'https://via.placeholder.com/150',
        author: t.artist || 'Unknown Artist'
      }));
      setQueue(mapped);
    } catch (e) {
      console.log('Error refreshing queue', e);
    }
  };

  const addToQueue = async (song: Song) => {
    try {
      const q = await TrackPlayer.getQueue();
      if (!q.find(t => t.id === song.trackId)) {
        await TrackPlayer.add({
          id: song.trackId,
          url: song.trackUrl,
          title: song.title,
          artist: song.author,
          artwork: song.trackImg,
        });
        await refreshQueue();
      }
    } catch (e) {
      console.log('Error adding to queue', e);
    }
  };

  const removeFromQueue = async (trackId: string) => {
    try {
      const q = await TrackPlayer.getQueue();
      const index = q.findIndex(t => t.id === trackId);
      if (index >= 0) {
        // TrackPlayer has no direct remove by id; rebuild queue excluding track
        const remaining = q.filter(t => t.id !== trackId);
        await TrackPlayer.reset();
        await TrackPlayer.add(remaining);
        await refreshQueue();
      }
    } catch (e) {
      console.log('Error removing from queue', e);
    }
  };

  const shuffleQueue = async () => {
    try {
      const q = await TrackPlayer.getQueue();
      const shuffled = [...q].sort(() => Math.random() - 0.5);
      await TrackPlayer.reset();
      await TrackPlayer.add(shuffled);
      await refreshQueue();
      setIsShuffle(true);
    } catch (e) {
      console.log('Error shuffling queue', e);
    }
  };

  const playPauseSong = async (song: Song) => {
    try {
      console.log('🎵 PlayPauseSong called with:', song.title);
      const queue = await TrackPlayer.getQueue();
      console.log('📋 Current queue length:', queue.length);
      const trackIndex = queue.findIndex((track) => track.id === song.trackId);

      if (currentSong?.trackId === song.trackId) {
        // Same song - toggle play/pause
        console.log('🔄 Toggling play/pause for current song');
        const state = await TrackPlayer.getPlaybackState();
        if (state.state === State.Playing) {
          await TrackPlayer.pause();
        } else {
          await TrackPlayer.play();
        }
      } else {
        // Different song - add to queue and play
        if (trackIndex >= 0) {
          // Track already in queue, skip to it
          await TrackPlayer.skip(trackIndex);
          await TrackPlayer.play();
        } else {
          // Add new track to queue
          console.log('➕ Adding new track to queue:', song.title);
          await TrackPlayer.add({
            id: song.trackId,
            url: song.trackUrl,
            title: song.title,
            artist: song.author,
            artwork: song.trackImg,
          });
          
          // Get the new track index and skip to it
          const newQueue = await TrackPlayer.getQueue();
          const newTrackIndex = newQueue.findIndex((track) => track.id === song.trackId);
          console.log('✅ Track added at index:', newTrackIndex);
          if (newTrackIndex >= 0) {
            await TrackPlayer.skip(newTrackIndex);
          }
          await TrackPlayer.play();
        }

        setCurrentSong(song);
        setPlayingTrackId(song.trackId);
        console.log('✅ Song setup complete');
      }
    } catch (error) {
      console.error("❌ Error playing/pausing song:", error);
    }
  };

  const handleSliderChange = async (value: number) => {
    try {
      await TrackPlayer.seekTo(value / 1000); // Convert milliseconds to seconds
    } catch (error) {
      console.error("Error seeking:", error);
    }
  };

  const handlePrev = async () => {
    try {
      if (position > 3) {
        // If more than 3 seconds into the track, restart it
        await TrackPlayer.seekTo(0);
      } else {
        // Otherwise, go to previous track
        await TrackPlayer.skipToPrevious();
      }
    } catch (error) {
      console.error("Error going to previous track:", error);
    }
  };

  const handleNext = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.error("Error going to next track:", error);
    }
  };

  const toggleShuffle = async () => {
    try {
      const newShuffleState = !isShuffle;
      setIsShuffle(newShuffleState);
      // TrackPlayer doesn't have built-in shuffle, you'd need to implement queue shuffling
    } catch (error) {
      console.error("Error toggling shuffle:", error);
    }
  };

  const toggleRepeat = async () => {
    try {
      const newRepeatState = !isRepeat;
      setIsRepeat(newRepeatState);
      await TrackPlayer.setRepeatMode(
        newRepeatState ? RepeatMode.Track : RepeatMode.Off
      );
    } catch (error) {
      console.error("Error toggling repeat:", error);
    }
  };

  const formatTime = (time: number) => {
  // time is in seconds
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        progress,
        duration: trackDuration,
        isShuffle,
        isRepeat,
        playingTrackId,
        queue,
        setCurrentSong,
        playPauseSong,
        handleSliderChange,
        handlePrev,
        handleNext,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        removeFromQueue,
        shuffleQueue,
        refreshQueue,
        formatTime,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
