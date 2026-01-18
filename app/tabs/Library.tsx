import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Playlist } from "@/constants/Types";
import { Swipeable } from "react-native-gesture-handler";
import { useAudio } from "@/contexts/AudioContext";
import {
  deletePlaylist as apiDeletePlaylist,
  getLikedSongs as apiGetLikedSongs,
  getUserPlaylists as apiGetUserPlaylists,
  onLikedUpdated,
} from "@/services/content";
import * as contentApi from "@/services/content";

const Library: React.FC = () => {
  const router = useRouter();
  const { addToQueue } = useAudio();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedSongs, setLikedSongs] = useState<any[]>([]);
  const [likedLoading, setLikedLoading] = useState<boolean>(false);

  const [showAdd, setShowAdd] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchPlaylists = async () => {
    try {
      setIsLoading(true);

      // ✅ Auth-based: GET /api/content/playlists
      const data = await apiGetUserPlaylists();
      const list = Array.isArray(data?.playLists)
        ? data.playLists
        : Array.isArray(data?.playlists)
          ? data.playlists
          : Array.isArray(data?.data)
            ? data.data
            : [];
      setPlaylists(list as any);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      setPlaylists([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLikedSongs = async () => {
    try {
      setLikedLoading(true);

      // ✅ Auth-based: GET /api/content/songs/liked
      const data = await apiGetLikedSongs();
      const songs = Array.isArray(data?.songs)
        ? data.songs
        : Array.isArray(data?.data)
          ? data.data
          : [];
      setLikedSongs(songs);
    } catch (e) {
      console.error("Error fetching liked songs:", e);
      setLikedSongs([]);
    } finally {
      setLikedLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
    fetchLikedSongs();

    // ✅ refresh liked card automatically after like/unlike anywhere
    const unsub = onLikedUpdated(() => {
      fetchLikedSongs();
    });
    return () => {
      if (typeof unsub === "function") void unsub();
    };
  }, []);

  const refresh = async () => {
    await Promise.all([fetchPlaylists(), fetchLikedSongs()]);
  };

  const createPlaylist = async () => {
    const name = newPlaylistName.trim();
    if (!name) return;

    try {
      setCreating(true);

      // ✅ Auth-based: POST /api/content/playlists
      await (contentApi as any).createPlaylist({ name });

      await fetchPlaylists();
      setShowAdd(false);
      setNewPlaylistName("");
    } catch (e: any) {
      console.error("Error creating playlist:", e?.response?.data ?? e);
    } finally {
      setCreating(false);
    }
  };

  const openLikedSongs = () => {
    router.push("/tabs/liked");
  };

  const openPlaylist = (playlistId: string) => {
    router.push(`/tabs/playlist/${playlistId}` as any);
  };

  const deletePlaylist = async (playlistId: string) => {
    try {
      // Postman: DELETE /api/content/playlists { playlistId }
      await apiDeletePlaylist({ playlistId });
      await fetchPlaylists();
    } catch (e: any) {
      console.error("Error deleting playlist:", e?.response?.data ?? e);
    }
  };

  // Only keep RIGHT swipe (Delete). Remove left swipe/Add to Queue.
  const renderRightActions = (playlistId: string) => (
    <View style={[tw`flex-row`, { alignItems: "center" }]}>
      <TouchableOpacity
        onPress={() => deletePlaylist(playlistId)}
        style={tw`px-4 py-3 rounded-xl ml-2 bg-[#fbe9e7] dark:bg-[#3a1e1e] border border-[#f5c6c2] dark:border-[#5c2b2b]`}
      >
        <View style={tw`flex-row items-center`}>
          <Ionicons name="trash" size={18} color="#d32f2f" />
          <Text style={[tw`ml-2 text-red-700`, { fontWeight: "700" }]}>Delete</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderPlaylistItem = ({ item }: { item: any }) => {
    return (
      <Swipeable
        renderRightActions={() => renderRightActions(item._id)}
        overshootRight={false}
        overshootLeft={false}
      >
        <View style={tw`flex-row items-center p-3 mb-3 rounded-2xl bg-white dark:bg-[#14141b] border border-[#eaeaea] dark:border-[#2d2d35]`}>
          <TouchableOpacity
            onPress={() => openPlaylist(item._id)}
            activeOpacity={0.9}
            style={tw`flex-row items-center flex-1`}
          >
            <View style={tw`w-14 h-14 rounded-xl mr-3 bg-[#f1f1f1] dark:bg-[#23232b] overflow-hidden`}>
              {item.tracks?.[0]?.trackImg ? (
                <Image
                  source={{ uri: item.tracks[0].trackImg }}
                  style={tw`w-full h-full`}
                  resizeMode="cover"
                />
              ) : (
                <View style={tw`flex-1 items-center justify-center`}>
                  <Ionicons name="albums" size={22} color="#9e9e9e" />
                </View>
              )}
            </View>

            <View style={tw`flex-1`}>
              <Text
                style={[tw`text-black dark:text-gray-100`, { fontSize: 16, fontWeight: "700" }]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text
                style={[tw`text-gray-500 dark:text-gray-400`, { fontSize: 12 }]}
                numberOfLines={1}
              >
                {item.tracksId?.length || item.tracks?.length || 0} songs
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#9e9e9e" />
          </TouchableOpacity>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={tw`flex-1 bg-[#fafafa] dark:bg-[#0b0b10]`}>
      {/* Header */}
      <View style={tw`px-4 pt-6 pb-3 flex-row items-center justify-between`}>
        <Text style={[tw`text-black dark:text-gray-100`, { fontSize: 24, fontWeight: "800" }]}> 
          Your Library
        </Text>
        <TouchableOpacity
          onPress={() => setShowAdd(true)}
          style={tw`px-3 py-2 rounded-xl bg-[#eef2ff] dark:bg-[#1f2a44]`}
        >
          <Text style={[tw`text-black dark:text-gray-100`, { fontSize: 12, fontWeight: "600" }]}> 
            Add Playlist
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={playlists}
        keyExtractor={(item: any) => item._id?.toString?.() ?? String(item._id)}
        renderItem={renderPlaylistItem}
        contentContainerStyle={tw`px-4 pb-20`}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Liked Songs Card */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={openLikedSongs}
              style={tw`rounded-2xl mb-10 bg-white dark:bg-[#14141b] border border-[#eaeaea] dark:border-[#2d2d35]`}
            >
              <View style={tw`flex-row items-center justify-between px-4 pt-4`}>
                <View style={tw`flex-row items-center`}>
                  <View style={tw`w-9 h-9 rounded-xl items-center justify-center bg-[#f1f3f5] dark:bg-[#23232b]`}>
                    <Ionicons name="heart" size={18} color="#e91e63" />
                  </View>
                  <View style={tw`ml-3`}>
                    <Text style={[tw`text-black dark:text-gray-100`, { fontSize: 16, fontWeight: "700" }]}> 
                      Liked Songs
                    </Text>
                    <Text style={[tw`text-gray-500 dark:text-gray-400 mt-0.5`, { fontSize: 12 }]}> 
                      {likedLoading ? "Loading…" : `${likedSongs.length} songs`}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={openLikedSongs}
                  style={tw`px-3 py-2 rounded-xl bg-[#eef2ff] dark:bg-[#1f2a44]`}
                >
                  <Text style={[tw`text-black dark:text-gray-100`, { fontSize: 12, fontWeight: "600" }]}> 
                    View All
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Preview artworks */}
              <View style={tw`px-4 py-4`}>
                {likedLoading ? (
                  <View style={tw`flex-row`}>
                    {[0, 1, 2, 3].map((i) => (
                      <View
                        key={`sk-${i}`}
                        style={tw`mr-2 rounded-xl w-[70px] h-[70px] bg-[#f1f3f5] dark:bg-[#23232b]`}
                      />
                    ))}
                  </View>
                ) : (
                  <View style={tw`flex-row`}>
                    {likedSongs.slice(0, 4).map((s, i) => (
                      <View key={s._id ?? `${s.trackId}-${i}`} style={tw`mr-2`}>
                        <Image
                          source={{ uri: s.trackImg }}
                          style={[tw`rounded-xl`, { width: 70, height: 70 }]}
                          resizeMode="cover"
                        />
                      </View>
                    ))}
                    {likedSongs.length === 0 && (
                      <Text style={[tw`text-gray-500 dark:text-gray-400`, { fontSize: 12 }]}> 
                        No liked songs yet
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </TouchableOpacity>

            {/* Section title */}
            <Text style={[tw`text-black dark:text-gray-100 mb-3`, { fontSize: 16, fontWeight: "700" }]}> 
              Playlists
            </Text>

            {isLoading && (
              <View style={tw`py-3`}>
                <ActivityIndicator />
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={tw`items-center mt-10`}>
              <Text style={[tw`text-gray-500 dark:text-gray-400`, { fontSize: 14 }]}> 
                No playlists found
              </Text>
              <TouchableOpacity
                onPress={refresh}
                style={tw`mt-3 px-4 py-2 rounded-xl bg-[#eef2ff] dark:bg-[#1f2a44]`}
              >
                <Text style={[tw`text-black dark:text-gray-100`, { fontSize: 12, fontWeight: "600" }]}> 
                  Refresh
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />

      {/* Add Playlist Modal */}
      <Modal
        visible={showAdd}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAdd(false)}
      >
        <TouchableOpacity
          style={tw`flex-1 bg-black/30 dark:bg-black/60`}
          activeOpacity={1}
          onPress={() => setShowAdd(false)}
        >
          <View style={tw`absolute left-4 right-4 top-[25%] bg-white dark:bg-[#14141b] rounded-2xl p-5`}>
            <Text style={[tw`text-black dark:text-gray-100 mb-3`, { fontSize: 18, fontWeight: "800" }]}> 
              Create Playlist
            </Text>
            <TextInput
              placeholder="Playlist name"
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              style={tw`w-full px-3 py-3 rounded-xl mb-3 bg-[#f5f7fb] dark:bg-[#23232b] text-black dark:text-gray-100`}
              placeholderTextColor="#9aa0a6"
            />
            <View style={tw`flex-row`}>
              <TouchableOpacity
                onPress={() => setShowAdd(false)}
                style={tw`flex-1 px-3 py-3 rounded-xl mr-2 bg-[#f1f3f5] dark:bg-[#23232b]`}
                disabled={creating}
              >
                <Text style={[tw`text-black dark:text-gray-100 text-center`, { fontWeight: "700" }]}> 
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={createPlaylist}
                style={[
                  tw`flex-1 px-3 py-3 rounded-xl`,
                  { backgroundColor: newPlaylistName.trim() ? "#2e77ff" : "#aac5ff" },
                ]}
                disabled={!newPlaylistName.trim() || creating}
              >
                <Text style={[tw`text-white text-center`, { fontWeight: "700" }]}> 
                  {creating ? "Creating…" : "Create"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Library;