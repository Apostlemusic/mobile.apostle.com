import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { useRouter } from "expo-router";

// Components
import { SearchSkeleton } from "@/components/reusable/Skeleton";
import ArtistProfileCard from "@/components/reusable/ArtistSlide";
import TopHitsThisWeek from "@/components/reusable/HotAlbums";
import Search from "@/components/icon/Search";

// Context
import { SongProvider } from "@/contexts/SongContext";
import GenresSection from "@/components/reusable/GenreGrid";
import { usePlayer } from "@/components/player/PlayerContext";
import { searchAll } from "@/services/content";

type SearchResults = {
  songs: any[];
  albums: any[];
  artists: any[];
  lyrics: any[];
  categories: any[];
  genres: any[];
};

const emptyResults: SearchResults = {
  songs: [],
  albums: [],
  artists: [],
  lyrics: [],
  categories: [],
  genres: [],
};

const normalizeArray = (payload: any, key: string): any[] => {
  if (Array.isArray(payload?.results?.[key])) return payload.results[key];
  if (Array.isArray(payload?.data?.results?.[key])) return payload.data.results[key];
  if (Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload?.data?.[key])) return payload.data[key];
  return [];
};

const toSlug = (v?: string) =>
  (v ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const Index = () => {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResults>(emptyResults);
  const [isSearching, setIsSearching] = useState(false);
  const { playById } = usePlayer();
  const router = useRouter();

  const { height: screenHeight } = useWindowDimensions();
  const [searchBarHeight, setSearchBarHeight] = useState(0);

  const showOverlay = search.trim().length > 0;

  // Initial loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Search effect
  useEffect(() => {
    if (search.trim() === "") {
      setResults(emptyResults);
      return;
    }

    const fetchSearchResults = async () => {
      setIsSearching(true);
      try {
        const data = await searchAll(search.trim(), 10);

        setResults({
          songs: normalizeArray(data, "songs"),
          albums: normalizeArray(data, "albums"),
          artists: normalizeArray(data, "artists"),
          lyrics: normalizeArray(data, "lyrics"),
          categories: normalizeArray(data, "categories"),
          genres: normalizeArray(data, "genres"),
        });
      } catch {
        setResults(emptyResults);
      } finally {
        setIsSearching(false);
      }
    };

    fetchSearchResults();
  }, [search]);

  const hasAnyResults =
    results.songs.length ||
    results.albums.length ||
    results.artists.length ||
    results.lyrics.length ||
    results.categories.length ||
    results.genres.length;

  // Loading state
  if (isLoading) {
    return <SearchSkeleton />;
  }

  return (
    <SongProvider>
      <SafeAreaView style={tw`flex-1 bg-white dark:bg-[#0b0b10]`}>
        <KeyboardAvoidingView
          style={tw`flex-1`}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={tw`flex-1 relative`}>
            {/* Search Bar (always visible) */}
            <View
              onLayout={(e) => setSearchBarHeight(e.nativeEvent.layout.height)}
              style={tw`px-4`}
            >
              <View
                style={tw`flex-row items-center bg-[#F9F9F9D4] dark:bg-[#1b1b22] rounded-xl p-3 shadow-md border border-[#26425299] dark:border-[#2d2d35]`}
              >
                <TextInput
                  placeholder="Search keywords"
                  placeholderTextColor="gray"
                  style={tw`text-base flex-1 text-black dark:text-gray-100`}
                  value={search}
                  onChangeText={setSearch}
                />
                <Search />
              </View>
            </View>

            {/* Main Content (hidden when searching) */}
            {!showOverlay && (
              <ScrollView>
                {/* Search Header Section */}
                <View style={tw`relative`}>
                  <View style={tw`w-full h-[420px] justify-end`}>
                    <ArtistProfileCard />
                  </View>
                </View>

                {/* Main Content */}
                <View>
                  <TopHitsThisWeek />
                  <GenresSection />
                </View>
              </ScrollView>
            )}

            {/* Search Results Overlay (half screen) */}
            {showOverlay && (
              <View
                style={[
                  tw`absolute left-0 right-0 bg-white dark:bg-[#14141b] border-t border-gray-200 dark:border-[#2d2d35] shadow-lg`,
                  {
                    top: searchBarHeight + 16,
                    height: screenHeight * 0.5,
                    zIndex: 20,
                  },
                ]}
              >
                <ScrollView contentContainerStyle={tw`px-4 py-3`}>
                  {isSearching ? (
                    <Text style={tw`text-gray-600 dark:text-gray-400`}>Searching…</Text>
                  ) : hasAnyResults ? (
                    <>
                      {/* Songs */}
                      {results.songs.length > 0 && (
                        <View style={tw`mb-4`}>
                          <Text style={tw`text-lg font-bold mb-2 text-black dark:text-gray-100`}>Songs</Text>
                          {results.songs.map((item: any, idx: number) => {
                            const id = isMongoId(item?._id) ? item._id : undefined;
                            return (
                              <TouchableOpacity
                                key={id ? String(id) : `song-${idx}`}
                                style={tw`flex-row items-center p-3 mb-2 rounded-2xl bg-white dark:bg-[#14141b] border border-[#eaeaea] dark:border-[#2d2d35]`}
                                activeOpacity={0.9}
                                onPress={() => id && playById(String(id))}
                              >
                                <View
                                  style={[
                                    tw`w-14 h-14 rounded-xl mr-3 bg-[#f1f1f1] dark:bg-[#23232b]`,
                                    { overflow: "hidden" },
                                  ]}
                                >
                                  {item?.trackImg ? (
                                    <Image
                                      source={{ uri: item.trackImg }}
                                      style={tw`w-full h-full`}
                                      resizeMode="cover"
                                    />
                                  ) : (
                                    <View style={tw`flex-1 items-center justify-center`}>
                                      <Text style={tw`text-gray-500 dark:text-gray-400`}>🎵</Text>
                                    </View>
                                  )}
                                </View>
                                <View style={tw`flex-1`}>
                                  <Text
                                    style={[tw`text-black dark:text-gray-100`, { fontSize: 16, fontWeight: "700" }]}
                                    numberOfLines={1}
                                  >
                                    {item?.title ?? "Unknown Title"}
                                  </Text>
                                  <Text
                                    style={[tw`text-gray-500 dark:text-gray-400`, { fontSize: 12 }]}
                                    numberOfLines={1}
                                  >
                                    {item?.author ?? (item?.artists?.join(", ") ?? "Unknown Artist")}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}

                      {/* Artists */}
                      {results.artists.length > 0 && (
                        <View style={tw`mb-4`}>
                          <Text style={tw`text-lg font-bold mb-2 text-black dark:text-gray-100`}>Artists</Text>
                          {results.artists.map((a: any, idx: number) => {
                            const name = a?.name ?? a?.artistName ?? "";
                            return (
                              <TouchableOpacity
                                key={a?._id ?? a?.id ?? `artist-${idx}`}
                                style={tw`p-3 mb-2 rounded-2xl bg-white dark:bg-[#14141b] border border-[#eaeaea] dark:border-[#2d2d35]`}
                                activeOpacity={0.9}
                                onPress={() =>
                                  name && router.push(`/tabs/artist/${encodeURIComponent(name)}` as any)
                                }
                              >
                                <Text style={tw`text-black dark:text-gray-100 font-semibold`} numberOfLines={1}>
                                  {name || "Unknown Artist"}
                                </Text>
                                <Text style={tw`text-gray-500 dark:text-gray-400 text-xs`} numberOfLines={1}>
                                  {a?.genre ?? a?.genres?.join(", ") ?? ""}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}

                      {/* Albums */}
                      {results.albums.length > 0 && (
                        <View style={tw`mb-4`}>
                          <Text style={tw`text-lg font-bold mb-2 text-black dark:text-gray-100`}>Albums</Text>
                          {results.albums.map((al: any, idx: number) => (
                            <View
                              key={al?._id ?? al?.id ?? `album-${idx}`}
                              style={tw`p-3 mb-2 rounded-2xl bg-white dark:bg-[#14141b] border border-[#eaeaea] dark:border-[#2d2d35]`}
                            >
                              <Text style={tw`text-black dark:text-gray-100 font-semibold`} numberOfLines={1}>
                                {al?.title ?? al?.name ?? "Unknown Album"}
                              </Text>
                              <Text style={tw`text-gray-500 dark:text-gray-400 text-xs`} numberOfLines={1}>
                                {al?.artist ?? al?.author ?? ""}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Categories */}
                      {results.categories.length > 0 && (
                        <View style={tw`mb-4`}>
                          <Text style={tw`text-lg font-bold mb-2 text-black dark:text-gray-100`}>Categories</Text>
                          {results.categories.map((c: any, idx: number) => {
                            const slug = c?.slug ?? toSlug(c?.name ?? c?.title);
                            return (
                              <TouchableOpacity
                                key={c?._id ?? c?.id ?? c?.slug ?? `cat-${idx}`}
                                style={tw`p-3 mb-2 rounded-2xl bg-white dark:bg-[#14141b] border border-[#eaeaea] dark:border-[#2d2d35]`}
                                activeOpacity={0.9}
                                onPress={() => slug && router.push(`/tabs/category/${encodeURIComponent(slug)}`)}
                              >
                                <Text style={tw`text-black dark:text-gray-100 font-semibold`} numberOfLines={1}>
                                  {c?.name ?? c?.title ?? "Unknown Category"}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}

                      {/* Genres */}
                      {results.genres.length > 0 && (
                        <View style={tw`mb-4`}>
                          <Text style={tw`text-lg font-bold mb-2 text-black dark:text-gray-100`}>Genres</Text>
                          {results.genres.map((g: any, idx: number) => {
                            const slug = g?.slug ?? toSlug(g?.name ?? g?.title);
                            return (
                              <TouchableOpacity
                                key={g?._id ?? g?.id ?? g?.slug ?? `genre-${idx}`}
                                style={tw`p-3 mb-2 rounded-2xl bg-white dark:bg-[#14141b] border border-[#eaeaea] dark:border-[#2d2d35]`}
                                activeOpacity={0.9}
                                onPress={() => slug && router.push(`/tabs/genre/${encodeURIComponent(slug)}`)}
                              >
                                <Text style={tw`text-black dark:text-gray-100 font-semibold`} numberOfLines={1}>
                                  {g?.name ?? g?.title ?? "Unknown Genre"}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}

                      {/* Lyrics */}
                      {results.lyrics.length > 0 && (
                        <View style={tw`mb-4`}>
                          <Text style={tw`text-lg font-bold mb-2 text-black dark:text-gray-100`}>Lyrics</Text>
                          {results.lyrics.map((l: any, idx: number) => (
                            <View
                              key={l?._id ?? l?.id ?? `lyric-${idx}`}
                              style={tw`p-3 mb-2 rounded-2xl bg-white dark:bg-[#14141b] border border-[#eaeaea] dark:border-[#2d2d35]`}
                            >
                              <Text style={tw`text-black dark:text-gray-100 font-semibold`} numberOfLines={1}>
                                {l?.title ?? "Lyrics"}
                              </Text>
                              <Text style={tw`text-gray-500 dark:text-gray-400 text-xs`} numberOfLines={2}>
                                {l?.snippet ?? l?.text ?? ""}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </>
                  ) : (
                    <Text style={tw`text-gray-600 dark:text-gray-400`}>No results for “{search}”</Text>
                  )}
                </ScrollView>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SongProvider>
  );
};

export default Index;

const isMongoId = (v?: string) => typeof v === "string" && /^[a-f0-9]{24}$/i.test(v);