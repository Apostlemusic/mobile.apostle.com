import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

const AddToPlaylistModal = ({
  isVisible,
  onClose,
  trackId,
}: {
  isVisible: boolean;
  onClose: () => void;
  trackId: string;
}) => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState<{ _id: string; name: string } | null>(null);
  const [adding, setAdding] = useState(false);

  // Fetch the user's playlists
  const fetchPlaylists = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://apostle.onrender.com/api/playlist/getUserAllPlayList",
        { withCredentials: true }
      );
      const list = response.data?.data ?? [];
      setPlaylists(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch playlists when modal opens
  useEffect(() => {
    if (isVisible) {
      fetchPlaylists();
    } else {
      setPlaylists([]);
      setSelectedPlaylist(null);
      setAdding(false);
    }
  }, [isVisible]);

  // Handle adding a track to a playlist
  const handleAddToPlaylist = async () => {
    if (!selectedPlaylist?._id || !trackId) {
      return;
    }

    try {
      setAdding(true);
      const response = await axios.post(
        "https://apostle.onrender.com/api/playlist/addToPlayList",
        { _id: selectedPlaylist._id, trackId },
        { withCredentials: true }
      );
      console.log("Track added:", response.data);
      onClose();
    } catch (error: any) {
      console.error("Error adding track to playlist:", error?.response?.data ?? error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 justify-end bg-black/50`}>
        <View style={tw`bg-white rounded-t-3xl p-5`}>
          {/* Header */}
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-xl font-extrabold`}>Add to Playlist</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Subheader */}
          <Text style={tw`text-gray-600 mt-1`}>Choose a playlist to add this track</Text>

          {/* Loading Indicator */}
          {isLoading ? (
            <View style={tw`py-8 items-center`}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={tw`text-gray-500 mt-3`}>Loading playlists…</Text>
            </View>
          ) : playlists.length === 0 ? (
            <View style={tw`py-10 items-center`}>
              <Text style={tw`text-gray-500`}>No playlists available.</Text>
            </View>
          ) : (
            <View style={tw`mt-4`}>
              <FlatList
                data={playlists}
                keyExtractor={(item) => item._id}
                ItemSeparatorComponent={() => <View style={tw`h-[1px] bg-gray-200`} />}
                renderItem={({ item }) => {
                  const selected = selectedPlaylist?._id === item._id;
                  return (
                    <TouchableOpacity
                      style={tw`py-3 px-2 flex-row justify-between items-center`}
                      onPress={() => setSelectedPlaylist({ _id: item._id, name: item.name })}
                    >
                      <View style={tw`flex-1`}>
                        <Text style={tw`text-[16px] font-semibold`} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={tw`text-xs text-gray-500 mt-1`}>
                          {item.tracks?.length || 0} songs
                        </Text>
                      </View>
                      <Ionicons
                        name={selected ? "radio-button-on" : "radio-button-off"}
                        size={22}
                        color={selected ? "#007AFF" : "#999"}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}

          {/* Footer actions */}
          <View style={tw`mt-5 flex-row`}>
            <TouchableOpacity
              style={tw`flex-1 bg-gray-200 p-3 rounded-xl mr-3`}
              onPress={onClose}
              disabled={adding}
            >
              <Text style={tw`text-center text-gray-700 font-semibold`}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                tw`flex-1 p-3 rounded-xl`,
                selectedPlaylist ? tw`bg-blue-500` : tw`bg-blue-300`,
              ]}
              onPress={handleAddToPlaylist}
              disabled={!selectedPlaylist || adding}
            >
              <Text style={tw`text-center text-white font-semibold`}>
                {adding ? "Adding…" : selectedPlaylist ? `Add to ${selectedPlaylist.name}` : "Select a playlist"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddToPlaylistModal;