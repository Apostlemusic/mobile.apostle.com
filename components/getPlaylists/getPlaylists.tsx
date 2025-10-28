import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { useFetchSongs } from "@/hooks/useFetchSongs";
import { useAudio } from "@/contexts/AudioContext";
import MusicPlayer from "@/components/musicPlayer/MusicPlayer";

// Quick Picks
export const GetQuickPicks = ({ text }: { text: any }) => {
  const { songs, error, loading } = useFetchSongs(
    "https://apostle.onrender.com/api/song/getQuickPicks"
  );
  const { playPauseSong, playingTrackId } = useAudio();

  return (
    <View style={tw`px-4 mb-6`}>
      <Text style={tw`text-lg font-bold mb-3`}>{text}</Text>
      <View style={tw`gap-y-2`}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0081C9"
            style={tw`self-center`}
          />
        ) : error ? (
          <Text style={tw`text-red-500 text-center`}>{error}</Text>
        ) : songs.length > 0 ? (
          songs.map((song) => (
            <Pressable
              key={song.trackId}
              onPress={() => playPauseSong(song)}
              style={tw`flex-row items-center p-2 bg-white rounded-lg shadow-sm`}
            >
              <Image
                source={{ uri: song.trackImg }}
                style={tw`w-12 h-12 rounded mr-3`}
                resizeMode="cover"
              />
              <View style={tw`flex-1`}>
                <Text style={tw`font-medium`}>
                  {song.title || "Unknown Title"}
                </Text>
                <Text style={tw`text-sm text-gray-600`}>
                  {song.author || "Unknown Artist"}
                </Text>
              </View>
              {/* <Ionicons
                name={playingTrackId === song.trackId ? "pause" : "play"}
                size={24}
                color="#0081C9"
              /> */}
            </Pressable> 
          ))
        ) : (
          <Text style={tw`text-gray-500 text-center`}>No songs available.</Text>
        )}
      </View>
    </View>
  );
};

