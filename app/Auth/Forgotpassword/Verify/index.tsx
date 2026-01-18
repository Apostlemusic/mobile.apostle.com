import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { resendOtp, verifyOtp } from "@/services/auth";
import { getAuthEmail } from "@/lib/auth/tokens";

export default function ForgotVerify() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await getAuthEmail();
      if (saved) setEmail(saved);
    })();
  }, []);

  const onVerify = async () => {
    if (!email || !otp) return Alert.alert("Verify", "Enter email and OTP.");
    setSubmitting(true);
    try {
      await verifyOtp(email, otp);
      router.replace("/Auth/Resetpassword");
    } catch (e: any) {
      Alert.alert(
        "Verification failed",
        e?.response?.data?.message ?? "Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    if (!email) return Alert.alert("Resend", "Enter email.");
    try {
      await resendOtp(email);
      Alert.alert("Sent", "OTP resent.");
    } catch (e: any) {
      Alert.alert("Failed", e?.response?.data?.message ?? "Try again.");
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white dark:bg-[#0b0b10]`}>
      <View style={tw`flex-1 bg-white dark:bg-[#0b0b10] px-5 pt-16`}>
        <Text style={tw`text-2xl font-bold mb-6 text-black dark:text-gray-100`}>Verify OTP</Text>

        <Text style={tw`text-gray-600 dark:text-gray-400 mb-2`}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={tw`border border-gray-200 dark:border-[#2d2d35] rounded-xl px-4 py-3 mb-4 text-black dark:text-gray-100`}
        />

        <Text style={tw`text-gray-600 dark:text-gray-400 mb-2`}>OTP</Text>
        <TextInput
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          style={tw`border border-gray-200 dark:border-[#2d2d35] rounded-xl px-4 py-3 mb-6 text-black dark:text-gray-100`}
        />

        <TouchableOpacity
          onPress={onVerify}
          disabled={submitting}
          style={tw`bg-[#0081C9] rounded-xl py-3 items-center`}
        >
          <Text style={tw`text-white font-semibold`}>
            {submitting ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onResend} style={tw`mt-4`}>
          <Text style={tw`text-[#0081C9] text-center`}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
