import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  Platform,
} from "react-native";
import tw from "twrnc";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAudio } from "@/contexts/AudioContext";

function htmlToPlainText(html: string): string {
  return html
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(div|h\d|li)>/gi, "\n")
    .replace(/<(?:.|\n)*?>/g, "")
    .replace(/\u00A0/g, " ")
    .trim();
}

interface LyricsPlayerProps {
  onClose: () => void;
  onBack: () => void;
}

export function LyricsPlayer({ onClose, onBack }: LyricsPlayerProps) {
  const {
    currentSong,
    isPlaying,
    playPauseSong,
    handleNext,
    handlePrev,
    progress, // ms
    duration, // ms
    formatTime,
  } = useAudio();

  const [lyrics, setLyrics] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lineStarts, setLineStarts] = useState<number[]>([]); // estimated start time (ms) for each line
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [lineLayouts, setLineLayouts] = useState<{ y: number; height: number }[]>(
    []
  );

  const scrollRef = useRef<ScrollView | null>(null);
  const contentContainerRef = useRef<View | null>(null);
  const settleTimer = useRef<NodeJS.Timeout | null>(null);

  // Fetch lyrics (same approach as before)
  useEffect(() => {
    if (!currentSong) return;

    const id = (currentSong as any).trackId || (currentSong as any).id || (currentSong as any)._id;
    if (!id) {
      setLyrics(null);
      return;
    }

    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(`https://apostle.onrender.com/api/song/getASongs/${id}`);
        if (!res.ok) throw new Error("fetch failed");
        const json = await res.json();
        const s = json?.data ?? json;
        const raw = typeof s?.lyrics === "string" ? s.lyrics : undefined;
        const text = raw ? htmlToPlainText(raw) : null;
        if (mounted) setLyrics(text ?? null);
      } catch (e) {
        if (mounted) setLyrics(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [currentSong]);

  // Build lineStarts (estimated) whenever lyrics or duration changes
  useEffect(() => {
    if (!lyrics) {
      setLineStarts([]);
      return;
    }

    // Split into non-empty lines
    const rawLines = lyrics.split("\n").map(l => l.trim());
    const lines = rawLines.filter(l => l.length > 0);
    if (lines.length === 0 || !duration || duration <= 0) {
      // fallback: evenly spaced 1s increments if no duration
      const fallback = lines.map((_, i) => i * 1000);
      setLineStarts(fallback);
      return;
    }

    // Estimate: distribute song duration across lines proportionally
    const total = lines.length;
    const starts = lines.map((_, i) => Math.floor((i / total) * duration));
    setLineStarts(starts);
  }, [lyrics, duration]);

  // Determine active line from progress -> using lineStarts
  useEffect(() => {
    if (!lineStarts || lineStarts.length === 0) {
      setActiveIndex(0);
      return;
    }
    // progress may be undefined; default 0
    const current = Math.max(0, progress || 0);

    // find last index where lineStart <= current
    let idx = 0;
    for (let i = 0; i < lineStarts.length; i++) {
      if (current >= lineStarts[i]) idx = i;
      else break;
    }
    // clamp
    idx = Math.min(idx, lineStarts.length - 1);
    if (idx !== activeIndex) setActiveIndex(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, lineStarts]);

  // Scroll to keep activeIndex centered (or nicely placed)
  useEffect(() => {
    if (!scrollRef.current || lineLayouts.length === 0 || !lineStarts.length) return;

    const idx = activeIndex;
    const layout = lineLayouts[idx];
    if (!layout) return;

    // compute target y to center the active line in the ScrollView viewport
    // we need to know ScrollView height: assume window height minus paddings.
    // Simpler approach: scroll so that line is roughly 1/3 from top to match screenshot feel
    // We'll approximate viewportHeight by measuring available space; but to keep things simple we use a constant fraction.
    const viewportFraction = 0.38; // place active line ~38% from top
    // try to get scrollView height by measuring the content container available height.
    // We'll fallback to 400 if unknown.
    // For improved precision you can measure with onLayout on the ScrollView wrapper.
    const viewportHeight = (Platform.OS === "web" ? 700 : 520); // heuristic fallback
    const targetY = Math.max(0, layout.y - viewportHeight * viewportFraction + layout.height / 2);

    // small debounce to avoid jitter
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: targetY, animated: true });
    }, 80);

    return () => {
      if (settleTimer.current) {
        clearTimeout(settleTimer.current);
        settleTimer.current = null;
      }
    };
  }, [activeIndex, lineLayouts, lineStarts]);

  // Helpers to handle layout of each line
  const handleLineLayout = (index: number) => (e: LayoutChangeEvent) => {
    const { y, height } = e.nativeEvent.layout;
    setLineLayouts(prev => {
      const copy = [...prev];
      copy[index] = { y, height };
      return copy;
    });
  };

  if (!currentSong) return null;

  const songImage = currentSong.trackImg;
  const songTitle = currentSong.title;
  const songAuthor = currentSong.author;
  const renderedLyrics = (lyrics && lyrics.trim().length > 0) ? lyrics : null;
  const currentTime = formatTime((progress || 0) / 1000);
  const totalDuration = formatTime((duration || 0) / 1000);

  // prepare lines for rendering (non-empty)
  const displayLines = renderedLyrics
    ? renderedLyrics.split("\n").map(l => l.trim()).filter(l => l.length > 0)
    : [];

  // Styles for active vs inactive lines
  const lineStyle = (i: number) =>
    i === activeIndex
      ? tw`text-white text-[34px] font-extrabold text-center leading-10 my-4`
      : tw`text-white text-[20px] font-semibold text-center opacity-60 leading-8 my-3`;

  return (
    <ImageBackground source={{ uri: songImage }} blurRadius={36} style={tw`flex-1 p-4 pt-10 pb-7`}>
      {/* Top bar */}
      <View style={tw`flex-row items-center justify-between px-2`}>
        <TouchableOpacity onPress={onBack} style={tw`p-2`}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>

        <View style={tw`flex-row items-center`}>
          <Text style={tw`text-white mr-3`}>{/* optional title */}</Text>
          <TouchableOpacity onPress={onClose} style={tw`p-2`}>
            <MaterialIcons name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Half circle album art — positioned left and cropped to show right half */}
      {/* <View
        style={[
          tw`absolute top-28`,
          {
            left: -120, // push left by half its width so only the right half shows
            width: 240,
            height: 240,
            borderRadius: 120,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 8,
          },
        ]}
      >
        <Image
          source={{ uri: songImage }}
          style={{ width: 240, height: 240, resizeMode: "cover", transform: [{ translateX: -60 }] }}
        />
      </View> */}

      {/* Lyrics scroll */}
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pt-36 pb-36 px-6`}
      >
        <Text style={tw`text-white text-sm opacity-70 mb-6 text-center`}>({songTitle})</Text>

        {loading ? (
          <View style={tw`items-center justify-center mt-20`}>
            <ActivityIndicator color="#fff" />
            <Text style={tw`text-white opacity-70 mt-3`}>Fetching lyrics…</Text>
          </View>
        ) : displayLines.length > 0 ? (
          <View
            // a wrapper so line layouts are measured relative to this container
            ref={contentContainerRef as any}
          >
            {displayLines.map((line, i) => (
              <View key={i} onLayout={handleLineLayout(i)}>
                <Text style={lineStyle(i)}>
                  {line}
                </Text>
              </View>
            ))}
            {/* small spacer to allow last line to center */}
            <View style={tw`h-40`} />
          </View>
        ) : (
          <View style={tw`items-center justify-center mt-20`}>
            <Text style={tw`text-white text-lg font-bold mb-4`}>🎵</Text>
            <Text style={tw`text-white text-center opacity-70`}>Lyrics not available for this song</Text>
            <Text style={tw`text-white text-center opacity-50 mt-2 text-sm`}>Enjoying: {songTitle}</Text>
          </View>
        )}
      </ScrollView>

      {/* Floating glass mini-player */}
      <View style={tw`absolute left-4 right-4 bottom-6`}>
        {/* Blur card: clip children and render a blurred image behind the content */}
        <View
          style={[
            tw`rounded-2xl overflow-hidden`,
            // optional shadow for elevation
            {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 8,
            },
          ]}
        >
          {/* Local blurred background using the same track image */}
          <Image
            source={{ uri: songImage }}
            blurRadius={40} // increase/decrease for stronger/weaker blur
            style={tw`absolute inset-0 w-full h-full`}
            resizeMode="cover"
          />

          {/* Contrast overlay to ensure readable text over any background */}
          <View
            style={[
              tw`absolute inset-0`,
              { backgroundColor: "rgba(0,0,0,0.35)" }, // adjust alpha to taste
            ]}
          />

          {/* Foreground content */}
          <View style={tw`flex-row items-center p-3`}>
            <Image source={{ uri: songImage }} style={tw`w-16 h-16 rounded-lg bg-gray-300`} />

            <View style={tw`flex-1 ml-3`}>
              <Text style={tw`text-white font-semibold text-base`} numberOfLines={1}>
                {songTitle}
              </Text>
              <Text style={tw`text-white text-xs opacity-80`} numberOfLines={1}>
                {songAuthor}
              </Text>
            </View>

            <View style={tw`items-center`}>
              <View style={tw`flex-row items-center`}>
                <Pressable onPress={handlePrev} style={tw`px-2`}>
                  <Ionicons name="play-skip-back" size={24} color="white" />
                </Pressable>

                <Pressable onPress={() => playPauseSong(currentSong)} style={tw`px-2`}>
                  <Ionicons name={isPlaying ? "pause" : "play"} size={28} color="white" />
                </Pressable>

                <Pressable onPress={handleNext} style={tw`px-2`}>
                  <Ionicons name="play-skip-forward" size={24} color="white" />
                </Pressable>
              </View>

              <Text style={tw`text-white text-xs mt-1 opacity-80`}>
                {currentTime} | {totalDuration}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
