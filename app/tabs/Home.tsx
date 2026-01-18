import React from "react";
import { ScrollView } from "react-native";
import tw from "twrnc";

import { SongProvider } from "@/contexts/SongContext";
import MusicHome from "@/components/carouselSlide/Carousel";
import MoreForYou from "@/components/reusable/MoreForYou";


const Index = () => {
  return (
    <SongProvider>
      <ScrollView style={tw`bg-gray-50 dark:bg-[#0b0b10] h-[100%] w-full`}>
        <MusicHome />
        <MoreForYou />
        {/* <View style={tw`h-20`} />  Spacer to avoid content being hidden behind Miniplayer */}
      </ScrollView>
    </SongProvider>
  );
};

export default Index;

// we pushing to finish this project but something is still wrong somewhere