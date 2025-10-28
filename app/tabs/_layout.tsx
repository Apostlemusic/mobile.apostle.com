import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { Tabs, useRouter, usePathname } from "expo-router";
import MiniPlayer from "@/components/musicPlayer/Miniplayer";
import { SongProvider } from "@/contexts/SongContext";
import { AudioProvider } from "@/contexts/AudioContext";
import tw from "twrnc";
import AccountActive from "@/components/icon/AccountActive";
import Account from "@/components/icon/Account";
import HomeActive from "@/components/icon/HomeActive";
import Home from "@/components/icon/Home";
import SearchActive from "@/components/icon/SearchActive";
import Search from "@/components/icon/Search";
import BurstActive from "@/components/icon/BurstActive";
import Burst from "@/components/icon/Burst";

// SVG imports

const Layout = () => {
  const router = useRouter();
  const pathname = usePathname();

  const Links = [
    { path: "/tabs/Home", activeIcon: <HomeActive />, inactiveIcon: <Home /> },
    { path: "/tabs/Search", activeIcon: <SearchActive />, inactiveIcon: <Search /> },
    { path: "/tabs/Library", activeIcon: <BurstActive />, inactiveIcon: <Burst /> },
    { path: "/tabs/Profile", activeIcon: <AccountActive />, inactiveIcon: <Account /> },
  ];

  return (
    <SongProvider>
      <AudioProvider>
        <SafeAreaView style={tw`flex-1 bg-gray-100`}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "android" ? "padding" : "height"}
            style={tw`flex-1`}
          >
            <Tabs
              screenOptions={{
                headerShown: false,
                tabBarStyle: { display: "none" },
              }}
            >
              <Tabs.Screen name="Home" />
              <Tabs.Screen name="Search" />
              <Tabs.Screen name="Library" />
              <Tabs.Screen name="Profile" />
            </Tabs>
          </KeyboardAvoidingView>
        </SafeAreaView>

        <MiniPlayer />

        {/* Custom Bottom Navigation */}
        <View
          style={tw`absolute bottom-0 left-0 right-0 bg-white px-6 py-5 shadow-lg flex-row justify-between items-center rounded-t-3xl shadow-black`}
        >
          {Links.map((link, index) => {
            const isActive = pathname === link.path;
            return (
              <TouchableOpacity
                key={index}
                style={tw`flex-row items-center px-5 py-1`}
                onPress={() => router.push(link.path)}
              >
                {isActive ? link.activeIcon : link.inactiveIcon}
              </TouchableOpacity>
            );
          })}
        </View>
      </AudioProvider>
    </SongProvider>
  );
};

export default Layout;
