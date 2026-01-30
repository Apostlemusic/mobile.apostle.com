import React, { useEffect, useState } from "react";
import {
  View,
  Keyboard,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { router, usePathname } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Svg, { Path } from "react-native-svg"; // Import Svg and Path
import tw from "twrnc";
import { useTheme } from "@/contexts/ThemeContext";

const NavigationBar = () => {
  const pathname = usePathname();
  const { mode } = useTheme();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  if (isKeyboardVisible) return null; // Hide tab bar when keyboard is visible

  const Links = [
    {
      link: "home",
      icon: (
        <Entypo
          name="home"
          size={27}
          color={mode === "dark" ? "#FFFFFF" : "#000000"}
        />
      ),
      path: "/Pages/Home",
    },
    {
      link: "search",
      icon: (
        <AntDesign
          name="search1"
          size={27}
          color={mode === "dark" ? "#FFFFFF" : "#000000"}
        />
      ),
      path: "/Pages/Search",
    },
    {
      link: "library",
      icon: (
        <Svg
          width="27"
          height="27"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            d="M17.2064 1.23726L29.25 28.2847L27.8526 28.9099L15.8091 1.86243L17.2064 1.23726ZM0.75 28.8915V1.09015H2.29457V28.8915H0.75ZM10.0171 28.8915V1.09015H11.5617V28.8915H10.0171Z"
            fill={mode === "dark" ? "#FFFFFF" : "#000000"}
          />
        </Svg>
      ),
      path: "/Pages/Library",
    },
  ];

  return (
    <View
      style={tw`absolute bottom-0 left-0 right-0 bg-[#0081C9] dark:bg-[#14141b] p-3 py-5 shadow-lg flex-row justify-between items-center`}
    >
      {Links.map((link, index) => (
        <TouchableOpacity
          key={index}
          style={tw`flex-row items-center px-5 py-1 ${
            pathname === link.path
              ? "border border-white rounded-full py-2 gap-2"
              : ""
          }`}
          onPress={() => router.push(link.path)}
        >
          {pathname === link.path ? (
            <View style={tw`flex flex-row gap-x-2`}>
              {link.icon}
              <Text style={tw`font-medium text-lg text-[#FFFFFF]`}>
                {link.link.charAt(0).toUpperCase() + link.link.slice(1)}
              </Text>
            </View>
          ) : (
            link.icon
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default NavigationBar; 