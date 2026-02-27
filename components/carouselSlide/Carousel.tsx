import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  ImageBackground,
  Platform,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import tw from "twrnc";
import { useFocusEffect } from "@react-navigation/native";

import { usePlayer } from "../player/PlayerContext";
import { getDiscover } from "@/services/content";
import AuthorLink from "@/components/reusable/AuthorLink";

const { width: screenWidth } = Dimensions.get("window");

type GlobalTrack = any;

// Render Carousel Item (Jump Back In)
const renderCarouselItem = ({ item }: { item: GlobalTrack }) => {
  const placeholder = "https://via.placeholder.com/300";
  const img = item.artworkUrl || item.trackImg || item.image || placeholder;

  return (
    <View style={tw`px-3 w-full justify-center items-center mt-5 relative`}>
      <ImageBackground
        source={{ uri: img }}
        style={tw`w-[210px] h-[320px] overflow-hidden absolute top-0 z-10 p-3`}
        imageStyle={{ borderBottomLeftRadius: 50, borderTopRightRadius: 50 }}
      >
        <View style={tw`bg-black/20 self-start px-2 py-1 rounded-bl-xl rounded-tr-xl`}>
          <AuthorLink
            name={item.author || item.artist || ""}
            style={tw`text-white text-sm font-bold`}
            numberOfLines={1}
          />
        </View>
        <Text
          style={tw`text-white dark:text-gray-100 text-lg font-semibold absolute bottom-3 right-2 w-1/2 text-center bg-black/30 px-2 py-1 rounded-bl-xl rounded-tr-xl`}
          numberOfLines={2}
        >
          {item.title}
        </Text>
      </ImageBackground>
    </View>
  );
};

