import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { Audio } from "expo-av";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { getPlaylistById, removeTrackFromPlaylist } from "@/services/content";

const PlaylistPage = () => {
  const { id } = useGlobalSearchParams(); // Get the playlist ID from the route
  const router = useRouter();
  const [playlist, setPlaylist] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const fetchPlaylist = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const playlistId = Array.isArray(id) ? id[0] : (id as string);
      const data = await getPlaylistById(playlistId);

      // Try common shapes
      const p = data?.playlist ?? data?.data ?? data;
      setPlaylist(p);
    } catch (error) {
      console.error("Error fetching playlist:", error);
      setError("Failed to load playlist. Please try again.");
      router.push("/Auth/Signin");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const removeTrack = async (trackId: string) => {
    try {
      const playlistId = Array.isArray(id) ? id[0] : (id as string);
      await removeTrackFromPlaylist({ playlistId, trackId });

      setPlaylist((prevPlaylist: any) => ({
        ...prevPlaylist,
        tracks: prevPlaylist.tracks.filter((track: any) => track.trackId !== trackId),
      }));
    } catch (error: any) {
      console.error("Error removing track:", error);
    }
  };

  const playPauseSong = async (song: any) => {
    if (playingTrackId === song.trackId) {
      // Pause if already playing
      if (currentSound) {
        await currentSound.pauseAsync();
        setPlayingTrackId(null);
      }
    } else {
      // Stop the current sound if playing
      if (currentSound) {
        await currentSound.unloadAsync();
        setCurrentSound(null);
      }
      try {
        // Use trackUrl for playback, fallback to previewUrl if missing
        const playbackUrl = song.trackUrl || song.previewUrl;
        if (!playbackUrl) {
          console.warn('No trackUrl or previewUrl available for this song:', song);
          return;
        }
        const { sound } = await Audio.Sound.createAsync(
          { uri: playbackUrl },
          { shouldPlay: true }
        );
        setCurrentSound(sound);
        setPlayingTrackId(song.trackId);

        sound.setOnPlaybackStatusUpdate((status: any) => {
          if (status.didJustFinish) {
            setPlayingTrackId(null); // Reset state when the track finishes
            setCurrentSound(null);
          }
        });
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchPlaylist();
  };

  useEffect(() => {
    if (id) {
      fetchPlaylist();
    }
  }, [id]);

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-50 dark:bg-[#0b0b10]`}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-50 dark:bg-[#0b0b10]`}>
        <Text style={tw`text-lg text-red-500 mb-4`}>{error}</Text>
        <TouchableOpacity
          style={tw`bg-blue-500 px-4 py-2 rounded-lg`}
          onPress={fetchPlaylist}
        >
          <Text style={tw`text-white text-lg`}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!playlist) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-50 dark:bg-[#0b0b10]`}>
        <Text style={tw`text-lg text-gray-600 dark:text-gray-300`}>Playlist not found</Text>
      </View>
    );
  }

  const renderRightActions = (trackId: string) => (
    <TouchableOpacity
      onPress={() => removeTrack(trackId)}
      style={tw`w-28 bg-red-500 justify-center items-center rounded-r-lg`}
    >
      <Text style={tw`text-white text-sm`}>Remove</Text>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-gray-50 dark:bg-[#0b0b10]`}>
      {/* Header Section */}
      <View style={tw`flex-row items-center p-4 bg-white dark:bg-[#14141b] shadow-sm`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`p-2`}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text
          style={tw`text-xl font-medium text-center right-1/2 capitalize ml-4 flex-1 text-black dark:text-gray-100`}
        >
          {playlist.name}
        </Text>
      </View>

      {/* Playlist Content */}
      <ScrollView
        contentContainerStyle={tw`px-4 mb-6`}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {/* Songs List */}
        {playlist.tracks.length > 0 ? (
          playlist.tracks.map((song: any) => (
            <GestureHandlerRootView key={song.trackId}>
              <Swipeable
                renderRightActions={() => renderRightActions(song.trackId)}
              >
                <Pressable
                  onPress={() => playPauseSong(song)}
                  style={tw`flex-row items-center p-4 bg-white dark:bg-[#14141b] rounded-lg shadow-sm my-2`}
                >
                  <Image
                    source={{ uri: song.trackImg || "https://via.placeholder.com/150" }}
                    style={tw`w-12 h-12 rounded-lg mr-3`}
                    resizeMode="cover"
                  />
                  <View style={tw`flex-1`}>
                    <Text style={tw`font-medium text-lg text-black dark:text-gray-100`}>
                      {song.title || "Unknown Title"}
                    </Text>
                    <Text style={tw`text-sm text-gray-600 dark:text-gray-400`}>
                      {song.author || "Unknown Artist"}
                    </Text>
                  </View>
                  <Ionicons
                    name={playingTrackId === song.trackId ? "pause" : "play"}
                    size={24}
                    color="#0081C9"
                  />
                </Pressable>
              </Swipeable>
            </GestureHandlerRootView>
          ))
        ) : (
          <Text style={tw`text-gray-500 dark:text-gray-400 text-center`}>No songs available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default PlaylistPage;

