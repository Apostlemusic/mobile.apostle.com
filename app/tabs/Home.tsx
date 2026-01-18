import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Image, Platform } from "react-native";
import tw from "twrnc";
import { SkeletonLoader } from "@/components/reusable/Skeleton";

import { SongProvider } from "@/contexts/SongContext";
import MusicHome from "@/components/carouselSlide/Carousel";
import MoreForYou from "@/components/reusable/MoreForYou";


const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <SongProvider>
          <ScrollView style={tw`bg-gray-50 dark:bg-[#0b0b10] h-[100%] w-full`}>
            <MusicHome />
            <MoreForYou />
            {/* <View style={tw`h-20`} />  Spacer to avoid content being hidden behind Miniplayer */}
          </ScrollView>
        </SongProvider>
      )}
    </>
  );
};

export default Index;

// we pushing to finish this project but something is still wrong somewhere