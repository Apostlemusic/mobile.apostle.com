import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { register } from "@/services/auth";
import Input from "@/components/reusable/Input";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!name || !email || !password) {
      Alert.alert("Sign up", "Please fill name, email and password.");
      return;
    }
    setSubmitting(true);
    try {
      await register({ name, phoneNumber, email, password });
      Alert.alert("Sign up", "Account created. Please verify your OTP.");
      router.push("/Auth/Verify");
    } catch (e: any) {
      Alert.alert("Sign up failed", e?.response?.data?.message ?? "Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white dark:bg-[#0b0b10]`}>
      <View style={tw`flex-1 bg-white dark:bg-[#0b0b10] p-4 pt-[20%]`}>
        {/* Create Account Header */}
        <Text style={tw`text-6xl leading-normal text-[#373737] dark:text-gray-100 font-bold mb-6`}>
          Create Account
        </Text>

        {/* Input Fields */}
        <Input label="Name" value={name} onChangeText={setName} />
        <Input label="Email" value={email} onChangeText={setEmail} />
        <Input
          label="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={tw`w-full h-[47px] rounded-md flex items-center justify-center mt-12 ${
            submitting ? "bg-gray-500 dark:bg-gray-600" : "bg-[#264252]"
          }`}
          onPress={onSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={tw`text-white text-lg`}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Navigate to SignIn */}
        <Pressable onPress={() => router.push("/Auth/Signin")}>
          <Text style={tw`text-[#000000] dark:text-gray-100 underline mt-4`}>Sign In</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
