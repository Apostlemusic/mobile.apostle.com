import React from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  ImageBackground,
  FlatList,
  Platform,
  TouchableOpacity,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import tw from "twrnc";
// Use the centralized player
import { usePlayer } from "../player/PlayerContext";
// Use local hook with correct relative path
import {
  useFetchSongs,
  normalizeArray,
  pickPlayableUrl,
  GlobalTrack,
} from "../../hooks/useFetchSongs";

const { width: screenWidth } = Dimensions.get("window");

// Sleek skeleton for loading
const SkeletonCard = ({
  width = 210,
  height = 320,
  roundedBL = 50,
  roundedTR = 50,
}: {
  width?: number;
  height?: number;
  roundedBL?: number;
  roundedTR?: number;
}) => (
  <View
    style={[
      tw`bg-gray-200`,
      { width, height, borderBottomLeftRadius: roundedBL, borderTopRightRadius: roundedTR },
    ]}
  />
);

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
        <Text style={tw`text-white text-base font-semibold mb-1 w-1/2`} numberOfLines={1}>
          {item.author || item.artist || "Unknown Artist"}
        </Text>
        <Text
          style={tw`text-black text-lg font-semibold absolute bottom-3 right-2 w-1/2 text-center`}
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
      <View style={tw`bg-[#394F5C94] rounded-2xl w-[300px] p-3 flex-row items-center gap-4`}>
        <Image source={{ uri: img }} style={tw`w-22 h-24 rounded-xl mb-2`} resizeMode="cover" />
        <View style={tw`flex-1`}>
          <Text style={tw`text-base font-semibold`} numberOfLines={1}>
            Title: {item.title}
          </Text>
          <Text style={tw`text-sm text-[#000]`} numberOfLines={1}>
            Artist: {item.author || item.artist}
          </Text>
          <View style={tw`flex-row gap-2 mt-2 justify-between items-center`}>
            <Text style={tw`text-xs text-[#000]`} numberOfLines={1}>
              Type: Song
            </Text>
            <Text style={tw`text-xs text-[#000]`} numberOfLines={1}>
              Date: {item.createdAt?.slice(0, 10) ?? ""}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const MusicHome = () => {
  const { playById } = usePlayer();

  // Both sections use recent plays per your spec
  const recentEndpoint = "https://apostle.onrender.com/api/song/getRecentPlays";
  const {
    songs: recentRaw,
    loading: recentLoading,
    error: recentError,
  } = useFetchSongs(recentEndpoint);

  const recent: GlobalTrack[] = normalizeArray(recentRaw);

  const onPressPlay = (t: GlobalTrack) => {
    const id = t.trackId || t.id;
    if (id) {
      playById(id);
      return;
    }
    const url = pickPlayableUrl(t);
    if (!url) return;
    playById(id ?? ""); // will no-op without id
  };

  const hasItems = Array.isArray(recent) && recent.length > 0;
  const showJumpSkeleton = recentLoading && !hasItems && !recentError;
  const showNewSkeleton = recentLoading && !hasItems && !recentError;

  return (
    <View style={tw`flex-1 justify-center`}>
      {/* Jump Back In */}
      {hasItems || showJumpSkeleton ? (
        <View
          style={tw`px-4 ${Platform.OS === "ios" ? "mt-0" : "mt-10"} flex items-center justify-center bg-[#2C3E50] rounded-b-[85px] relative h-[330px]`}
        >
          <Text style={tw`text-xl font-extrabold text-white rounded-xl px-3 mt-3 w-full`}>
            Jump Back In
          </Text>

          {showJumpSkeleton ? (
            <View style={tw`w-full items-center -mb-16`}>
              <SkeletonCard />
            </View>
          ) : !recentError && hasItems ? (
            <Carousel
              data={recent}
              renderItem={({ item }) => (
                <TouchableOpacity activeOpacity={0.8} onPress={() => onPressPlay(item)}>
                  {renderCarouselItem({ item })}
                </TouchableOpacity>
              )}
              width={screenWidth}
              height={370}
              loop
              autoPlay
              autoPlayInterval={5000}
              style={tw`-mb-16`}
            />
          ) : null}
        </View>
      ) : null}

      {/* New Releases */}
      {hasItems || showNewSkeleton ? (
        <View style={tw`px-4 mt-24`}>
          <Text style={tw`text-lg font-bold mb-3`}>New Releases For YOU</Text>

          {showNewSkeleton ? (
            <FlatList
              horizontal
              data={[...Array(4)].map((_, i) => ({ id: `sk-${i}` }))}
              renderItem={() => (
                <SkeletonCard width={300} height={100} roundedBL={16} roundedTR={16} />
              )}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
            />
          ) : !recentError && hasItems ? (
            <FlatList
              horizontal
              data={recent}
              renderItem={({ item }) => (
                <TouchableOpacity activeOpacity={0.8} onPress={() => onPressPlay(item)}>
                  {renderNewRelease({ item })}
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => (item.trackId || item.id || `${index}`)}
              showsHorizontalScrollIndicator={false}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

export default MusicHome;
