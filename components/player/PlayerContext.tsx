import React, { createContext, useCallback, useContext, useRef } from "react";
import TrackPlayer, { State } from "react-native-track-player";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initTrackPlayer, simplePlayUrl } from "../../services/trackPlayerService";

type PlayerContextType = {
  playById: (id: string) => Promise<void>;
  playPauseToggle: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const getBaseUrl = () =>
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "";

/**
 * ✅ You said you'll be using Mongo `_id` for fetching by id. Example:
 * 695feebab51dace3ab702268
 */
const isMongoObjectId = (val: string) =>
  /^[a-f\d]{24}$/i.test(String(val ?? "").trim());

async function fetchSongByMongoId(id: string) {
  const base = getBaseUrl();
  if (!base) throw new Error("Missing API base url. Set EXPO_PUBLIC_API_BASE_URL.");

  // attach auth if required by backend
  const token =
    (await AsyncStorage.getItem("accessToken")) ||
    (await AsyncStorage.getItem("token")) ||
    (await AsyncStorage.getItem("authToken")) ||
    (await AsyncStorage.getItem("apostle.token")) ||
    (await AsyncStorage.getItem("apostle.accessToken"));

  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  const res = await fetch(`${base}/api/content/songs/${encodeURIComponent(id)}`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to fetch song ${id} (${res.status}) ${body}`);
  }

  const json = await res.json();
  const s = json?.song ?? json?.data ?? json;

  const url =
    s?.trackUrl || s?.url || s?.audioUrl || s?.previewUrl || s?.streamUrl;
  if (!url) throw new Error("No trackUrl found in response");

  return {
    url,
    meta: {
      // TrackPlayer id should be stable; use _id primarily
      id: String(s?._id ?? s?.id ?? id),
      title: s?.title ?? s?.name ?? "Untitled",
      artist:
        s?.author ??
        s?.artist ??
        (Array.isArray(s?.artists) ? s.artists.join(", ") : "Unknown Artist"),
      artwork: s?.trackImg ?? s?.artworkUrl ?? s?.image,
    },
  };
}

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const initializedRef = useRef(false);

  const ensureInitialized = useCallback(async () => {
    if (initializedRef.current) return;
    await initTrackPlayer();
    initializedRef.current = true;
  }, []);

  const playById = useCallback(
    async (id: string) => {
      try {
        await ensureInitialized();

        // ✅ Only allow _id usage going forward (avoid TRK-* causing backend cast errors)
        if (!isMongoObjectId(id)) {
          throw new Error(
            `playById expects Mongo _id (24 hex chars). Got: ${String(id)}`
          );
        }

        const { url, meta } = await fetchSongByMongoId(id);
        await simplePlayUrl(url, meta);
      } catch (e) {
        console.warn("playById failed:", e);
      }
    },
    [ensureInitialized]
  );

  const playPauseToggle = useCallback(async () => {
    try {
      await ensureInitialized();
      const state = await TrackPlayer.getState();
      if (state === State.Playing) await TrackPlayer.pause();
      else await TrackPlayer.play();
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