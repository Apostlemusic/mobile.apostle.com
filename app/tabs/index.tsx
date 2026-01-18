import React from "react";
import { Tabs } from "expo-router";
import { Entypo, AntDesign } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import tw from "twrnc";
import { useTheme } from "@/contexts/ThemeContext";

export default function TabLayout() {
  const { mode } = useTheme();
  const tabBackground = mode === "dark" ? "#14141b" : "#0081C9";
  const inactiveColor = mode === "dark" ? "#9ca3af" : "#CCCCCC";
  const activeColor = "#FFFFFF";

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: tabBackground,
          paddingVertical: 10,
          height: 70,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
        tabBarIcon: ({ focused }) => {
          switch (route.name) {
            case "Home":
              return (
                <Entypo
                  name="home"
                  size={27}
                  color={focused ? activeColor : inactiveColor}
                />
              );
            case "Search":
              return (
                <AntDesign
                  name="search1"
                  size={27}
                  color={focused ? activeColor : inactiveColor}
                />
              );
            case "Library":
              return (
                <Svg width="27" height="27" viewBox="0 0 30 30" fill="none">
                  <Path
                    d="M17.2064 1.23726L29.25 28.2847L27.8526 28.9099L15.8091 1.86243L17.2064 1.23726ZM0.75 28.8915V1.09015H2.29457V28.8915H0.75ZM10.0171 28.8915V1.09015H11.5617V28.8915H10.0171Z"
                    fill={focused ? activeColor : inactiveColor}
                  />
                </Svg>
              );
            default:
              return null;
          }
        },
      })}
    >
      <Tabs.Screen name="Home" />
      <Tabs.Screen name="Search" />
      <Tabs.Screen name="Library" />
    </Tabs>
  );
}