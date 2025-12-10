import React, { createContext, useCallback, useContext } from "react";
import TrackPlayer, { State } from "react-native-track-player";
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
  // API returns { data: { trackUrl, title, author, image, id } }
  const s = json?.data ?? json;
  const url = s?.trackUrl || s?.url;
  if (!url) throw new Error("No trackUrl found in response");
  return {
    url,
    meta: {
      id: s?.id ?? id,
      title: s?.title,
      artist: s?.author ?? s?.artist,
      artwork: s?.artworkUrl ?? s?.image ?? s?.trackImg,
    },
  };
}

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const playById = useCallback(async (id: string) => {
    // Keep it simple: init -> fetch -> play
    await initTrackPlayer();
    const { url, meta } = await fetchSongById(id);
    await simplePlayUrl(url, meta);
  }, []);

  const playPauseToggle = useCallback(async () => {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  }, []);

  const next = useCallback(async () => {
    try { await TrackPlayer.skipToNext(); await TrackPlayer.play(); } catch {}
  }, []);

  const previous = useCallback(async () => {
    try { await TrackPlayer.skipToPrevious(); await TrackPlayer.play(); } catch {}
  }, []);

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