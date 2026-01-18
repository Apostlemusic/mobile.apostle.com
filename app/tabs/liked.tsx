import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { usePlayer } from "@/components/player/PlayerContext";
import { getLikedSongs, onLikedUpdated } from "@/services/content";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const LikedSongsScreen: React.FC = () => {
  const router = useRouter();
  const [likedSongs, setLikedSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { playById } = usePlayer();

  const fetchLiked = async () => {
    try {
      if (!refreshing) setLoading(true);

      // Expect you store userId somewhere; this is the least invasive fallback.
      const userId =
        (await AsyncStorage.getItem("userId")) ||
        (await AsyncStorage.getItem("apostle.userId"));

      if (!userId) {
        setLikedSongs([]);
        return;
      }

      const data = await getLikedSongs();
      // Postman-style likely { songs: [...] }
      const songs = Array.isArray(data?.songs) ? data.songs : Array.isArray(data?.data) ? data.data : [];
      setLikedSongs(songs);
    } catch (e) {
      console.error("Error fetching liked songs:", e);
      setLikedSongs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiked();
    const unsub = onLikedUpdated(() => {
      fetchLiked();
    });
    return () => {
      if (typeof unsub === "function") void unsub();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchLiked();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLiked();
  };

  // ✅ IMPORTANT: playById now expects Mongo _id (not trackId)
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        const id = item._id;
        if (id) playById(id);
      }}
    >
      <View
        style={tw`flex-row items-center p-3 mb-2 rounded-2xl bg-white dark:bg-[#14141b] border border-[#eaeaea] dark:border-[#2d2d35]`}
      >
        <View
          style={tw`w-14 h-14 rounded-xl mr-3 bg-[#f1f1f1] dark:bg-[#23232b] overflow-hidden`}
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
          <Text style={[tw`text-black dark:text-gray-100`, { fontSize: 16, fontWeight: "700" }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[tw`text-gray-500 dark:text-gray-400`, { fontSize: 12 }]} numberOfLines={1}>
            {item.author || (item.artists?.join(", ") ?? "")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && likedSongs.length === 0) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-[#fafafa] dark:bg-[#0b0b10]`}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-[#fafafa] dark:bg-[#0b0b10]`}>
      {/* Header */}
      <View style={tw`px-4 pt-6 pb-4 flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={tw`w-9 h-9 rounded-xl items-center justify-center mr-2 bg-[#f1f3f5] dark:bg-[#23232b]`}
          >
            <Ionicons name="chevron-back" size={18} color="#000" />
          </TouchableOpacity>
          <Text style={[tw`text-black dark:text-gray-100`, { fontSize: 20, fontWeight: "800" }]}>
            Liked Songs
          </Text>
        </View>
        <TouchableOpacity
          onPress={fetchLiked}
          style={tw`px-3 py-2 rounded-xl bg-[#eef2ff] dark:bg-[#1f2a44]`}
        >
          <Text style={[tw`text-black dark:text-gray-100`, { fontSize: 12, fontWeight: "600" }]}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={likedSongs}
        keyExtractor={(item: any, idx: number) => item._id?.toString?.() ?? `${item.trackId}-${idx}`}
        renderItem={renderItem}
        contentContainerStyle={tw`px-4 pb-20`}
        ListEmptyComponent={
          <View style={tw`items-center mt-10`}>
            <Text style={[tw`text-gray-500 dark:text-gray-400`, { fontSize: 14 }]}>No liked songs yet</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

export default LikedSongsScreen;