import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Image, Platform } from "react-native";
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
          <ScrollView style={tw`bg-gray-50 h-full w-full ${Platform.OS === "ios" ? "mb-[100px]" : "mb-[135px]"}>`}>
            <MusicHome />
            <MoreForYou />
          </ScrollView>
        </SongProvider>
      )}
    </>
  );
};

export default Index;

// we pushing to finish this project but something is still wrong somewhere