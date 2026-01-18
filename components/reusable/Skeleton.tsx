import React, { useRef, useEffect } from "react";
import {
  Animated,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import tw from "twrnc";

const MusicPlayerSkeleton = () => {
  return (
    <View style={tw`flex-1 justify-center items-center bg-gray-100 dark:bg-[#0b0b10] p-4`}>
      <View style={tw`w-60 h-60 bg-gray-300 dark:bg-[#23232b] rounded-lg mb-4`} />
      <View style={tw`w-48 h-6 bg-gray-300 dark:bg-[#23232b] rounded mb-2`} />
      <View style={tw`w-32 h-5 bg-gray-300 dark:bg-[#23232b] rounded mb-6`} />
      <View style={tw`flex-row justify-around w-full px-8`}>
        <View style={tw`w-10 h-10 bg-gray-300 dark:bg-[#23232b] rounded-full`} />
        <View style={tw`w-16 h-16 bg-gray-300 dark:bg-[#23232b] rounded-full`} />
        <View style={tw`w-10 h-10 bg-gray-300 dark:bg-[#23232b] rounded-full`} />
      </View>
      <View style={tw`w-full h-3 bg-gray-300 dark:bg-[#23232b] rounded mt-6 mb-2`} />
      <View style={tw`flex-row justify-between w-full px-4`}>
        <View style={tw`w-12 h-4 bg-gray-300 dark:bg-[#23232b] rounded`} />
        <View style={tw`w-12 h-4 bg-gray-300 dark:bg-[#23232b] rounded`} />
      </View>
    </View>
  );
};

const SkeletonLoader = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const shimmerStyle = {
    opacity: shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
  };

  const SkeletonBox = ({ width, height, style }: any) => (
    <Animated.View
      style={[tw`bg-gray-200 dark:bg-[#23232b] rounded`, { width, height }, shimmerStyle, style]}
    />
  );

  return (
    <>
      <View style={tw`p-4 flex-row justify-between items-center`}>
        <View style={tw`flex-row items-center`}>
          <SkeletonBox width={32} height={32} style={tw`mr-2`} />
          <SkeletonBox width={80} height={20} />
        </View>
        <SkeletonBox width={32} height={32} style={tw`rounded-full`} />
      </View>

      <ScrollView style={tw`bg-gray-50 dark:bg-[#0b0b10] h-full w-full`}>
        {/* Carousel Loader */}
        <View style={tw`h-48 w-full bg-gray-200 dark:bg-[#23232b] mb-6`} />

        {/* Recently Played Section */}
        <View style={tw`px-4 mb-6`}>
          <SkeletonBox width={120} height={24} style={tw`mb-3`} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
              <View key={item} style={tw`mr-4`}>
                <SkeletonBox width={128} height={128} style={tw`mb-2`} />
                <SkeletonBox width={80} height={16} style={tw`mb-1`} />
                <SkeletonBox width={60} height={12} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Quick Picks Section */}
        <View style={tw`px-4 mb-6`}>
          <SkeletonBox width={120} height={24} style={tw`mb-3`} />
          {[1, 2, 3].map((item) => (
            <View
              key={item}
              style={tw`flex-row items-center p-2 bg-white dark:bg-[#14141b] rounded-lg shadow-sm mb-2`}
            >
              <SkeletonBox width={48} height={48} style={tw`mr-3`} />
              <View style={tw`flex-1`}>
                <SkeletonBox width={100} height={16} style={tw`mb-1`} />
                <SkeletonBox width={80} height={12} />
              </View>
              <Ionicons name="play" size={24} color="#d1d5db" />
            </View>
          ))}
        </View>

        {/* Podcasts Section */}
        <View style={tw`px-4 mb-6`}>
          <SkeletonBox width={120} height={24} style={tw`mb-3`} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
              <View key={item} style={tw`mr-4`}>
                <SkeletonBox width={160} height={160} style={tw`mb-2`} />
                <SkeletonBox width={100} height={16} style={tw`mb-1`} />
                <SkeletonBox width={80} height={12} />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
};

const SearchSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const shimmerStyle = {
    opacity: shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
  };

  const SkeletonBox = ({ width, height, style }: any) => (
    <Animated.View
      style={[tw`bg-gray-200 dark:bg-[#23232b] rounded`, { width, height }, shimmerStyle, style]}
    />
  );

  return (
    <>
      <View style={tw`p-4 flex-row justify-between items-center`}>
        <View style={tw`flex-row items-center`}>
          <SkeletonBox width={32} height={32} style={tw`mr-2`} />
          <SkeletonBox width={80} height={20} />
        </View>
        <SkeletonBox width={32} height={32} style={tw`rounded-full`} />
      </View>

      {/* <ScrollView style={tw`bg-gray-50 h-full w-full`}> */}
        {/* Recently Played Section */}
        <View style={tw`px-4 mb-6`}>
          <SkeletonBox width={120} height={24} style={tw`mb-3`} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
              <View key={item} style={tw`mr-4`}>
                <SkeletonBox width={128} height={128} style={tw`mb-2`} />
                <SkeletonBox width={80} height={16} style={tw`mb-1`} />
                <SkeletonBox width={60} height={12} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Quick Picks Section */}
        <View style={tw`px-4 mb-6`}>
          <SkeletonBox width={120} height={24} style={tw`mb-3`} />
          {[1, 2, 3].map((item) => (
            <View
              key={item}
              style={tw`flex-row items-center p-2 bg-white dark:bg-[#14141b] rounded-lg shadow-sm mb-2`}
            >
              <SkeletonBox width={48} height={48} style={tw`mr-3`} />
              <View style={tw`flex-1`}>
                <SkeletonBox width={100} height={16} style={tw`mb-1`} />
                <SkeletonBox width={80} height={12} />
              </View>
              <Ionicons name="play" size={24} color="#d1d5db" />
            </View>
          ))}
        </View>
      {/* </ScrollView> */}
    </>
  );
};
export { MusicPlayerSkeleton, SkeletonLoader, SearchSkeleton };
