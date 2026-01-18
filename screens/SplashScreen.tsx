import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import tw from "twrnc";
import { useRouter } from "expo-router";
import { api } from "@/lib/api/client";

const SplashScreenComponent: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await api.post("/api/auth/verifyToken", {});
        // Navigate to the home screen upon successful verification
        router.push("/tabs/Home");
      } catch (error: any) {
        // Navigate to login if token verification fails
        router.push("/Auth");
      }
    };

    verifyToken();
  }, [router]);

  return (
    <View style={tw`flex-1 justify-center items-center bg-gray-100 dark:bg-[#0b0b10]`}>
      <ActivityIndicator size="large" color="#4B5563" />
      <Text style={tw`text-lg text-black dark:text-gray-100 mt-4`}>
        Checking your session...
      </Text>
    </View>
  );
};

export default SplashScreenComponent;
