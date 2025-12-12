import React, { useCallback, useEffect, useState } from "react";
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
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { usePlayer } from "@/components/player/PlayerContext";

const LikedSongsScreen: React.FC = () => {
  const router = useRouter();
  const [likedSongs, setLikedSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { playById } = usePlayer();

  const parsePayload = (data: any) => {
    const payload = Array.isArray(data) ? data[0] : data;
    return Array.isArray(payload?.songs) ? payload.songs : [];
  };

  const fetchLiked = async () => {
    try {
      if (!refreshing) setLoading(true);
      const res = await axios.get(
        "https://apostle.onrender.com/api/song/getLikedSongs",
        { withCredentials: true }
      );
      setLikedSongs(parsePayload(res.data));
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

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        const id = item.trackId ?? item._id;
        if (id) playById(id);
      }}
    >
      <View
        style={[
          tw`flex-row items-center p-3 mb-2 rounded-2xl`,
          { backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#eaeaea" },
        ]}
      >
        <View
          style={[
            tw`w-14 h-14 rounded-xl mr-3`,
            { overflow: "hidden", backgroundColor: "#f1f1f1" },
          ]}
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
          <Text style={[tw`text-black`, { fontSize: 16, fontWeight: "700" }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[tw`text-gray-500`, { fontSize: 12 }]} numberOfLines={1}>
            {item.author || (item.artists?.join(", ") ?? "")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && likedSongs.length === 0) {
    return (
      <View style={[tw`flex-1 items-center justify-center`, { backgroundColor: "#fafafa" }]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={[tw`flex-1`, { backgroundColor: "#fafafa" }]}>
      {/* Header */}
      <View style={tw`px-4 pt-6 pb-4 flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[tw`w-9 h-9 rounded-xl items-center justify-center mr-2`, { backgroundColor: "#f1f3f5" }]}
          >
            <Ionicons name="chevron-back" size={18} color="#000" />
          </TouchableOpacity>
          <Text style={[tw`text-black`, { fontSize: 20, fontWeight: "800" }]}>
            Liked Songs
          </Text>
        </View>
        <TouchableOpacity
          onPress={fetchLiked}
          style={[tw`px-3 py-2 rounded-xl`, { backgroundColor: "#eef2ff" }]}
        >
          <Text style={[tw`text-black`, { fontSize: 12, fontWeight: "600" }]}>Refresh</Text>
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
            <Text style={[tw`text-gray-500`, { fontSize: 14 }]}>No liked songs yet</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

export default LikedSongsScreen;