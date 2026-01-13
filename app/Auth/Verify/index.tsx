import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { getAuthEmail } from "@/lib/auth/tokens";
import { resendOtp, verifyOtp } from "@/services/auth";

export default function Verify() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const saved = await getAuthEmail();
      if (mounted && saved) setEmail(saved);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // manage countdown timer for resend
  useEffect(() => {
    if (remainingTime <= 0) {
      setCanResend(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    setCanResend(false);
  }, [remainingTime]);

  useEffect(() => {
    if (remainingTime > 0 && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setRemainingTime((t) => {
          if (t <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current && remainingTime <= 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [remainingTime]);

  const handleChange = (index: number, text: string) => {
    const digit = text.replace(/[^0-9]/g, "").slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < newOtp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (!email || code.length !== otp.length) {
      Alert.alert("Verify", "Please enter email and complete OTP.");
      return;
    }

    setSubmitting(true);
    try {
      await verifyOtp(email, code);
      Alert.alert("Verified", "OTP verified successfully.");
      router.replace("/tabs/Home");
    } catch (e: any) {
      Alert.alert(
        "Verification failed",
        e?.response?.data?.message ?? "Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      Alert.alert("Resend OTP", "Enter email first.");
      return;
    }

    try {
      await resendOtp(email);
      Alert.alert("OTP sent", "Check your email.");
      setRemainingTime(60);
      setCanResend(false);
    } catch (e: any) {
      Alert.alert("Resend failed", e?.response?.data?.message ?? "Try again.");
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
      >
        <View style={tw`flex-1 items-center justify-start bg-white px-4 py-10`}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={tw`absolute top-4 left-4 p-2 rounded-full bg-gray-200`}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Text style={tw`text-2xl font-bold mb-4`}>Verify Email</Text>
          <Text style={tw`text-base mb-8 text-center px-4`}>
            Enter the 4-digit code sent to your email
          </Text>

          <View style={tw`flex-row justify-between mb-6 w-6/7`}>
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={tw`border ${
                  value ? "border-blue-500 bg-blue-50" : "border-gray-300"
                } rounded-full text-center w-14 h-14 text-xl font-bold pb-2 pr-1`}
                keyboardType="numeric"
                maxLength={1}
                value={value}
                onChangeText={(text) => handleChange(index, text)}
                selectTextOnFocus
                autoCorrect={false}
              />
            ))}
          </View>

          <View style={tw`w-full flex items-end mt-6 px-4`}>
            <TouchableOpacity
              style={tw`w-full h-[47px] rounded-md flex items-center justify-center mt-12 ${
                submitting ? "bg-gray-500" : "bg-[#264252]"
              }`}
              disabled={submitting || otp.some((val) => val === "")}
              onPress={handleVerifyOtp}
            >
              <Text style={tw`text-white text-lg`}>
                {submitting ? <ActivityIndicator color="#fff" /> : "Verify"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={tw`w-3/4 py-2 rounded-md mt-4`}
            onPress={handleResendOtp}
            disabled={submitting || !canResend}
          >
            <Text style={tw`text-center text-black text-base`}>
              {submitting
                ? "Processing..."
                : !canResend
                ? `Resend in ${remainingTime}s`
                : "Resend Code"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
