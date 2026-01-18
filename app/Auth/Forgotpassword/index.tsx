import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { forgotPassword } from "@/services/auth";
import { getAuthEmail } from "@/lib/auth/tokens";
import Input from "@/components/reusable/Input";
import { Ionicons } from "@expo/vector-icons";

export default function Forgotpassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await getAuthEmail();
      if (saved) setEmail(saved);
    })();
  }, []);

  const onSubmit = async () => {
    if (!email) {
      Alert.alert("Forgot password", "Enter your email.");
      return;
    }
    setSubmitting(true);
    try {
      await forgotPassword(email);
      Alert.alert("OTP sent", "Check your email for the reset OTP.");
      router.push("/Auth/Resetpassword");
    } catch (e: any) {
      Alert.alert("Request failed", e?.response?.data?.message ?? "Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white dark:bg-[#0b0b10]`}>
      <View style={tw`flex-1 bg-white dark:bg-[#0b0b10] p-4`}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={tw`my-5`}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Forgot Password Header */}
        <Text style={tw`text-2xl font-bold mb-4 text-center text-black dark:text-gray-100`}>
          Forgot Password
        </Text>
        <Text style={tw`text-base mb-8 text-center text-gray-700 dark:text-gray-300`}>
          Please enter your registered email address to receive a verification
          code.
        </Text>

        {/* Input Fields */}
        <Input onChangeText={setEmail} value={email} label="Email" />

        {/* Submit Button */}
        <TouchableOpacity
          style={tw`w-full h-[47px] rounded-md flex items-center bg-[#264252] justify-center mt-12`}
          onPress={onSubmit}
          disabled={submitting}
        >
          <Text style={tw`text-white font-semibold`}>
            {submitting ? <ActivityIndicator color="white" /> : "Reset"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
