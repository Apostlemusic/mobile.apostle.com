import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, Dimensions, ImageBackground } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import tw from "twrnc";

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

const ArtistProfileCard: React.FC<ArtistProfileCardProps> = ({ items, onPressItem }) => {
  const data = useMemo(() => (items && items.length ? items.slice(0, 4) : DEFAULT_FEATURED), [items]);

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