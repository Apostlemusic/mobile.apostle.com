import React from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  StyleSheet,
  ImageBackground,
  FlatList,
  Platform,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import tw from "twrnc";

const { width: screenWidth } = Dimensions.get("window");

// Carousel Data
const carouselData = [
  {
    image: require("../../assets/images/album-cover.jpg"),
    title: "He Is Amazing",
    artist: "Samuel Agboyega",
  },
  {
    image: require("../../assets/images/papa.png"),
    title: "Heaven’s Symphony",
    artist: "Choir Group",
  },
];

// New Releases Data
const newReleases = [
  {
    image: require("../../assets/images/papa.png"),
    title: "Bleeding Heart",
    artist: "raemo",
    type: "Song",
    releaseDate: "01-08-2025",
  },
  {
    image: require("../../assets/images/papa.png"),
    title: "Another Track",
    artist: "John Doe",
    type: "Song",
    releaseDate: "15-09-2025",
  },
];

// Render Carousel Item
const renderCarouselItem = ({ item }: { item: any }) => (
  <View style={tw`px-3 w-full justify-center items-center mt-5 relative`}>
    <ImageBackground
      source={item.image}
      style={tw`w-[210px] h-[320px] overflow-hidden absolute top-0 z-10 p-3`}
      imageStyle={{ borderBottomLeftRadius: 50, borderTopRightRadius: 50 }}
    >
      {/* Artist & Title */}
      <Text style={tw`text-white text-base font-semibold mb-1 w-1/2`}>{item.artist}</Text>
      <Text style={tw`text-black text-lg font-semibold absolute bottom-3 right-2 w-1/2 text-center`}>{item.title}</Text>
    </ImageBackground>
  </View>
);

// Render New Release Card
const renderNewRelease = ({ item }: { item: any }) => (
  <View style={tw`mr-2`}>
    <View style={tw`bg-[#394F5C94] rounded-2xl w-[300px] p-3 flex-row items-center gap-4`}>
      <Image
        source={item.image}
        style={tw`w-22 h-24 rounded-xl mb-2`}
        resizeMode="cover"
      />
      <View>
        <Text style={tw`text-base font-semibold`}>Title: {item.title}</Text>
        <Text style={tw`text-sm text-[#000]`}>Artist: {item.artist}</Text>
        <View style={tw`flex-row gap-2 mt-2 justify-between items-center`}>
          <Text style={tw`text-xs text-[#000]`}>Type: {item.type}</Text>
          <Text style={tw`text-xs text-[#000]`}>
            Date: {item.releaseDate}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

const MusicHome = () => {
  return (
    <View style={tw`flex-1 justify-center`}>
      {/* Jump Back In */}
      <View style={tw`px-4 ${Platform.OS === "ios" ? "mt-0" : "mt-10"} flex items-center justify-center bg-[#2C3E50] rounded-b-[85px] relative h-[330px]`}>
        <Text style={tw`text-xl font-extrabold text-white rounded-xl px-3 mt-3 w-full`}>
          Jump Back In
        </Text>
        <Carousel
          data={carouselData}
          renderItem={renderCarouselItem}
          width={screenWidth}
          height={370}
          loop
          autoPlay
          autoPlayInterval={5000}
          style={tw`-mb-16`}
        />
      </View>

      {/* New Releases */}
      <View style={tw`px-4 mt-24`}>
        <Text style={tw`text-lg font-bold mb-3`}>New Releases For YOU</Text>
        <FlatList
          horizontal
          data={newReleases}
          renderItem={renderNewRelease}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default MusicHome;