// Render New Release Card
const renderNewRelease = ({ item }: { item: GlobalTrack }) => {
  const placeholder = "https://via.placeholder.com/150";
  const img = item.artworkUrl || item.trackImg || item.image || placeholder;

  return (
    <View style={tw`mr-2`}>
      <View style={tw`bg-[#394F5C94] dark:bg-[#1f2a44] rounded-2xl w-[300px] p-3 flex-row items-center gap-4`}>
        <Image source={{ uri: img }} style={tw`w-22 h-24 rounded-xl mb-2`} resizeMode="cover" />
        <View style={tw`flex-1`}>
          <Text style={tw`text-base font-semibold text-black dark:text-gray-100`} numberOfLines={1}>
            Title: {item.title}
          </Text>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-sm text-[#000] dark:text-gray-100`} numberOfLines={1}>
              Artist:
            </Text>
            <AuthorLink
              name={item.author || item.artist || ""}
              style={tw`text-sm text-[#000] dark:text-gray-100 ml-1`}
              numberOfLines={1}
            />
          </View>
          <View style={tw`flex-row gap-2 mt-2 justify-between items-center`}>
            <Text style={tw`text-xs text-[#000] dark:text-gray-100`} numberOfLines={1}>
              Type: Song
            </Text>
            <Text style={tw`text-xs text-[#000] dark:text-gray-100`} numberOfLines={1}>
              Date: {item.createdAt?.slice(0, 10) ?? ""}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// ✅ Discover payloads often aren't shaped like your other endpoints.
// This safely extracts an array from any likely discover response.
function unwrapDiscoverItems(payload: any): any[] {
  if (!payload) return [];
  let raw: any[] = [];

  if (Array.isArray(payload)) raw = payload;
  else if (Array.isArray(payload?.items)) raw = payload.items;
  else if (Array.isArray(payload?.results)) raw = payload.results;
  else if (Array.isArray(payload?.songs)) raw = payload.songs;
  else if (Array.isArray(payload?.data)) raw = payload.data;
  else if (Array.isArray(payload?.data?.items)) raw = payload.data.items;
  else if (Array.isArray(payload?.data?.results)) raw = payload.data.results;
  else if (Array.isArray(payload?.data?.songs)) raw = payload.data.songs;
  else if (Array.isArray(payload?.section?.items)) raw = payload.section.items;
  else if (Array.isArray(payload?.data?.section?.items)) raw = payload.data.section.items;

  // Unwrap objects that are nested under an `item` key (e.g. { type: 'song', item: { ... } })
  return raw.map(el => {
    if (el && typeof el === 'object' && el.item && el.type) {
      return el.item;
    }
    return el;
  });
}

const MusicHome = () => {
  const { playById } = usePlayer();

  const [jumpRaw, setJumpRaw] = useState<any>(null);
  const [newRaw, setNewRaw] = useState<any>(null); // Added state for New Releases
  const [jumpLoading, setJumpLoading] = useState(true);
  const [newLoading, setNewLoading] = useState(true); // Added loading for New Releases
  const [jumpError, setJumpError] = useState<any>(null);

  const fetchJump = useCallback(async () => {
    try {
      setJumpLoading(true);
      setJumpError(null);
      const data = await getDiscover({ section: "jump-back-in", limit: 7 });
      setJumpRaw(data);
    } catch (e) {
      setJumpError(e);
      setJumpRaw(null);
    } finally {
      setJumpLoading(false);
    }
  }, []);

  const fetchNewItems = useCallback(async () => {
    try {
      setNewLoading(true);
      const data = await getDiscover({ section: "new-releases", limit: 20 });
      setNewRaw(data);
    } catch (e) {
      console.log("New Releases Error:", e);
    } finally {
      setNewLoading(false);
    }
  }, []);

  // ✅ Fetch on first mount
  useEffect(() => {
    void fetchJump();
    void fetchNewItems();
  }, [fetchJump, fetchNewItems]);

  // ✅ Also refetch when you navigate back to Home tab
  useFocusEffect(
    useCallback(() => {
      void fetchJump();
      void fetchNewItems();
      return () => { };
    }, [fetchJump, fetchNewItems])
  );

  const jumpBackIn: GlobalTrack[] = useMemo(() => unwrapDiscoverItems(jumpRaw), [jumpRaw]);
  const newReleases: GlobalTrack[] = useMemo(() => unwrapDiscoverItems(newRaw), [newRaw]);

  const onPressPlay = (t: GlobalTrack) => {
    const id = t._id || t.trackId || t.id;
    if (id) playById(String(id));
  };

  const hasJump = jumpBackIn.length > 0;
  const hasNew = newReleases.length > 0;

  // Added helper to check visibility
  const isJumpVisible = hasJump || jumpLoading;

  // If request fails, hide section (or keep skeleton if you prefer)
  if (jumpError && !hasJump) return null;

  return (
    <View style={tw`flex-1 justify-center`}>
      {/* Jump Back In */}
      {isJumpVisible ? (
        <View
          style={tw`px-4 ${Platform.OS === "ios" ? "mt-0" : "mt-10"} flex items-center justify-center bg-[#2C3E50] rounded-b-[85px] relative h-[330px]`}
        >
          <Text style={tw`text-xl font-extrabold text-white rounded-xl px-3 mt-3 w-full`}>
            Jump Back In
          </Text>

          {jumpLoading && !hasJump ? (
            <View style={tw`w-full items-center py-8`}>
              <ActivityIndicator color={tw.prefixMatch('dark') ? "#ffffff" : "#000000"} />
            </View>
          ) : (
            <Carousel
              key={`jump-carousel-${jumpBackIn.length}`} // ✅ Forces re-render when data arrives
              data={jumpBackIn}
              renderItem={({ item }) => (
                <TouchableOpacity activeOpacity={0.9} onPress={() => onPressPlay(item)}>
                  {renderCarouselItem({ item })}
                </TouchableOpacity>
              )}
              width={screenWidth}
              height={360}
              loop
              autoPlay
              autoPlayInterval={5000}
              style={tw`mt-2`}
            />
          )}
        </View>
      ) : null}

      {/* New Releases Section */}
      {hasNew || newLoading ? (
        <View style={tw`px-4 ${isJumpVisible ? "mt-18" : "mt-6"}`}>
          <Text style={tw`text-xl font-black text-gray-900 dark:text-gray-100 mb-4 px-2 tracking-tight`}>
            New Releases For YOU
          </Text>
          {newLoading && !hasNew ? (
            <View style={tw`py-6`}>
              <ActivityIndicator color="#4B5563" />
            </View>
          ) : (
            <FlatList
              horizontal
              data={newReleases}
              renderItem={({ item }) => (
                <TouchableOpacity activeOpacity={0.8} onPress={() => onPressPlay(item)}>
                  {renderNewRelease({ item })}
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => String(item._id || item.id || index)}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
      ) : null}
    </View>
  );
};

export default MusicHome;
