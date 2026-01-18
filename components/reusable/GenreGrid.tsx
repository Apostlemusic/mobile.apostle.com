import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import tw from "twrnc";
import { getGenres } from "@/services/content";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 3; // 3 cards per row, accounting for padding
const cardHeight = cardWidth * 1.4; // Maintain aspect ratio

const fallbackGenres = [
  {
    id: 1,
    title: "HIGH-LIFE",
    artist: "OSHIWAMBO DANCERS",
    image: { uri: "https://example.com/images/high-life.jpg" },
  },
  {
    id: 2,
    title: "SOUL",
    artist: "",
    image: { uri: "https://example.com/images/soul.jpg" },
  },
  {
    id: 3,
    title: "POP",
    artist: "",
    image: { uri: "https://example.com/images/pop.jpg" },
  },
  {
    id: 4,
    title: "FUJI",
    artist: "",
    image: { uri: "https://example.com/images/fuji.jpg" },
  },
  {
    id: 5,
    title: "BLUES",
    artist: "",
    image: { uri: "https://example.com/images/blues.jpg" },
  },
  {
    id: 6,
    title: "HIP-HOP",
    artist: "",
    image: { uri: "https://example.com/images/hiphop.jpg" },
  },
  {
    id: 7,
    title: "AFRO-BEATS",
    artist: "",
    image: { uri: "https://example.com/images/afrobeats.jpg" },
  },
  {
    id: 8,
    title: "REGGAE",
    artist: "",
    image: { uri: "https://example.com/images/reggae.jpg" },
  },
  {
    id: 9,
    title: "RNB",
    artist: "",
    image: { uri: "https://example.com/images/rnb.jpg" },
  },
];

function pickGenreTitle(g: any): string {
  return (
    g?.title ??
    g?.name ??
    g?.genre ??
    g?.slug ??
    g?._id ??
    "GENRE"
  );
}

function pickGenreId(g: any, idx: number): string | number {
  return g?._id ?? g?.id ?? g?.slug ?? idx;
}

function pickGenreImage(g: any) {
  // server might not have images yet; keep a consistent fallback so UI doesn't change
  const uri =
    g?.image ??
    g?.imageUrl ??
    g?.cover ??
    g?.coverUrl ??
    g?.thumbnail ??
    g?.thumbnailUrl ??
    "https://example.com/images/pop.jpg";
  return { uri };
}

export default function GenresSection() {
  const [genres, setGenres] = useState<any[]>(fallbackGenres);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getGenres();
        const apiGenres = Array.isArray(data?.genres) ? data.genres : Array.isArray(data?.data) ? data.data : [];
        if (!mounted) return;

        if (apiGenres.length > 0) {
          // Map API -> existing UI shape (keep UI identical)
          setGenres(
            apiGenres.slice(0, 9).map((g: any, idx: number) => ({
              id: pickGenreId(g, idx),
              title: String(pickGenreTitle(g)).toUpperCase(),
              artist: g?.artist ?? "",
              image: pickGenreImage(g),
            }))
          );
        }
      } catch (e) {
        // keep fallbackGenres on error (no UI change)
        console.error("Failed to load genres:", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const rows = useMemo(() => {
    const r: any[] = [];
    for (let i = 0; i < genres.length; i += 3) {
      r.push(genres.slice(i, i + 3));
    }
    return r;
  }, [genres]);

  return (
    <View style={tw`flex-1 bg-gray-50 dark:bg-[#0b0b10] pt-8 pb-6`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center px-6 mb-6`}>
        <Text style={tw`text-2xl font-bold text-black dark:text-gray-100`}>Genre's</Text>
        <TouchableOpacity>
          <Text style={tw`text-base text-gray-600 dark:text-gray-400`}>more</Text>
        </TouchableOpacity>
      </View>

      {/* Genres in grid layout - no scroll */}
      <View style={tw`px-3`}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={tw`flex-row justify-between mb-4`}>
            {row.map((genre: any) => (
              <TouchableOpacity
                key={genre.id}
                activeOpacity={0.9}
                style={{ width: cardWidth }}
              >
                <ImageBackground
                  source={genre.image}
                  style={[
                    tw`overflow-hidden shadow-lg`,
                    { width: cardWidth, height: cardHeight },
                  ]}
                  imageStyle={{
                    borderBottomLeftRadius: 20,
                    borderTopRightRadius: 20,
                  }}
                  resizeMode="cover"
                >
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.8)"]}
                    style={[
                      tw`overflow-hidden p-2 shadow-lg justify-between`,
                      {
                        width: cardWidth,
                        height: cardHeight,
                        borderBottomLeftRadius: 20,
                        borderTopRightRadius: 20,
                      },
                    ]}
                  >
                    {/* Artist at top */}
                    {genre.artist && (
                      <Text style={tw`text-white text-[9px] font-semibold`}>
                        {genre.artist}
                      </Text>
                    )}

                    {/* Genre title at bottom */}
                    <Text style={tw`text-white text-sm font-bold text-right`}>
                      {genre.title}
                    </Text>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}