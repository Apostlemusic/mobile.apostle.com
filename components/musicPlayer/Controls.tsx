// src/components/Controls.tsx
import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import tailwind from "twrnc";
import { usePlayer } from "../player/PlayerContext";

interface ControlsProps {
  isDarkTheme: boolean;
}

const Controls: React.FC<ControlsProps> = ({ isDarkTheme }) => {
  const { isPlaying, playPauseToggle, next, previous } = usePlayer();

  return (
    <View style={tailwind`flex flex-row items-center justify-between w-11/12`}>
      <View style={styles.extraControls}>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons
            name="shuffle-outline"
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={previous}>
          <AntDesign name="stepbackward" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={playPauseToggle}>
          <Ionicons
            name={isPlaying ? "pause-circle-outline" : "play-circle-outline"}
            size={50}
            color={isDarkTheme ? "#fff" : "#fff"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={next}>
          <AntDesign name="stepforward" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.extraControls}>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons
            name="repeat-outline"
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 16,
    marginLeft: 15,
  },
  extraControls: {
    flexDirection: "row",
    marginTop: 20,
    marginLeft: 15,
  },
});

export default Controls;
