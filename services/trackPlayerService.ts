import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  State,
  Track,
} from "react-native-track-player";

let initialized = false;

export async function initTrackPlayer() {
  if (initialized) return;
  try {
    await TrackPlayer.setupPlayer();
  } catch (e: any) {
    // If already initialized elsewhere, mark as initialized and continue
    if (String(e?.message || e).includes("already been initialized")) {
      initialized = true;
    } else {
      throw e;
    }
  }
  if (!initialized) {
    await TrackPlayer.updateOptions({
      stoppingAppPausesPlayback: true,
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      alwaysPauseOnInterruption: true,
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext, Capability.SkipToPrevious],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
        Capability.Stop,
      ],
    });
    initialized = true;
  }
}

export async function simplePlayUrl(url: string, meta?: Partial<Track>) {
  await initTrackPlayer();
  // Reset queue to ensure add() succeeds and we play the requested track
  await TrackPlayer.reset();
  const track: Track = {
    id: meta?.id ?? url,
    url,
    title: meta?.title ?? "Unknown Title",
    artist: meta?.artist ?? "Unknown Artist",
    artwork: meta?.artwork,
  };
  await TrackPlayer.add([track]);
  await TrackPlayer.play();
}

// Minimal headless service to keep notifications responsive
export const playbackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
    if (typeof event.position === "number") {
      TrackPlayer.seekTo(event.position);
    }
  });
  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    try { await TrackPlayer.skipToNext(); await TrackPlayer.play(); } catch {}
  });
  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    try {
      const index = await TrackPlayer.getActiveTrackIndex();
      if (index === 0 || index === null || index === undefined) {
        await TrackPlayer.seekTo(0);
        await TrackPlayer.play();
        return;
      }
      await TrackPlayer.skipToPrevious();
      await TrackPlayer.play();
    } catch {
      try {
        await TrackPlayer.seekTo(0);
        await TrackPlayer.play();
      } catch {}
    }
  });
};

export const TrackPlayerEvents = {
  Event,
  State,
};
