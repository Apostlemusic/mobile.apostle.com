import ArrowButton from "@/components/reusable/Button";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import tw from "twrnc";

const { width } = Dimensions.get("window");

const SplashScreen = () => {
  const [page, setPage] = useState(0);
  const translateX = useSharedValue(0);
  const router = useRouter();

  const pages = [
    {
      content: (
        <View style={tw`w-full h-[85%] mb-[20%] flex justify-center`}>
          <View style={tw`px-5 mt-[-10%]`}>
            <Text style={tw`text-[#373737] font-bold text-[36px]`}>
              You're one step closer to achieving your
            </Text>
            <Text style={tw`text-[#0081C9] font-bold text-[36px]`}>
              music and podcast dreams.
            </Text>
          </View>

          <Image
            source={require("../../assets/images/onboarding/microphone.png")}
            style={tw`absolute bottom-0`}
          />
        </View>
      ),
    },
    {
      content: (
        <View
          style={tw`w-full h-[85%] mb-[20%] flex justify-evenly items-center`}
        >
          <Image
            source={require("../../assets/images/onboarding/discover.png")}
            style={tw``}
          />

          <View style={tw`px-5 mt-[-10%]`}>
            <Text
              style={tw`text-[#373737] text-center font-semibold text-[24px] mb-8`}
            >
              Discover music and podcasts that resonate with your soul.
            </Text>
            <Text style={tw`text-[#808080] text-center text-[15px]`}>
              Reach your spiritual goals effortlessly, whether it's deepening
              your faith or finding uplifting sermons and songs.
            </Text>
          </View>
        </View>
      ),
    },
    {
      content: (
        <View
          style={tw`w-full h-[85%] mb-[20%] flex justify-evenly items-center`}
        >
          <Image
            source={require("../../assets/images/onboarding/enrich.png")}
            style={tw``}
          />

          <View style={tw`px-5 mt-[-10%]`}>
            <Text
              style={tw`text-[#373737] text-center font-semibold text-[25px] mb-8`}
            >
              Enrich your mind, with our curated selection of music, podcasts
              and sermons.
            </Text>
            <Text style={tw`text-[#808080] text-center text-[16px]`}>
              Access music and podcasts anytime, anywhere, no matter your taste.
            </Text>
          </View>
        </View>
      ),
    },
  ];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const goToNextPage = () => {
    if (page < pages.length - 1) {
      setPage(page + 1);
      translateX.value = withSpring(-((page + 1) * width));
    } else {
      // Navigate to SignUp page
      router.push("/Auth/Signin");
    }
  };

  const goToPreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
      translateX.value = withSpring(-((page - 1) * width));
    }
  };

  const goToPage = (index: number) => {
    setPage(index);
    translateX.value = withSpring(-index * width);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.swipeContainer,
          { width: width * pages.length },
          animatedStyle,
        ]}
      >
        {pages.map((p, index) => (
          <View key={index} style={styles.page}>
            {p.content}
          </View>
        ))}
      </Animated.View>
      <View style={styles.buttonContainer}>
        <ArrowButton
          direction="prev"
          onPress={goToPreviousPage}
          disabled={page === 0}
        />

        <View style={styles.tabContainer}>
          {pages.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tab, page === index && styles.activeTab]}
              onPress={() => goToPage(index)}
            />
          ))}
        </View>

        {/* Remove the disabled prop when on the last page */}
        <ArrowButton
          direction="next"
          onPress={goToNextPage}
          disabled={false}
          // Keep the button enabled even on the last page
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#ffffff", // Change background color if needed
  },
  swipeContainer: {
    flexDirection: "row",
    height: "100%",
  },
  page: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    // padding: ,
  },
  image: {
    width: "80%", // Adjust as needed
    height: 200, // Adjust based on your images
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
  },
  tab: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#808080", // Default tab color
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: "#8FD3F7", // Active tab color
    width: 40,
  },
});

export default SplashScreen;
