import React from "react";
import { View, Text, ScrollView, ImageBackground, TouchableOpacity } from "react-native";
import tw from "twrnc";
// Remove local AudioContext; use global PlayerContext
import { usePlayer } from "../player/PlayerContext";
import { useFetchSongs, GlobalTrack, normalizeArray, pickPlayableUrl } from "../../hooks/useFetchSongs";
import { useRouter } from "expo-router";

const classifyEndpoint = (endpoint: string) => {
  const lower = endpoint.toLowerCase();
  if (lower.includes("/song/")) return "song";
  if (lower.includes("/category/")) return "category";
  if (lower.includes("/playlist/")) return "playlist";
  if (lower.includes("/artist/")) return "artist";
  return "unknown";
};

const SkeletonRow = ({ count = 5 }: { count?: number }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`mt-3 pl-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={`sk-${i}`}
          style={[
            tw`mr-4 bg-gray-200`,
            { width: 150, height: 200, borderRadius: 10, overflow: "hidden" },
          ]}
        >
          <View style={[tw`bg-gray-300`, { flex: 1 }]} />
        </View>
      ))}
    </ScrollView>
  );
};

const UnifiedSection = ({
  title,
  endpoint,
  data,
  loading,
}: {
  title: string;
  endpoint: string;
  data: GlobalTrack[];
  loading?: boolean;
}) => {
  const router = useRouter();
  const { playById } = usePlayer();
  const kind = classifyEndpoint(endpoint);
  const placeholder = "https://via.placeholder.com/150";

  if (loading && (!data || data.length === 0)) {
    return (
      <View style={tw`mt-8`}>
        <View style={tw`flex-row justify-between items-center px-4`}>
          <Text style={tw`text-lg font-semibold text-gray-900`}>{title}</Text>
        </View>
        <SkeletonRow />
      </View>
    );
  }
  if (!loading && (!data || data.length === 0)) {
    return null;
  }

  const onPressItem = (t: GlobalTrack) => {
    if (kind === "song") {
      const id = t.trackId || t.id;
      if (id) {
        // Simple global flow: fetch by id -> get trackUrl -> play
        playById(id);
      }
      return;
    }

    if (kind === "category") {
      const slug = (t as any).slug || t.title?.toLowerCase().replace(/\s+/g, "");
      if (!slug) return;
      const isGenre = endpoint.toLowerCase().includes("getallgenre");
      const targetApi = isGenre
        ? `/api/category/getGenre/${slug}`
        : `/api/category/getCategory/${slug}`;

      router.push({
        pathname: "/tabs/Library",
        params: { sourceApi: targetApi, slug, type: isGenre ? "genre" : "category" },
      });
      return;
    }

    if (kind === "playlist") {
      const slug = (t as any).slug || t.id;
      router.push({
        pathname: "/tabs/Library",
        params: { sourceApi: `/api/playlist/getPlaylist/${slug}`, slug, type: "playlist" },
      });
      return;
    }

    if (kind === "artist") {
      const slug = (t as any).slug || t.id;
      router.push({
        pathname: "/tabs/Library",
        params: { sourceApi: `/api/artist/getArtist/${slug}`, slug, type: "artist" },
      });
    }
  };

  return (
    <View style={tw`mt-8`}>
      <View style={tw`flex-row justify-between items-center px-4`}>
        <Text style={tw`text-lg font-semibold text-gray-900`}>{title}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`mt-3 pl-4`}>
        {data.map((t) => {
          const img = t.artworkUrl || t.trackImg || t.image || placeholder;
          // Only disable if item has neither id nor trackId
          const isDisabled = !(t.trackId || t.id);
          return (
            <TouchableOpacity
              key={(t.trackId || t.id) as string}
              style={[tw`mr-4`, { width: 150, height: 200 }]}
              onPress={() => onPressItem(t)}
              disabled={isDisabled}
            >
              <ImageBackground
                source={{ uri: img }}
                style={tw`flex-1 justify-between py-3 px-2`}
                imageStyle={{
                  borderBottomLeftRadius: 30,
                  borderTopRightRadius: 30,
                  backgroundColor: "#e0e0e0",
                }}
              >
                <Text style={tw`text-white text-[16px] font-extrabold text-left w-2/3`} numberOfLines={2}>
                  {t.title}
                </Text>
                <View style={tw`w-full flex-row justify-between items-end mt-2`}>
                  <Text style={tw`text-white text-sm font-extrabold text-right w-2/3`} numberOfLines={1}>
                    {t.author || t.artist || ((t as any).slug ? `#${(t as any).slug}` : "")}
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default function MoreForYou() {
  const endpoints = {
    recommended: "https://apostle.onrender.com/api/song/getRecommended",
    liked: "https://apostle.onrender.com/api/song/getLikedSongs",
    allSongs: "https://apostle.onrender.com/api/song/getAllSongs",
    categories: "https://apostle.onrender.com/api/category/getAllCategory",
    genres: "https://apostle.onrender.com/api/category/getAllGenre",
  };

  const { songs: recommendedRaw, loading: recommendedLoading, error: recommendedError } = useFetchSongs(endpoints.recommended);
  const { songs: likedRaw, loading: likedLoading, error: likedError } = useFetchSongs(endpoints.liked);
  const { songs: allSongsRaw, loading: allSongsLoading, error: allSongsError } = useFetchSongs(endpoints.allSongs);
  const { songs: categoriesRaw, loading: categoriesLoading, error: categoriesError } = useFetchSongs(endpoints.categories);
  const { songs: genresRaw, loading: genresLoading, error: genresError } = useFetchSongs(endpoints.genres);

  const recommended = normalizeArray(recommendedRaw);
  const liked = normalizeArray(likedRaw);
  const allSongs = normalizeArray(allSongsRaw);
  const categories = normalizeArray(categoriesRaw);
  const genres = normalizeArray(genresRaw);

  const renderSection = (
    title: string,
    endpoint: string,
    data: GlobalTrack[],
    loading?: boolean,
    error?: string | null
  ) => {
    if (error) return null;
    const hasData = Array.isArray(data) && data.length > 0;
    if (!loading && !hasData) return null;
    return <UnifiedSection title={title} endpoint={endpoint} data={data} loading={loading} />;
  };

  return (
    <ScrollView style={tw`flex-1 bg-white`} showsVerticalScrollIndicator={false} overScrollMode="never">
      <View style={tw`px-4 mt-8`}>
        <Text style={tw`text-2xl font-bold text-gray-900`}>More For YOU</Text>
        <Text style={tw`text-gray-500 mt-1`}>
          We’ve seen your rotation and know this would fit right in
        </Text>
      </View>

      {renderSection("Recommended For You", endpoints.recommended, recommended, recommendedLoading, recommendedError)}
      {renderSection("Liked Songs", endpoints.liked, liked, likedLoading, likedError)}
      {renderSection("All Songs", endpoints.allSongs, allSongs, allSongsLoading, allSongsError)}
      {renderSection("Categories", endpoints.categories, categories, categoriesLoading, categoriesError)}
      {renderSection("Genres", endpoints.genres, genres, genresLoading, genresError)}

      <View style={tw`h-8`} />
    </ScrollView>
  );
}