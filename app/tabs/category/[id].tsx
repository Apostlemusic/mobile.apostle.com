import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { getCategoryBySlug, unwrapArray } from "@/services/content";
import { usePlayer } from "@/components/player/PlayerContext";

type AnyItem = any;

const isMongoId = (v?: string) => typeof v === "string" && /^[a-f0-9]{24}$/i.test(v);

export default function CategoryPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const slug = Array.isArray(id) ? id[0] : (id || "");

  const { playById } = usePlayer();

  const [raw, setRaw] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCategory = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      const data = await getCategoryBySlug(slug);
      setRaw(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [slug]);

  const songs: AnyItem[] = useMemo(() => {
    const items = unwrapArray(raw);
    return Array.isArray(items) ? items : [];
  }, [raw]);

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
            {slug}
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

      {loading && songs.length === 0 ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator />
          <Text style={[tw`text-gray-500 dark:text-gray-400 mt-3`, { fontSize: 14 }]}>Loading songs…</Text>
        </View>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item: AnyItem, idx: number) => item?._id?.toString?.() ?? `${idx}`}
          contentContainerStyle={tw`px-4 pb-20`}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={tw`items-center mt-10`}>
              <Text style={[tw`text-gray-500 dark:text-gray-400`, { fontSize: 14 }]}>No songs found.</Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const id = isMongoId(item?._id) ? item._id : undefined;
            return (
              <TouchableOpacity
                key={id ?? `song-${index}`}
                activeOpacity={0.9}
                onPress={() => id && playById(String(id))}
              >
                <View
                  style={tw`flex-row items-center p-3 mb-2 rounded-2xl bg-white dark:bg-[#14141b] border border-[#eaeaea] dark:border-[#2d2d35]`}
                >
                  <View style={tw`w-14 h-14 rounded-xl mr-3 overflow-hidden bg-[#f1f1f1] dark:bg-[#23232b]`}>
                    {item?.trackImg ? (
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
                      {item?.title ?? "Untitled"}
                    </Text>
                    <Text
                      style={[tw`text-gray-500 dark:text-gray-400`, { fontSize: 12 }]}
                      numberOfLines={1}
                    >
                      {item?.author ?? "Unknown"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}