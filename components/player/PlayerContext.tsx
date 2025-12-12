import React, { createContext, useCallback, useContext, useRef } from "react";
import TrackPlayer, { State, Event } from "react-native-track-player";
import { initTrackPlayer, simplePlayUrl } from "../../services/trackPlayerService";

type PlayerContextType = {
  playById: (id: string) => Promise<void>;
  playPauseToggle: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

async function fetchSongById(id: string) {
  const res = await fetch(`https://apostle.onrender.com/api/song/getASongs/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch song ${id}`);
  const json = await res.json();
  const s = json?.data ?? json;
  const url = s?.trackUrl || s?.url || s?.audioUrl;
  if (!url) throw new Error("No trackUrl found in response");
  return {
    url,
    meta: {
      id: String(s?.id ?? s?._id ?? id),
      title: s?.title ?? s?.name ?? "Untitled",
      artist: s?.author ?? s?.artist ?? "Unknown Artist",
      artwork: s?.artworkUrl ?? s?.image ?? s?.trackImg,
    },
  };
}

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initializedRef = useRef(false);

  const ensureInitialized = useCallback(async () => {
    if (initializedRef.current) return;
    await initTrackPlayer(); // must be idempotent
    initializedRef.current = true;
  }, []);

  const playById = useCallback(async (id: string) => {
    try {
      await ensureInitialized();
      const { url, meta } = await fetchSongById(id);
      await simplePlayUrl(url, meta);
    } catch (e) {
      console.warn("playById failed:", e);
    }
  }, [ensureInitialized]);

  const playPauseToggle = useCallback(async () => {
    try {
      await ensureInitialized();
      const state = await TrackPlayer.getState();
      if (state === State.Playing) {
        await TrackPlayer.pause();
      } else {
        // If nothing is queued, this will no-op; caller should call playById first.
        await TrackPlayer.play();
      }
    } catch (e) {
      console.warn("playPauseToggle failed:", e);
    }
  }, [ensureInitialized]);

  const next = useCallback(async () => {
    try {
      await ensureInitialized();
      await TrackPlayer.skipToNext();
      await TrackPlayer.play();
    } catch (e) {
      // no next track or not queued
      console.warn("next failed:", e);
    }
  }, [ensureInitialized]);

  const previous = useCallback(async () => {
    try {
      await ensureInitialized();
      await TrackPlayer.skipToPrevious();
      await TrackPlayer.play();
    } catch (e) {
      console.warn("previous failed:", e);
    }
  }, [ensureInitialized]);

  return (
    <PlayerContext.Provider value={{ playById, playPauseToggle, next, previous }}>
      {children}
    </PlayerContext.Provider>
  );
};

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}

// Optional GlobalPlayer component to mount UI (Miniplayer) with provider kept outside of pages
export const GlobalPlayer: React.FC = () => {
  // If you want to show Miniplayer globally, import and render it here
  // This keeps Miniplayer and FullPlayer in sync via the shared context + TrackPlayer
  return null;
};