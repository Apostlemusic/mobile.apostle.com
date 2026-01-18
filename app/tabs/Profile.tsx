import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Animated,
  Pressable,
  useWindowDimensions,
} from "react-native";
import Slider from "@react-native-community/slider";
import tw from "twrnc";
import { useRouter } from "expo-router";
import { logout } from "@/services/auth";
import { getMyProfile } from "@/services/users";
import { useTheme } from "@/contexts/ThemeContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, mode, toggleMode } = useTheme();
  const { width } = useWindowDimensions();
  const sidebarWidth = Math.min(320, Math.round(width * 0.82));
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [user, setUser] = useState<
    | {
        _id: string;
        name: string;
        email: string;
        phoneNumber?: string;
        role?: string;
        verified?: boolean;
        blocked?: boolean;
        createdAt?: string;
      }
    | null
  >(null);

  const [audioQuality, setAudioQuality] = useState("Automatic");
  const [mixValue, setMixValue] = useState(10);
  const [gapless, setGapless] = useState(true);
  const [volumeLeveler, setVolumeLeveler] = useState(false);

  const qualityOptions = ["Automatic", "Very High", "High", "Low"];

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        setProfileError(null);
        const data = await getMyProfile();
        if (!isMounted) return;
        setUser(data?.user ?? null);
      } catch (error) {
        if (!isMounted) return;
        setProfileError("Unable to load profile");
      } finally {
        if (!isMounted) return;
        setLoadingProfile(false);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: sidebarOpen ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [sidebarOpen, slideAnim]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/Auth/Signin");
    } catch (error) {
      console.log("Error during logout:", error);
      router.push("/Auth/Signin");
    }
  };

  const displayName = useMemo(() => user?.name || "User", [user?.name]);
  const displayEmail = useMemo(() => user?.email || "", [user?.email]);

  const displayPhone = useMemo(() => user?.phoneNumber || "", [user?.phoneNumber]);
  const displayRole = useMemo(() => user?.role || "user", [user?.role]);
  const displayVerified = useMemo(() => (user?.verified ? "Yes" : "No"), [user?.verified]);
  const displayBlocked = useMemo(() => (user?.blocked ? "Yes" : "No"), [user?.blocked]);
  const displayCreatedAt = useMemo(() => {
    if (!user?.createdAt) return "";
    const date = new Date(user.createdAt);
    return Number.isNaN(date.getTime()) ? user.createdAt : date.toDateString();
  }, [user?.createdAt]);

  const sidebarTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [sidebarWidth, 0],
  });

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          tw`flex-row justify-between items-center px-4 py-5 border-b`,
          { borderColor: colors.border },
        ]}
      >
        <View style={tw`flex-row items-center`}>
          <View
            style={[
              tw`w-12 h-12 rounded-full justify-center items-center mr-3`,
              { backgroundColor: colors.card },
            ]}
          >
            <Text style={tw`text-xl`}>👤</Text>
          </View>
          <View>
            <Text style={[tw`text-xl font-bold`, { color: colors.text }]}>
              {displayName}
            </Text>
            {!!displayEmail && (
              <Text style={[tw`text-gray-500`, { color: colors.subtext }]}>
                {displayEmail}
              </Text>
            )}
            {loadingProfile && (
              <View style={tw`flex-row items-center mt-1`}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[tw`text-gray-500 ml-2`, { color: colors.subtext }]}>
                  Loading profile...
                </Text>
              </View>
            )}
            {!!profileError && !loadingProfile && (
              <Text style={tw`text-red-500 mt-1`}>{profileError}</Text>
            )}
          </View>
        </View>

        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            onPress={() => setSidebarOpen(true)}
            style={[tw`rounded-md px-3 py-2`, { backgroundColor: colors.card }]}
          >
            <Text style={[tw`text-lg`, { color: colors.text }]}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Audio streaming quality */}
      <View style={[tw`px-5 py-6 border-b`, { borderColor: colors.border }]}>
        <Text style={[tw`text-lg font-bold mb-1`, { color: colors.text }]}>Audio streaming quality</Text>
        <Text style={[tw`text-gray-500 mb-4`, { color: colors.subtext }] }>
          Choose the best audio quality that best supports you
        </Text>

        {qualityOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={tw`flex-row justify-between items-center py-2 `}
            onPress={() => setAudioQuality(option)}
          >
            <Text style={[tw`text-base`, { color: colors.text }]}>{option}</Text>
            <View
              style={[
                tw`w-5 h-5 rounded-full border-2 flex justify-center items-center`,
                { borderColor: audioQuality === option ? colors.primary : colors.muted },
              ]}
            >
              {
                audioQuality === option ? (
                  <View style={[tw`w-3 h-3 rounded-full m-[3px]`, { backgroundColor: colors.primary }]} />
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
        <Text style={[tw`text-lg font-bold mb-1`, { color: colors.text }]}>Mix Song</Text>
        <Text style={[tw`text-gray-500 mb-4`, { color: colors.subtext }] }>
          Mix the playing track and next track together for a smooth playback
        </Text>

        <View style={tw`flex-row justify-between items-center`}>
          <Text style={[tw`text-base`, { color: colors.text }]}>10s</Text>
          <Slider
            style={tw`flex-1 mx-3`}
            minimumValue={10}
            maximumValue={15}
            value={mixValue}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
            onValueChange={setMixValue}
          />
          <Text style={[tw`text-base`, { color: colors.text }]}>15s</Text>
        </View>

        {/* Toggles */}
        <View style={tw`mt-8`}>
          <View style={tw`flex-row justify-between items-center mb-5`}>
            <Text style={[tw`text-base font-semibold`, { color: colors.text }]}>Gapless Playback</Text>
            <Switch
              value={gapless}
              onValueChange={setGapless}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={gapless ? "#fff" : colors.muted}
            />
          </View>

          <View style={tw`flex-row justify-between items-center`}>
            <Text style={[tw`text-base font-semibold`, { color: colors.text }]}>Volume Leveler</Text>
            <Switch
              value={volumeLeveler}
              onValueChange={setVolumeLeveler}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={volumeLeveler ? "#fff" : colors.muted}
            />
          </View>
        </View>
      </View>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <Pressable
          onPress={() => setSidebarOpen(false)}
          style={[tw`absolute inset-0`, { backgroundColor: colors.overlay }]}
        />
      )}

      {/* Sliding sidebar */}
      <Animated.View
        style={[
          tw`absolute top-0 bottom-0 right-0 shadow-xl`,
          {
            width: sidebarWidth,
            backgroundColor: colors.card,
            borderLeftWidth: 1,
            borderLeftColor: colors.border,
            transform: [{ translateX: sidebarTranslateX }],
          },
        ]}
      >
        <View style={tw`flex-1 px-5 py-6`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={[tw`text-lg font-bold`, { color: colors.text }]}>Profile details</Text>
            <TouchableOpacity
              onPress={() => setSidebarOpen(false)}
              style={[tw`rounded-full px-3 py-1`, { backgroundColor: colors.border }]}
            >
              <Text style={[tw`text-base`, { color: colors.text }]}>Close</Text>
            </TouchableOpacity>
          </View>

          <View style={[tw`rounded-xl p-4 mb-4`, { backgroundColor: colors.background }]}>
            <Text style={[tw`text-base font-semibold mb-2`, { color: colors.text }]}>Account</Text>
            <Text style={[tw`text-sm`, { color: colors.subtext }]}>Name</Text>
            <Text style={[tw`text-base mb-2`, { color: colors.text }]}>{displayName}</Text>

            <Text style={[tw`text-sm`, { color: colors.subtext }]}>Email</Text>
            <Text style={[tw`text-base mb-2`, { color: colors.text }]}>{displayEmail || "—"}</Text>

            <Text style={[tw`text-sm`, { color: colors.subtext }]}>Phone</Text>
            <Text style={[tw`text-base`, { color: colors.text }]}>{displayPhone || "—"}</Text>
          </View>

          <View style={[tw`rounded-xl p-4 mb-4`, { backgroundColor: colors.background }]}>
            <Text style={[tw`text-base font-semibold mb-2`, { color: colors.text }]}>Status</Text>
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={[tw`text-sm`, { color: colors.subtext }]}>Role</Text>
              <Text style={[tw`text-base`, { color: colors.text }]}>{displayRole}</Text>
            </View>
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={[tw`text-sm`, { color: colors.subtext }]}>Verified</Text>
              <Text style={[tw`text-base`, { color: colors.text }]}>{displayVerified}</Text>
            </View>
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={[tw`text-sm`, { color: colors.subtext }]}>Blocked</Text>
              <Text style={[tw`text-base`, { color: colors.text }]}>{displayBlocked}</Text>
            </View>
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={[tw`text-sm`, { color: colors.subtext }]}>Member since</Text>
              <Text style={[tw`text-base`, { color: colors.text }]}>{displayCreatedAt || "—"}</Text>
            </View>
          </View>

          <View style={[tw`rounded-xl p-4`, { backgroundColor: colors.background }]}>
            <Text style={[tw`text-base font-semibold mb-3`, { color: colors.text }]}>Appearance</Text>
            <View style={tw`flex-row justify-between items-center`}>
              <View>
                <Text style={[tw`text-base`, { color: colors.text }]}>Dark mode</Text>
                <Text style={[tw`text-sm`, { color: colors.subtext }]}>Toggle light or dark</Text>
              </View>
              <Switch
                value={mode === "dark"}
                onValueChange={toggleMode}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={mode === "dark" ? "#fff" : colors.muted}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            style={[tw`mt-6 rounded-lg px-4 py-3`, { backgroundColor: colors.muted }]}
          >
            <Text style={tw`text-white font-semibold text-center`}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
