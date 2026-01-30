import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import AuthorLink from "@/components/reusable/AuthorLink";
import { usePlayer } from "../player/PlayerContext";
import { useRouter } from "expo-router";

// ✅ Use the new API wrapper (no UI changes)
import {
  getAllSongs,
  getCategories,
  getGenres,
  getLikedSongs,
  unwrapArray,
} from "@/services/content";

type AnyItem = any;

const UnifiedSection = ({
  title,
  kind,
  data,
  loading,
}: {
  title: string;
  kind: "song" | "category" | "genre";
  data: AnyItem[];
  loading?: boolean;
}) => {
  const router = useRouter();
  const { playById } = usePlayer();
  const placeholder = "https://via.placeholder.com/150";

  if (loading && (!data || data.length === 0)) {
    return (
      <View style={tw`mt-8`}>
        <View style={tw`flex-row justify-between items-center px-4`}>
            <Text style={tw`text-lg font-semibold text-gray-900 dark:text-gray-100`}>{title}</Text>
        </View>
        <View style={tw`py-6 items-center`}>
          <ActivityIndicator color="#4B5563" />
        </View>
      </View>
    );
  }

  if (!loading && (!data || data.length === 0)) {
    return null; // ✅ keep section hidden when empty
  }

  const toSlug = (v?: string) =>
    (v ?? "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  const onPressItem = (t: AnyItem) => {
    if (kind === "song") {
      const id = t._id;
      if (id) playById(id);
      return;
    }

    if (kind === "category") {
      const slug = t.slug ?? toSlug(t.name ?? t.title);
      if (!slug) return;

      router.push(`/tabs/category/${encodeURIComponent(slug)}`);
      return;
    }

    if (kind === "genre") {
      const slug = t.slug ?? toSlug(t.name ?? t.title);
      if (!slug) return;

      router.push(`/tabs/genre/${encodeURIComponent(slug)}`);
    }
  };

  return (
    <View style={tw`mt-8`}>
      <View style={tw`flex-row justify-between items-center px-4`}>
          <Text style={tw`text-lg font-semibold text-gray-900 dark:text-gray-100`}>{title}</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={tw`mt-3 pl-4`}
      >
        {data.map((t: AnyItem, idx: number) => {
          const key = String(t.trackId || t._id || t.id || t.slug || idx);
          const img =
            t.imageUrl ||
            t.artworkUrl ||
            t.trackImg ||
            t.image ||
            t.coverUrl ||
            t.thumbnailUrl ||
            placeholder;

          const isDisabled = kind === "song" ? !(t.trackId || t._id || t.id) : false;

          return (
            <TouchableOpacity
              key={key}
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
                <View
                  style={tw`absolute inset-0 bg-black/45 rounded-tr-[30px] rounded-bl-[30px]`}
                  pointerEvents="none"
                />
                <Text
                  style={tw`text-white text-[15px] font-extrabold tracking-wide text-left w-2/3`}
                  numberOfLines={2}
                >
                  {t.title ?? t.name ?? " "}
                </Text>
                <View style={tw`w-full flex-row justify-between items-end mt-2`}>
                  <AuthorLink
                    name={t.author || t.artist || ""}
                    style={tw`text-white/90 text-[13px] font-semibold tracking-wide text-right w-full align-middle`}
                    numberOfLines={2}
                  />
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
  // Loading states (keep skeleton behavior)
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [likedLoading, setLikedLoading] = useState(true);
  const [allSongsLoading, setAllSongsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [genresLoading, setGenresLoading] = useState(true);

  // Data
  const [recommended, setRecommended] = useState<AnyItem[]>([]);
  const [liked, setLiked] = useState<AnyItem[]>([]);
  const [allSongs, setAllSongs] = useState<AnyItem[]>([]);
  const [categories, setCategories] = useState<AnyItem[]>([]);
  const [genres, setGenres] = useState<AnyItem[]>([]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      // 1) Recommended For You
      try {
        setRecommendedLoading(true);
        const data = await getAllSongs();
        const items = unwrapArray(data);
        if (mounted) setRecommended(items.slice(0, 12));
      } catch (e) {
        console.error("Recommended fetch failed:", e);
        if (mounted) setRecommended([]);
      } finally {
        if (mounted) setRecommendedLoading(false);
      }

      // 2) Liked Songs (auth-based; no userId param)
      try {
        setLikedLoading(true);
        const data = await getLikedSongs();
        const items = unwrapArray(data);
        if (mounted) setLiked(items);
      } catch (e) {
        console.error("Liked fetch failed:", e);
        if (mounted) setLiked([]);
      } finally {
        if (mounted) setLikedLoading(false);
      }

      // 3) All Songs
      // try {
      //   setAllSongsLoading(true);
      //   const data = await getAllSongs();
      //   const items = unwrapArray(data);
      //   if (mounted) setAllSongs(items);
      // } catch (e) {
      //   console.error("All songs fetch failed:", e);
      //   if (mounted) setAllSongs([]);
      // } finally {
      //   if (mounted) setAllSongsLoading(false);
      // }

      // 4) Categories
      try {
        setCategoriesLoading(true);
        const data = await getCategories();
        const items = unwrapArray(data);
        if (mounted) setCategories(items);
      } catch (e) {
        console.error("Categories fetch failed:", e);
        if (mounted) setCategories([]);
      } finally {
        if (mounted) setCategoriesLoading(false);
      }

      // 5) Genres
      try {
        setGenresLoading(true);
        const data = await getGenres();
        const items = unwrapArray(data);
        if (mounted) setGenres(items);
      } catch (e) {
        console.error("Genres fetch failed:", e);
        if (mounted) setGenres([]);
      } finally {
        if (mounted) setGenresLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const renderSection = useMemo(() => {
    return (
      title: string,
      kind: "song" | "category" | "genre",
      data: AnyItem[],
      loading?: boolean
    ) => {
      const hasData = Array.isArray(data) && data.length > 0;
      if (!loading && !hasData) return null; // ✅ hide when empty
      return <UnifiedSection title={title} kind={kind} data={data} loading={loading} />;
    };
  }, []);

  return (
    <ScrollView
      style={tw`flex-1 bg-white dark:bg-[#0b0b10] pb-5`}
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
    >
      <View style={tw`px-4 mt-8`}>
          <Text style={tw`text-2xl font-bold text-gray-900 dark:text-gray-100`}>More For YOU</Text>
          <Text style={tw`text-gray-500 dark:text-gray-400 mt-1`}>
          We’ve seen your rotation and know this would fit right in
        </Text>
      </View>

      {renderSection("Recommended For You", "song", recommended, recommendedLoading)}
      {renderSection("Liked Songs", "song", liked, likedLoading)}
      {renderSection("Categories", "category", categories, categoriesLoading)}
      {renderSection("Genres", "genre", genres, genresLoading)}
    </ScrollView>
  );
}