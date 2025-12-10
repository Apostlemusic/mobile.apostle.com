import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/reusable/Input";
import ArrowButton from "@/components/reusable/Button";
import { Link, router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ResetPassword = () => {
  const [otp, setOtp] = useState<string>(""); // State for OTP
  const [password, setPassword] = useState<string>(""); // State for password
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // State for confirm password

  // Retrieve OTP from AsyncStorage when the component mounts
  useEffect(() => {
    const getOtp = async () => {
      try {
        const storedOtp = await AsyncStorage.getItem("OTP");
        if (storedOtp) {
          setOtp(storedOtp); // Set the OTP if it exists
        } else {
          Alert.alert("Error", "OTP not found. Please request a new OTP.");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to retrieve OTP.");
      }
    };

    getOtp();
  }, []);

  // Handle password reset
  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Validation Error", "Please fill in both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "https://apostle.onrender.com/api/auth/resetPassword",
        {
          otp,
          password,
        }
      );

      Alert.alert("Password Reset Successful", "Your password has been reset.");
      router.push("/Auth/Signin"); // Navigate to Sign In after successful reset
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <View style={tw`flex-1 bg-white p-4 pt-[10%]`}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={tw`mb-6`}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Reset Password Header */}
      <Text style={tw`text-2xl font-bold mb-4`}>Reset Password</Text>
      <Text style={tw` text-base mb-8`}>Please enter your new password.</Text>

      {/* Input Fields */}
      <Input
        label="Password"
        secureTextEntry={true}
        onChangeText={setPassword} // Set the password state
        value={password}
      />
      <Input
        label="Confirm Password"
        secureTextEntry={true}
        onChangeText={setConfirmPassword} // Set the confirm password state
        value={confirmPassword}
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={tw`w-full h-[47px] rounded-md flex items-center bg-[#264252] justify-center mt-12`}
        onPress={handleResetPassword}
      >
        <Text style={tw`text-white text-lg`}>Reset Password</Text>
      </TouchableOpacity>

      {/* Sign In Link */}
      <View style={tw`w-full flex flex-row items-center justify-between mt-4 `}>
        <Link href="/Auth/Signin" style={tw`text-blue-500 underline mt-4`}>
          Sign In
        </Link>
      </View>
    </View>
  );
};

export default ResetPassword;