// Get Recently Played
export const GetRecentlyPlays = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { playPauseSong, setCurrentSong, playingTrackId } = useAudio();
  const { songs, error, loading } = useFetchSongs(
    "https://apostle.onrender.com/api/song/getRecentPlays"
  );

  const handleSongClick = (song: any) => {
    setCurrentSong(song); // Update the global selected song
    setIsDrawerOpen(true);
  };

  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 24, marginTop: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
        Recently Played
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0081C9" />
      ) : error ? (
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      ) : songs.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {songs.map((song) => (
            <TouchableOpacity
              key={song.trackId}
              onPress={() => handleSongClick(song)}
            >
              <View style={{ marginRight: 16 }}>
                <Image
                  source={{ uri: song.trackImg }}
                  style={{
                    width: 128,
                    height: 128,
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                  resizeMode="cover"
                />
                <Text style={{ fontSize: 14, fontWeight: "500" }}>
                  {song.title || "Unknown Title"}
                </Text>
                <Text style={{ fontSize: 12, color: "#6b7280" }}>
                  {song.author || "Unknown Artist"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text style={{ color: "#9ca3af", textAlign: "center" }}>
          No songs available.
        </Text>
      )}
      {isDrawerOpen && (
        <MusicPlayer closeDrawer={() => setIsDrawerOpen(false)} />
      )}
    </View>
  );
};

// Podcasts Component
export const GetPodcasts = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { setCurrentSong } = useAudio();
  const { songs, error, loading } = useFetchSongs(
    "https://apostle.onrender.com/api/song/getAllSongs"
  );

  const handleSongClick = (song: any) => {
    setCurrentSong(song); // Update the global selected song
    setIsDrawerOpen(true);
  };

  return (
    <View style={tw`px-4 mb-6 mt-4`}>
      <Text style={tw`text-lg font-bold mb-3`}>Podcasts</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0081C9" />
      ) : error ? (
        <Text style={tw`text-red-500 text-center`}>{error}</Text>
      ) : songs.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {songs.map((song) => (
            <TouchableOpacity
              key={song.trackId}
              onPress={() => handleSongClick(song)}
            >
              <View style={tw`mr-4`}>
                <Image
                  source={{
                    uri: song.trackImg || "https://via.placeholder.com/150",
                  }}
                  style={tw`w-32 h-32 rounded-lg mb-2`}
                  resizeMode="cover"
                />
                <Text style={tw`text-sm font-medium`}>
                  {song.title || "Unknown Title"}
                </Text>
                <Text style={tw`text-xs text-gray-600`}>
                  {song.author || "Unknown Artist"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text style={tw`text-gray-500 text-center`}>
          No podcasts available.
        </Text>
      )}

      {isDrawerOpen && (
        <MusicPlayer closeDrawer={() => setIsDrawerOpen(false)} />
      )}
    </View>
  );
};

// New Release Component
export const GetNewReleases = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { setCurrentSong } = useAudio();
  const { songs, error, loading } = useFetchSongs(
    "https://apostle.onrender.com/api/song/getNewRelease"
  );

  const handleSongClick = (song: any) => {
    setCurrentSong(song); // Update the global selected song
    setIsDrawerOpen(true);
  };

  return (
    <View style={tw`px-4 mb-6`}>
      <Text style={tw`text-lg font-bold mb-3`}>New Releases</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0081C9" />
      ) : error ? (
        <Text style={tw`text-red-500 text-center`}>{error}</Text>
      ) : songs.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {songs.map((song) => (
            <TouchableOpacity
              key={song.trackId}
              onPress={() => handleSongClick(song)}
            >
              <View style={tw`mr-4`}>
                <Image
                  source={{ uri: song.trackImg }}
                  style={tw`w-32 h-32 rounded-lg mb-2`}
                  resizeMode="cover"
                />
                <Text style={tw`text-sm font-medium`}>
                  {song.title || "Unknown Title"}
                </Text>
                <Text style={tw`text-xs text-gray-600`}>
                  {song.author || "Unknown Artist"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text style={tw`text-gray-500 text-center`}>No songs available.</Text>
      )}

      {isDrawerOpen && (
        <MusicPlayer closeDrawer={() => setIsDrawerOpen(false)} />
      )}
    </View>
  );
};

// Trending Component
export const GetTrending = ({ text }: { text: string }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { setCurrentSong } = useAudio();
  const { songs, error, loading } = useFetchSongs(
    "https://apostle.onrender.com/api/song/getRecommended"
  );

  const handleSongClick = (song: any) => {
    setCurrentSong(song); // Update the global selected song
    setIsDrawerOpen(true);
  };

  return (
    <View style={tw`px-3 mb-6`}>
      <Text style={tw`text-lg font-bold mb-3`}>{text}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0081C9" />
      ) : error ? (
        <Text style={tw`text-red-500 text-center`}>{error}</Text>
      ) : songs.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {songs.map((song) => (
            <TouchableOpacity
              key={song.trackId}
              onPress={() => handleSongClick(song)}
            >
              <View style={tw`mr-4`}>
                <Image
                  source={{ uri: song.trackImg }}
                  style={tw`w-32 h-32 rounded-lg mb-2`}
                  resizeMode="cover"
                />
                <Text style={tw`text-sm font-medium`}>
                  {song.title || "Unknown Title"}
                </Text>
                <Text style={tw`text-xs text-gray-600`}>
                  {song.author || "Unknown Artist"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text style={tw`text-gray-500 text-center`}>No songs available.</Text>
      )}

      {isDrawerOpen && (
        <MusicPlayer closeDrawer={() => setIsDrawerOpen(false)} />
      )}
    </View>
  );
};


// Categories Component
export const GetCategories = () => {
  const {
    songs: categories,
    error,
    loading,
  } = useFetchSongs("https://apostle.onrender.com/api/category/getAllCategory");

  return (
    <View style={tw`px-4 mb-6 mt-4`}>
      {loading ? (
        <ActivityIndicator size="large" color="#0081C9" />
      ) : error ? (
        <Text style={tw`text-red-500 text-center`}>{error}</Text>
      ) : categories && categories.length > 0 ? (
        <ScrollView contentContainerStyle={styles.gridContainer}>
          {categories.map((category: any, index: number) => {
            const backgroundColor = "#e0e0e0";
            const imageUrl = category.imageUrl || fallbackImages[index % fallbackImages.length];
            return (
              <View
                key={category.slug}
                style={[styles.gridItem, { backgroundColor }]}
              >
                <Image
                  source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
                  style={styles.image}
                  resizeMode="cover"
                />
                <Text style={styles.text}>{category.name}</Text>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <Text style={tw`text-gray-500 text-center`}>
          No categories available.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  text: {
    color: "#ffff",
    fontSize: 16,
    fontWeight: "medium",
    marginTop: 7,
    marginLeft: 10,
    zIndex: 1,
  },
});