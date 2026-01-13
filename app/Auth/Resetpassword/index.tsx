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
import { resetPassword } from "@/services/auth";
import { getAuthEmail } from "@/lib/auth/tokens";

export default function Resetpassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await getAuthEmail();
      if (saved) setEmail(saved);
    })();
  }, []);

  const onSubmit = async () => {
    if (!email || !otp || !newPassword) {
      Alert.alert("Reset password", "Fill email, OTP and new password.");
      return;
    }
    setSubmitting(true);
    try {
      await resetPassword(email, otp, newPassword);
      Alert.alert("Success", "Password reset. Please sign in.");
      router.replace("/Auth/Signin");
    } catch (e: any) {
      Alert.alert("Reset failed", e?.response?.data?.message ?? "Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`flex-1 bg-white px-5 pt-16`}>
        <Text style={tw`text-2xl font-bold mb-6`}>Reset password</Text>

        <Text style={tw`text-gray-600 mb-2`}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={tw`border border-gray-200 rounded-xl px-4 py-3 mb-4`}
          placeholder="you@example.com"
        />

        <Text style={tw`text-gray-600 mb-2`}>OTP</Text>
        <TextInput
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          style={tw`border border-gray-200 rounded-xl px-4 py-3 mb-4`}
          placeholder="123456"
        />

        <Text style={tw`text-gray-600 mb-2`}>New password</Text>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          style={tw`border border-gray-200 rounded-xl px-4 py-3 mb-6`}
          placeholder="New password"
        />

        <TouchableOpacity
          onPress={onSubmit}
          disabled={submitting}
          style={tw`bg-[#0081C9] rounded-xl py-3 items-center`}
        >
          <Text style={tw`text-white font-semibold`}>
            {submitting ? "Resetting..." : "Reset"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
