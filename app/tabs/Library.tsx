import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
} from "react-native";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Topbar from "@/components/reusable/Topbar";
import NavigationBar from "@/components/reusable/Navbar";
import Tab from "@/components/playlist/Tab";
import PlaylistCard from "@/components/playlist/PlaylistCard";
import AddPlaylistModal from "@/components/playlist/AddPlaylistModal";
import EmptyPlaylists from "@/components/playlist/EmptyPlaylists";
import EmptyDownloads from "@/components/playlist/EmptyDownloads";
import { baseUrl } from "@/constants";
import { Playlist } from "@/constants/Types";
import { Ionicons } from "@expo/vector-icons";

const PlaylistManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"playlists" | "downloads">(
    "playlists"
  );
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [downloads, setDownloads] = useState<Playlist[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddPlaylistModalVisible, setIsAddPlaylistModalVisible] =
    useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  // Fetch userId from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          console.warn("User ID not found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  // Fetch playlists when userId is available
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://apostle.onrender.com/api/playlist/getUserAllPlayList`,
          { withCredentials: true }
        );
        setPlaylists(response.data.data); // Assuming `response.data.data` holds the playlists
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const refresh = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://apostle.onrender.com/api/playlist/getUserAllPlayList`,
        { withCredentials: true }
      );
      setPlaylists(response.data.data); // Assuming `data` contains playlists
    } catch (error) {
      console.error("Error refreshing playlists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredDownloads = downloads.filter((download) =>
    download.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPlaylistButton = () => {
    setIsAddPlaylistModalVisible(true);
  };

  return (
    <>
      {/* <Topbar /> */}
      <FlatList
        data={activeTab === "playlists" ? filteredPlaylists : filteredDownloads}
        renderItem={({ item }) => (
          <PlaylistCard item={item} refresh={refresh} />
        )}
        keyExtractor={(item: any) => item._id.toString()} // Ensure `_id` is unique and stringified
        ListHeaderComponent={
          <>
            <View style={tw`flex-row items-center mx-4 my-4`}>
             <Text style={tw`text-[30px] font-semibold`}>
              Your Library
             </Text>
            </View>
            <View style={tw`flex-row px-3 mb-4`}>
              <Tab
                isActive={activeTab === "playlists"}
                label="Playlists"
                onPress={() => setActiveTab("playlists")}
              />
              <Tab
                isActive={activeTab === "downloads"}
                label="Downloads"
                onPress={() => setActiveTab("downloads")}
              />
            </View>
          </>
        }
        ListEmptyComponent={
          activeTab === "playlists" ? (
            <EmptyPlaylists onCreatePlaylist={handleAddPlaylistButton} />
          ) : (
            <EmptyDownloads />
          )
        }
        contentContainerStyle={tw`flex-grow pb-[50%]`} // Ensures proper layout and padding
        showsVerticalScrollIndicator={false} // Optional: Hides the vertical scrollbar
      />

      <AddPlaylistModal
        visible={isAddPlaylistModalVisible}
        onClose={() => {
          setIsAddPlaylistModalVisible(false);
          refresh();
        }}
        playlists={playlists}
        setPlaylists={setPlaylists}
      />
    </>
  );
};

export default PlaylistManager;