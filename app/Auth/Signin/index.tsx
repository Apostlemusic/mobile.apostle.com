import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "@/services/auth";
import Input from "@/components/reusable/Input";

export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const persistAuth = async (json: any) => {
    const userId = json?.user?.id;
    const accessToken = json?.accessToken;
    const refreshToken = json?.refreshToken;

    if (!userId) throw new Error("Missing user.id in login response");

    await AsyncStorage.multiSet([
      ["userId", String(userId)],
      ["apostle.userId", String(userId)],

      ["accessToken", String(accessToken ?? "")],
      ["apostle.accessToken", String(accessToken ?? "")],
      ["apostle.token", String(accessToken ?? "")],

      ["refreshToken", String(refreshToken ?? "")],
      ["apostle.refreshToken", String(refreshToken ?? "")],
    ]);
  };

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Sign in", "Please enter email and password.");
      return;
    }

    setSubmitting(true);
    try {
      setLoading(true);

      const json = await login({ email: email.trim(), password });

      if (!json?.success) {
        throw new Error(json?.message ?? "Login failed");
      }

      await persistAuth(json);
      router.replace("/tabs/Home");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Please try again.";
      Alert.alert("Login failed", msg);
      console.log("Login error:", e?.response?.data ?? e);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`flex-1 bg-white p-4 pt-[10%]`}>
        <Text style={tw`text-6xl text-[#373737] leading-normal font-bold mb-6 mt-7`}>
          Welcome Back
        </Text>

        <Input label="Email" value={email} onChangeText={setEmail} />
        <Input
          label="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={tw`w-full h-[47px] rounded-md flex items-center justify-center mt-12 ${
            submitting ? "bg-gray-500" : "bg-[#264252]"
          }`}
          onPress={onLogin}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={tw`text-white text-lg`}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={tw`w-full flex flex-row items-center justify-between mt-4`}>
          <Link href={"/Auth/Signup"} style={tw`text-[#373737] underline mt-4`}>
            Sign Up
          </Link>

          <TouchableOpacity
            onPress={() => router.push("/Auth/Forgotpassword")}
            style={tw`mt-4`}
          >
            <Text style={tw`text-gray-700 text-center underline`}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
