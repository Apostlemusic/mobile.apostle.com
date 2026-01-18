import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
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

  useEffect(() => {
    if (!slug) return;
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const data = await getCategoryBySlug(slug);
        if (mounted) setRaw(data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const songs: AnyItem[] = useMemo(() => {
    const items = unwrapArray(raw);
    return Array.isArray(items) ? items : [];
  }, [raw]);

  return (
    <SafeAreaView style={tw`flex-1 bg-white dark:bg-[#0b0b10]`}>
      <ScrollView>
        <View style={tw`flex-row items-center px-4 py-3`}>
          <TouchableOpacity onPress={() => router.back()} style={tw`mr-3`}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold text-black dark:text-gray-100`}>{slug}</Text>
        </View>

        {loading && <Text style={tw`px-4 text-gray-500 dark:text-gray-400`}>Loading…</Text>}

        {!loading && songs.length === 0 && (
          <Text style={tw`px-4 text-gray-500 dark:text-gray-400`}>No songs found.</Text>
        )}

        {songs.map((s: AnyItem, idx: number) => {
          const id = isMongoId(s?._id) ? s._id : undefined;
          return (
            <TouchableOpacity
              key={id ?? `song-${idx}`}
              style={tw`px-4 py-3 flex-row items-center`}
              onPress={() => id && playById(String(id))}
            >
              <Image
                source={{ uri: s?.trackImg || "https://via.placeholder.com/60" }}
                style={tw`w-12 h-12 rounded-lg mr-3`}
              />
              <View style={tw`flex-1`}>
                <Text style={tw`font-semibold text-black dark:text-gray-100`} numberOfLines={1}>{s?.title ?? "Untitled"}</Text>
                <Text style={tw`text-gray-500 dark:text-gray-400 text-xs`} numberOfLines={1}>{s?.author ?? "Unknown"}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}