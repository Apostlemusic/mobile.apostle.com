import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import Slider from "@react-native-community/slider";
import tw from "twrnc";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();

  const [audioQuality, setAudioQuality] = useState("Automatic");
  const [mixValue, setMixValue] = useState(10);
  const [gapless, setGapless] = useState(true);
  const [volumeLeveler, setVolumeLeveler] = useState(false);

  const qualityOptions = ["Automatic", "Very High", "High", "Low"];

  // -----------------------------
  // 🔐 Handle Logout Function
  // -----------------------------
  const handleLogout = async () => {
    try {
      const res = await axios.post("https://apostle.onrender.com/api/auth/logout");
      console.log("Logout response:", res.data);

      // Clear stored tokens/user data
      await AsyncStorage.clear();

      // Navigate to login screen (adjust route as needed)
      router.push("/Auth/Signin");
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center px-4 py-5 border-b border-gray-200`}>
        <View style={tw`flex-row items-center`}>
          <View style={tw`w-12 h-12 rounded-full bg-gray-200 justify-center items-center mr-3`}>
            <Text style={tw`text-xl`}>👤</Text>
          </View>
          <Text style={tw`text-xl font-bold`}>Bukoye</Text>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={tw`bg-gray-400 rounded-md px-4 py-2`}
        >
          <Text style={tw`text-white font-semibold`}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Audio streaming quality */}
      <View style={tw`px-5 py-6 border-b border-gray-200`}>
        <Text style={tw`text-lg font-bold mb-1`}>Audio streaming quality</Text>
        <Text style={tw`text-gray-500 mb-4`}>
          Choose the best audio quality that best supports you
        </Text>

        {qualityOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={tw`flex-row justify-between items-center py-2 `}
            onPress={() => setAudioQuality(option)}
          >
            <Text style={tw`text-base`}>{option}</Text>
            <View
              style={tw`w-5 h-5 rounded-full border-2 flex justify-center items-center ${audioQuality === option ? "border-[#0C0932]" : "border-gray-400"}`}
            >
              {
                audioQuality === option ? (
                  <View style={tw`w-3 h-3 rounded-full bg-[#0C0932] m-[3px]`} />
                ) : (
                  null
                )
              }
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Mix Song */}
      <View style={tw`px-5 py-6`}>
        <Text style={tw`text-lg font-bold mb-1`}>Mix Song</Text>
        <Text style={tw`text-gray-500 mb-4`}>
          Mix the playing track and next track together for a smooth playback
        </Text>

        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-base`}>10s</Text>
          <Slider
            style={tw`flex-1 mx-3`}
            minimumValue={10}
            maximumValue={15}
            value={mixValue}
            minimumTrackTintColor="#0C0932"
            maximumTrackTintColor="#e5e7eb"
            thumbTintColor="#0C0932"
            onValueChange={setMixValue}
          />
          <Text style={tw`text-base`}>15s</Text>
        </View>

        {/* Toggles */}
        <View style={tw`mt-8`}>
          <View style={tw`flex-row justify-between items-center mb-5`}>
            <Text style={tw`text-base font-semibold`}>Gapless Playback</Text>
            <Switch
              value={gapless}
              onValueChange={setGapless}
              trackColor={{ false: "#d1d5db", true: "#0C0932" }}
              thumbColor={gapless ? "#fff" : "#9ca3af"}
            />
          </View>

          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-base font-semibold`}>Volume Leveler</Text>
            <Switch
              value={volumeLeveler}
              onValueChange={setVolumeLeveler}
              trackColor={{ false: "#d1d5db", true: "#0C0932" }}
              thumbColor={volumeLeveler ? "#fff" : "#9ca3af"}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
