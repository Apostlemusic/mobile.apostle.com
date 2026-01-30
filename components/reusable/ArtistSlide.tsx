import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, ImageBackground } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import tw from "twrnc";
import { getDiscover } from "@/services/content";

const { width } = Dimensions.get("window");

type FeaturedArtist = {
  id: string;
  name: string;
  description: string;
  image: any;
  descriptionImage: any;
  ctaLabel?: string;
};

type ArtistProfileCardProps = {
  items?: FeaturedArtist[];
  onPressItem?: (artist: FeaturedArtist) => void;
};

const DEFAULT_FEATURED: FeaturedArtist[] = [
  {
    id: "sondae",
    name: "Sondae",
    description:
      "The Pilgrim, By the water and many more, Sondae’s art and worship to GOD speaks to his listener’s like the psalms of David, Made of steel, Elohim and much more his music...",
    image: require("../../assets/images/artist-imageholder.png"),
    descriptionImage: require("../../assets/images/artist-description.png"),
    ctaLabel: "Explore",
  },
  {
    id: "koinonia",
    name: "Koinonia Worship",
    description:
      "A heartfelt shoutout to the team behind the nights of worship. Expect deep lyrics, live moments, and a sound that lifts your spirit.",
    image: require("../../assets/images/artist-imageholder.png"),
    descriptionImage: require("../../assets/images/artist-description.png"),
    ctaLabel: "Listen",
  },
  {
    id: "light",
    name: "Light & Sound",
    description:
      "Featured artist of the week. Fresh releases, soulful melodies, and a new single dropping this Friday.",
    image: require("../../assets/images/artist-imageholder.png"),
    descriptionImage: require("../../assets/images/artist-description.png"),
    ctaLabel: "Play",
  },
];

type ApiSong = {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  author?: string;
  artists?: string[];
  trackImg?: string;
  image?: string;
  artworkUrl?: string;
};

const normalizeSongs = (payload: any): ApiSong[] => {
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

const toFeaturedSong = (song: ApiSong, fallbackIndex: number): FeaturedArtist => {
  const name = song.title ?? song.name ?? `Song ${fallbackIndex + 1}`;
  const description =
    song.description ??
    song.author ??
    (Array.isArray(song.artists) ? song.artists.join(", ") : "New release");
  const imageUri = song.trackImg ?? song.artworkUrl ?? song.image;
  return {
    id: String(song._id ?? song.id ?? name),
    name,
    description,
    image: imageUri ? { uri: imageUri } : require("../../assets/images/artist-imageholder.png"),
    descriptionImage: require("../../assets/images/artist-description.png"),
    ctaLabel: "Play",
  };
};

const ArtistProfileCard: React.FC<ArtistProfileCardProps> = ({ items, onPressItem }) => {
  const [remoteItems, setRemoteItems] = useState<FeaturedArtist[] | null>(null);

  useEffect(() => {
    if (items && items.length) return;
    let mounted = true;

    (async () => {
      try {
        const res = await getDiscover({ section: "new-releases", limit: 4, type: "song" });
        const list = normalizeSongs(res)
          .slice(0, 4)
          .map((song, idx) => toFeaturedSong(song, idx));
        if (mounted) setRemoteItems(list);
      } catch {
        if (mounted) setRemoteItems([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [items]);

  const data = useMemo(() => {
    if (items && items.length) return items.slice(0, 4);
    if (remoteItems && remoteItems.length) return remoteItems;
    return DEFAULT_FEATURED;
  }, [items, remoteItems]);

  return (
    <Carousel
      width={width}
      height={418}
      data={data}
      loop
      autoPlay
      autoPlayInterval={6000}
      renderItem={({ item }) => (
        <View style={tw`relative flex flex-row justify-end items-center`}>
          <View style={tw`w-[180px] h-[418px] absolute z-10 left-0 flex justify-center`}>
            <ImageBackground
              source={item.descriptionImage}
              style={tw`h-full w-full absolute`}
              resizeMode="cover"
            />

            <Text style={tw`text-white text-xl font-bold mt-10 ml-2 w-[165px]`}>
              {item.name}
            </Text>
            <Text style={tw`text-white text-sm font-medium mt-2 ml-2 w-[165px]`} numberOfLines={7}>
              {item.description}
            </Text>
            <TouchableOpacity
              onPress={() => onPressItem?.(item)}
              style={tw`bg-[#81888852] dark:bg-[#2d2d3580] rounded-[6px] px-10 py-2 mt-4 mb-15 ml-2 w-[140px] items-center justify-center`}
            >
              <Text style={tw`text-white text-base font-bold`}>{item.ctaLabel ?? "Explore"}</Text>
            </TouchableOpacity>
          </View>
          <ImageBackground source={item.image} style={tw`h-[418px] w-[330px]`} />
        </View>
      )}
    />
  );
};

export default ArtistProfileCard;