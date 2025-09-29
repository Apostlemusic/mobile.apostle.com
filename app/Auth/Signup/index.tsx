import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Pressable } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/reusable/Input";
import ArrowButton from "@/components/reusable/Button";
import axios from "axios";
import { router } from "expo-router";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://apostle.onrender.com/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Account created successfully!");
        router.push("/Auth/Verify");
      }
    } catch (error: any) {
      Alert.alert(
        "Sign Up Failed",
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-white p-4 pt-[20%]`}>
      {/* Create Account Header */}
      <Text style={tw`text-6xl leading-normal text-[#373737] font-bold mb-6`}>Create Account</Text>

      {/* Input Fields */}
      <Input label="Name" value={name} onChangeText={(text) => setName(text)} />
      <Input
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Input
        label="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      {/* Sign Up Button */}
      <TouchableOpacity
        style={tw`w-full h-[47px] rounded-md flex items-center bg-[#264252] justify-center mt-12`}
        onPress={handleSignUp}
      >
        <Text style={tw`text-white text-lg`}>Sign In</Text>
      </TouchableOpacity>

      {/* Navigate to SignIn */}
      <Pressable onPress={() => router.push("/Auth/Signin")}>
        <Text style={tw`text-[#000000] underline mt-4`}>Sign Up</Text>
      </Pressable>
    </View>
  );
};

export default SignUp;
