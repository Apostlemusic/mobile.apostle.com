import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import tw from "twrnc";
import { useRouter } from "expo-router";
import { getGenres } from "@/services/content";

const { width } = Dimensions.get("window");

const fallbackGenres = [
  { id: "1", title: "HIGH-LIFE", artist: "OSHIWAMBO DANCERS", image: { uri: "https://via.placeholder.com/150/2C3E50/FFFFFF?text=High-Life" } },
  { id: "2", title: "SOUL", artist: "", image: { uri: "https://via.placeholder.com/150/34495E/FFFFFF?text=Soul" } },
  { id: "3", title: "POP", artist: "", image: { uri: "https://via.placeholder.com/150/2980B9/FFFFFF?text=Pop" } },
  { id: "4", title: "FUJI", artist: "", image: { uri: "https://via.placeholder.com/150/8E44AD/FFFFFF?text=Fuji" } },
  { id: "5", title: "BLUES", artist: "", image: { uri: "https://via.placeholder.com/150/2C3E50/FFFFFF?text=Blues" } },
  { id: "6", title: "HIP-HOP", artist: "", image: { uri: "https://via.placeholder.com/150/16A085/FFFFFF?text=Hip-Hop" } },
  { id: "7", title: "AFRO-BEATS", artist: "", image: { uri: "https://via.placeholder.com/150/D35400/FFFFFF?text=Afro-Beats" } },
  { id: "8", title: "REGGAE", artist: "", image: { uri: "https://via.placeholder.com/150/27AE60/FFFFFF?text=Reggae" } },
  { id: "9", title: "RNB", artist: "", image: { uri: "https://via.placeholder.com/150/C0392B/FFFFFF?text=RNB" } },
];

function pickGenreTitle(g: any): string {
  return (g?.title ?? g?.name ?? g?.genre ?? g?.slug ?? g?._id ?? "GENRE");
}

const toSlug = (v?: string) =>
  (v ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

function pickGenreId(g: any, idx: number): string {
  if (g?.slug) return String(g.slug);
  const name = g?.name ?? g?.title ?? g?.genre;
  if (name) return toSlug(name);
  return String(g?._id ?? g?.id ?? idx);
}

function pickGenreImage(g: any) {
  const uri = g?.image ?? g?.imageUrl ?? g?.cover ?? g?.coverUrl ?? g?.thumbnail ?? g?.thumbnailUrl;
  if (!uri) return { uri: `https://via.placeholder.com/150/2C3E50/FFFFFF?text=${encodeURIComponent(pickGenreTitle(g))}` };
  return { uri };
}

export default function GenresSection() {
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getGenres();
        const apiGenres = Array.isArray(data?.genres) ? data.genres : Array.isArray(data?.data) ? data.data : [];

        if (!mounted) return;

        if (apiGenres.length > 0) {
          setGenres(
            apiGenres.slice(0, 9).map((g: any, idx: number) => ({
              id: pickGenreId(g, idx),
              title: String(pickGenreTitle(g)).toUpperCase(),
              artist: g?.artist ?? "",
              image: pickGenreImage(g),
            }))
          );
        } else {
          // Use subset of fallbacks if nothing returned
          setGenres(fallbackGenres);
        }
      } catch (e) {
        console.error("Failed to load genres:", e);
        if (mounted) setGenres(fallbackGenres);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handlePress = (id: string) => {
    router.push(`/tabs/genre/${encodeURIComponent(id)}`);
  };

  const numColumns = genres.length === 2 ? 2 : 3;
  const cardWidth = (width - 64) / numColumns;
  const cardHeight = genres.length === 2 ? cardWidth * 0.8 : cardWidth * 1.3;

  return (
    <View style={tw`flex-1 bg-gray-50 dark:bg-[#0b0b10] pt-6 pb-6`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center px-6 mb-4`}>
        <Text style={tw`text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight`}>Genres</Text>
        <TouchableOpacity onPress={() => router.push("/tabs/Search")}>
          <Text style={tw`text-sm font-bold text-gray-500`}>more</Text>
        </TouchableOpacity>
      </View>

      {/* Grid wrapper */}
      <View style={tw`px-6 flex-row flex-wrap justify-between`}>
        {loading && genres.length === 0 ? (
          <View style={tw`w-full py-10 items-center`}>
            <ActivityIndicator color={tw.prefixMatch('dark') ? "#ffffff" : "#000000"} />
          </View>
        ) : (
          genres.map((genre) => (
            <TouchableOpacity
              key={genre.id}
              activeOpacity={0.85}
              onPress={() => handlePress(genre.id)}
              style={[tw`mb-4`, { width: cardWidth }]}
            >
              <ImageBackground
                source={genre.image}
                style={[
                  tw`overflow-hidden bg-gray-200 dark:bg-gray-800`,
                  { width: cardWidth, height: cardHeight, borderBottomLeftRadius: 32, borderTopRightRadius: 32 },
                ]}
                resizeMode="cover"
              >
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.7)"]}
                  style={[
                    tw`flex-1 p-3 justify-between`,
                    { borderBottomLeftRadius: 32, borderTopRightRadius: 32 },
                  ]}
                >
                  <View>
                    {genre.artist ? (
                      <Text style={tw`text-white text-[8px] font-black tracking-tighter uppercase opacity-80`} numberOfLines={1}>
                        {genre.artist}
                      </Text>
                    ) : null}
                  </View>

                  <Text style={tw`text-white text-xs font-black tracking-tight text-right leading-3`} numberOfLines={2}>
                    {genre.title}
                  </Text>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          ))
        )}

        {!loading && genres.length === 0 && (
          <View style={tw`w-full py-6 items-center`}>
            <Text style={tw`text-gray-500 text-sm`}>No genres found</Text>
          </View>
        )}
      </View>
    </View>
  );
}