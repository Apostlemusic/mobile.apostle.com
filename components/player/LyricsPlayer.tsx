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
import { getSongById, getSongByTrackId } from "@/services/content";
import AuthorLink from "@/components/reusable/AuthorLink";

function htmlToPlainText(html: string): string {
  return html
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(div|h\d|li)>/gi, "\n")
    .replace(/<(?:.|\n)*?>/g, "")
    .replace(/\u00A0/g, " ")
    .trim();
}

const isMongoId = (v?: string) => typeof v === "string" && /^[a-f0-9]{24}$/i.test(v);

const extractLyrics = (payload: any): string | null => {
  const raw = typeof payload?.lyrics === "string" ? payload.lyrics : "";
  const text = raw ? htmlToPlainText(raw) : "";
  return text && text.trim().length > 0 ? text : null;
};

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
  const scrollRef = useRef<ScrollView | null>(null);
  const contentContainerRef = useRef<View | null>(null);

  // Fetch lyrics (same approach as before)
  useEffect(() => {
    if (!currentSong) return;

    const trackId = (currentSong as any).trackId as string | undefined;
    const mongoId = isMongoId(trackId)
      ? trackId
      : ((currentSong as any).id as string | undefined) ||
        ((currentSong as any)._id as string | undefined);

    if (!trackId && !mongoId) {
      setLyrics(null);
      return;
    }

    const directLyrics = extractLyrics(currentSong as any);
    if (directLyrics) {
      setLyrics(directLyrics);
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        let nextLyrics: string | null = null;

        if (mongoId) {
          const res = await getSongById(String(mongoId));
          const s = res?.song ?? res?.data ?? res;
          nextLyrics = extractLyrics(s);
        }

        if (!nextLyrics && trackId && !isMongoId(trackId)) {
          const fallback = await getSongByTrackId(String(trackId));
          const s = fallback?.song ?? fallback?.data ?? fallback;
          nextLyrics = extractLyrics(s);
        }

        if (mounted) setLyrics(nextLyrics);
      } catch {
        if (mounted) setLyrics(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [currentSong]);


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

  const lineStyle = tw`text-white text-[20px] font-semibold text-center leading-8 my-3`;

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
          <View ref={contentContainerRef as any}>
            {displayLines.map((line, i) => (
              <Text key={i} style={lineStyle}>
                {line}
              </Text>
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
              <AuthorLink
                name={songAuthor}
                style={tw`text-white text-xs opacity-80`}
                numberOfLines={1}
              />
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
