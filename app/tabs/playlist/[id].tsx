import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";
import { useAudio } from "@/contexts/AudioContext";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { getPlaylistById, getSongById, removeTrackFromPlaylist } from "@/services/content";
import { usePlayer } from "@/components/player/PlayerContext";

// Lightweight event bus to notify playlist changes across the app
const playlistEvents = {
  listeners: new Set<() => void>(),
  emit() {
    this.listeners.forEach((fn) => fn());
  },
  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  },
};
export const emitPlaylistUpdated = () => playlistEvents.emit();

const PlaylistView: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [playlist, setPlaylist] = useState<any | null>(null);

  // ✅ hydrate tracksId -> tracks[]
  const [tracks, setTracks] = useState<any[]>([]);
  const [tracksLoading, setTracksLoading] = useState(false);

  const { addToQueue } = useAudio();
  const { playById } = usePlayer();

  const fetchPlaylist = async () => {
    if (!id) return;
    try {
      if (!refreshing) setIsLoading(true);

      const data = await getPlaylistById(id);
      const p = data?.playlist ?? null; // normalized in service
      setPlaylist(p);

      // ✅ If API returns only tracksId, fetch song details for each id
      const ids: string[] = Array.isArray(p?.tracksId) ? p.tracksId : [];
      if (ids.length === 0) {
        setTracks([]);
        return;
      }

      setTracksLoading(true);

      // Fetch in parallel; tolerate per-item failures
      const results = await Promise.allSettled(
        ids.map(async (songId) => {
          const songRes = await getSongById(songId);
          return songRes?.song ?? songRes?.data ?? songRes;
        })
      );

      const hydrated = results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
        .map((r) => r.value)
        .filter(Boolean);

      setTracks(hydrated);
    } catch (e) {
      console.error("Error fetching playlist:", e);
      setPlaylist(null);
      setTracks([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
      setTracksLoading(false);
    }
  };

  // Remove a track from this playlist
  const removeTrack = async (trackId: string) => {
    if (!id || !trackId) return;
    try {
      // ✅ you said you use Mongo _id now, so prefer _id
      await removeTrackFromPlaylist({ playlistId: id, trackId });
      emitPlaylistUpdated();
      await fetchPlaylist();
    } catch (e: any) {
      console.error("Error removing track from playlist:", e?.response?.data ?? e);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchPlaylist();
      const unsub = playlistEvents.subscribe(() => fetchPlaylist());
      return () => unsub();
    }, [id])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPlaylist();
  };

  const listData = useMemo(() => {
    // Prefer hydrated tracks; fallback to API-provided playlist.tracks if you ever add it
    if (tracks.length > 0) return tracks;
    if (Array.isArray(playlist?.tracks) && playlist.tracks.length > 0) return playlist.tracks;
    return [];
  }, [tracks, playlist]);

  const renderTrack = ({ item }: { item: any }) => (
    <Swipeable
      renderLeftActions={() => (
        <View style={[tw`flex-row`, { alignItems: "center" }]}>
          <TouchableOpacity
            onPress={() => addToQueue(item)}
            style={[
              tw`px-4 py-3 rounded-xl mr-2`,
              { backgroundColor: "#e8f0fe", borderWidth: 1, borderColor: "#c5d5ff" },
            ]}
          >
            <View style={tw`flex-row items-center`}>
              <Ionicons name="add-circle" size={18} color="#2e77ff" />
              <Text style={[tw`ml-2 text-blue-600`, { fontWeight: "700" }]}>
                Add to Queue
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      renderRightActions={() => (
        <View style={[tw`flex-row`, { alignItems: "center" }]}>
          <TouchableOpacity
            onPress={() => removeTrack(item._id)}
            style={[
              tw`px-4 py-3 rounded-xl ml-2`,
              { backgroundColor: "#fbe9e7", borderWidth: 1, borderColor: "#f5c6c2" },
            ]}
          >
            <View style={tw`flex-row items-center`}>
              <Ionicons name="remove-circle" size={18} color="#d32f2f" />
              <Text style={[tw`ml-2 text-red-700`, { fontWeight: "700" }]}>
                Remove
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      overshootLeft={false}
      overshootRight={false}
    >
      {/* tap row to play by id */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          // ✅ playById expects Mongo _id now
          const songId = item._id;
          if (songId) playById(songId);
        }}
      >
        <View
          style={tw`flex-row items-center p-3 mb-2 rounded-2xl bg-white dark:bg-[#14141b] border border-[#eaeaea] dark:border-[#2d2d35]`}
        >
          <View
            style={tw`w-14 h-14 rounded-xl mr-3 overflow-hidden bg-[#f1f1f1] dark:bg-[#23232b]`}
          >
            {item.trackImg ? (
              <Image source={{ uri: item.trackImg }} style={tw`w-full h-full`} resizeMode="cover" />
            ) : (
              <View style={tw`flex-1 items-center justify-center`}>
                <Ionicons name="musical-notes" size={20} color="#9e9e9e" />
              </View>
            )}
          </View>
          <View style={tw`flex-1`}>
            <Text
              style={[tw`text-black dark:text-gray-100`, { fontSize: 16, fontWeight: "700" }]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text
              style={[tw`text-gray-500 dark:text-gray-400`, { fontSize: 12 }]}
              numberOfLines={1}
            >
              {item.author}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  if (isLoading && !playlist) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-[#fafafa] dark:bg-[#0b0b10]`}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!playlist) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-[#fafafa] dark:bg-[#0b0b10]`}>
        <Text style={[tw`text-gray-500 dark:text-gray-400`, { fontSize: 14 }]}>
          Playlist not found
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={tw`flex-1 bg-[#fafafa] dark:bg-[#0b0b10]`}>
      {/* Header */}
      <View style={tw`px-4 pt-6 pb-4 flex-row items-center`}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            tw`w-9 h-9 rounded-xl items-center justify-center`,
            { backgroundColor: "#f1f3f5" },
            tw`dark:bg-[#23232b]`,
          ]}
        >
          <Ionicons name="chevron-back" size={18} color="#000" />
        </TouchableOpacity>

        <View style={tw`flex-1 items-center`}>
          <Text
            style={[tw`text-black dark:text-gray-100`, { fontSize: 20, fontWeight: "800" }]}
            numberOfLines={1}
          >
            {playlist?.name ?? "Playlist"}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {}}
          style={[
            tw`w-9 h-9 rounded-xl items-center justify-center`,
            { backgroundColor: "#f1f3f5" },
            tw`dark:bg-[#23232b]`,
          ]}
        >
          <Ionicons name="ellipsis-vertical" size={18} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Tracks */}
      <FlatList
        data={listData}
        keyExtractor={(item: any, idx: number) => item._id?.toString?.() ?? `${idx}`}
        renderItem={renderTrack}
        contentContainerStyle={tw`px-4 pb-20`}
        ListEmptyComponent={
          <View style={tw`items-center mt-10`}>
            {tracksLoading ? (
              <>
                <ActivityIndicator />
                <Text style={[tw`text-gray-500 dark:text-gray-400 mt-3`, { fontSize: 14 }]}>
                  Loading tracks…
                </Text>
              </>
            ) : (
              <Text style={[tw`text-gray-500 dark:text-gray-400`, { fontSize: 14 }]}>
                No tracks in this playlist
              </Text>
            )}
          </View>
        }
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
};

export default PlaylistView;