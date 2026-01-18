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
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";
import { useRouter } from "expo-router";

// Components
import ArtistProfileCard from "@/components/reusable/ArtistSlide";
import TopHitsThisWeek from "@/components/reusable/HotAlbums";
import Search from "@/components/icon/Search";

// Context
import { SongProvider } from "@/contexts/SongContext";
import GenresSection from "@/components/reusable/GenreGrid";
import { usePlayer } from "@/components/player/PlayerContext";
import { searchAll } from "@/services/content";
import { followArtist, emitArtistFollowChanged, onArtistFollowChanged } from "@/services/artist";
import { getUserId } from "@/services/authStorage";

type SearchResults = {
  songs: any[];
  albums: any[];
  artists: any[];
  lyrics: any[];
  categories: any[];
  genres: any[];
};

const RECENT_SEARCHES_KEY = "search.recent";

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
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResults>(emptyResults);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { playById } = usePlayer();
  const router = useRouter();
  const [userId, setUserId] = useState("");

  const { height: screenHeight } = useWindowDimensions();
  const [searchBarHeight, setSearchBarHeight] = useState(0);

  const showOverlay = search.trim().length > 0;

  useEffect(() => {
    let mounted = true;
    (async () => {
      const id = await getUserId();
      if (mounted) setUserId(id || "");
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        if (mounted && Array.isArray(parsed)) setRecentSearches(parsed);
      } catch {
        if (mounted) setRecentSearches([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = onArtistFollowChanged((event) => {
      if (String(event.userId) !== String(userId)) return;
      setResults((prev) => {
        const nextArtists = prev.artists.map((artist: any) => {
          if (String(artist?._id) !== String(event.artistId)) return artist;
          const list = Array.isArray(artist?.followers) ? artist.followers : [];
          const exists = list.some((id: any) => String(id) === String(userId));
          const followers = event.isFollowing
            ? exists
              ? list
              : [...list, userId]
            : list.filter((id: any) => String(id) !== String(userId));
          return { ...artist, followers };
        });
        return { ...prev, artists: nextArtists };
      });
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [userId]);

  const saveRecentSearch = async (term: string) => {
    const value = term.trim();
    if (!value) return;
    const next = [value, ...recentSearches.filter((t) => t.toLowerCase() !== value.toLowerCase())].slice(0, 8);
    setRecentSearches(next);
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  };

  const clearRecentSearches = async () => {
    setRecentSearches([]);
    try {
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // ignore storage errors
    }
  };

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
  return (
    <SongProvider>
      <SafeAreaView edges={["left", "right", "bottom"]} style={tw`flex-1 bg-white dark:bg-[#0b0b10]`}>
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
                  returnKeyType="search"
                  onSubmitEditing={() => saveRecentSearch(search)}
                />
                <Search />
              </View>
            </View>

            {/* Main Content (hidden when searching) */}
            {!showOverlay && (
              <ScrollView>
                {recentSearches.length > 0 && (
                  <View style={tw`px-4 mt-4`}> 
                    <View style={tw`flex-row items-center justify-between mb-3`}>
                      <Text style={tw`text-base font-semibold text-black dark:text-gray-100`}>Recent searches</Text>
                      <TouchableOpacity onPress={clearRecentSearches}>
                        <Text style={tw`text-xs text-gray-500 dark:text-gray-400`}>Clear</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={tw`flex-row flex-wrap`}>
                      {recentSearches.map((term) => (
                        <TouchableOpacity
                          key={term}
                          onPress={() => setSearch(term)}
                          style={tw`px-3 py-2 mr-2 mb-2 rounded-full bg-[#f1f3f5] dark:bg-[#23232b]`}
                        >
                          <Text style={tw`text-xs text-gray-700 dark:text-gray-300`}>{term}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
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
                                    {item?.title ?? ""}
                                  </Text>
                                  <Text
                                    style={[tw`text-gray-500 dark:text-gray-400`, { fontSize: 12 }]}
                                    numberOfLines={1}
                                  >
                                    {item?.author ?? item?.artists?.join(", ") ?? ""}
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
                                const avatar = a?.profileImg || a?.image || a?.trackImg;
                                const about = a?.about || a?.description || "";
                                const followers = Array.isArray(a?.followers) ? a.followers : [];
                                const followerCount = followers.length;
                                const isFollowing = !!userId && followers.some((id: any) => String(id) === String(userId));
                                const isVerified = Boolean(a?.isVerified ?? a?.verified ?? a?.is_verified);

                                const onToggleFollow = async () => {
                                  if (!userId || !a?._id) return;
                                  try {
                                    await followArtist({ artistId: a._id, userId });
                                    setResults((prev) => {
                                      const nextArtists = prev.artists.map((artist: any) => {
                                        if (String(artist?._id) !== String(a?._id)) return artist;
                                        const list = Array.isArray(artist?.followers) ? artist.followers : [];
                                        const exists = list.some((id: any) => String(id) === String(userId));
                                        const nextIsFollowing = !exists;
                                        emitArtistFollowChanged({
                                          artistId: String(a._id),
                                          userId: String(userId),
                                          isFollowing: nextIsFollowing,
                                        });
                                        return {
                                          ...artist,
                                          followers: exists
                                            ? list.filter((id: any) => String(id) !== String(userId))
                                            : [...list, userId],
                                        };
                                      });
                                      return { ...prev, artists: nextArtists };
                                    });
                                  } catch (e) {
                                    // silent fail; toast handled in artist screen if needed
                                  }
                                };
                            return (
                              <TouchableOpacity
                                key={a?._id ?? a?.id ?? `artist-${idx}`}
                                style={tw`p-3 mb-2 rounded-2xl bg-white dark:bg-[#14141b] border border-[#eaeaea] dark:border-[#2d2d35]`}
                                activeOpacity={0.9}
                                onPress={() =>
                                  name && router.push(`/tabs/artist/${encodeURIComponent(name)}` as any)
                                }
                              >
                                    <View style={tw`flex-row items-center`}>
                                      <View style={tw`w-12 h-12 rounded-full mr-3 bg-[#f1f1f1] dark:bg-[#23232b] overflow-hidden`}>
                                        {avatar ? (
                                          <Image source={{ uri: avatar }} style={tw`w-full h-full`} resizeMode="cover" />
                                        ) : (
                                          <View style={tw`flex-1 items-center justify-center`}>
                                            <Text style={tw`text-gray-500 dark:text-gray-400`}>🎤</Text>
                                          </View>
                                        )}
                                      </View>
                                      <View style={tw`flex-1`}>
                                        <View style={tw`flex-row items-center`}>
                                          <Text style={tw`text-black dark:text-gray-100 font-semibold text-lg`} numberOfLines={1}>
                                            {name || ""}
                                          </Text>
                                          {isVerified ? (
                                            <View style={tw`ml-2 px-2 py-[2px] rounded-full bg-[#e8f0fe] dark:bg-[#1f2a44]`}>
                                              <Text style={tw`text-[10px] text-[#2e77ff] dark:text-[#9bbcff] font-semibold`}>
                                                Verified
                                              </Text>
                                            </View>
                                          ) : null}
                                        </View>
                                        {/* <Text style={tw`text-gray-500 dark:text-gray-400 text-xs`} numberOfLines={1}>
                                          {a?.genre ?? a?.genres?.join(", ") ?? ""}
                                        </Text> */}
                                        {/* {about ? (
                                          <Text style={tw`text-gray-600 dark:text-gray-300 text-xs mt-1`} numberOfLines={2}>
                                            {about}
                                          </Text>
                                        ) : null} */}
                                      </View>
                                      <View style={tw`items-end ml-2`}>
                                        <Text style={tw`text-[10px] text-gray-500 dark:text-gray-400 mb-1`}>
                                          {followerCount} follower{followerCount === 1 ? "" : "s"}
                                        </Text>
                                        <TouchableOpacity
                                          onPress={onToggleFollow}
                                          disabled={!userId}
                                          style={[
                                            tw`px-3 py-1 rounded-full`,
                                            isFollowing ? tw`bg-[#f1f3f5] dark:bg-[#23232b]` : tw`bg-[#2e77ff]`,
                                            !userId ? tw`opacity-60` : null,
                                          ]}
                                        >
                                          <Text
                                            style={[
                                              tw`text-[11px] font-semibold`,
                                              isFollowing ? tw`text-black dark:text-gray-100` : tw`text-white`,
                                            ]}
                                          >
                                            {isFollowing ? "Unfollow" : "Follow"}
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                                    </View>
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
                                {al?.title ?? al?.name ?? ""}
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
                                  {c?.name ?? c?.title ?? ""}
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
                                  {g?.name ?? g?.title ?? ""}
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
                                {l?.title ?? ""}
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