import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { SkeletonLoader } from "@/components/reusable/Skeleton";
import CarouselComponent from "@/components/carouselSlide/Carousel";
import Topbar from "@/components/reusable/Topbar";
import {
  GetNewReleases,
  GetPodcasts,
  GetQuickPicks,
  GetRecentlyPlays,
  GetTrending,
} from "@/components/getPlaylists/getPlaylists";
import axios from "axios";
import NavigationBar from "@/components/reusable/Navbar";
import { SongProvider } from "@/contexts/SongContext";
import MiniPlayer from "@/components/musicPlayer/Miniplayer";
import MusicHome from "@/components/carouselSlide/Carousel";


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
          {/* Topbar and Main Content */}
          {/* <Topbar /> */}
          <ScrollView style={tw`bg-gray-50 h-full w-full mb-[160px]`}>
            <MusicHome/>
            <GetRecentlyPlays />
            <GetQuickPicks text="Quick Picks" />
            <GetPodcasts />
            <GetNewReleases />
            <GetTrending text="Trending" />
          </ScrollView>

          {/* MiniPlayer */}
          {/* <MiniPlayer  /> */}

          {/* <NavigationBar /> */}
        </SongProvider>
      )}
    </>
  );
};

export default Index;

// we pushing to finish this project but something is still wrong somewhere