import React, { useState } from "react";
import { Pressable, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import tw from "twrnc";
import { usePlayer } from "../player/PlayerContext";

const LikeToggle = ({ trackId, initialLiked = false, onLikeChange }: any) => {
  const [isLiked, setIsLiked] = useState(initialLiked); // Manage like state
  const [loading, setLoading] = useState(false); // Manage loading state
  const [error, setError] = useState(null); // Manage errors
  const { playById } = usePlayer();

  const handleLikeToggle = async () => {
    if (loading) return; // Prevent multiple API calls

    setLoading(true);
    setError(null);

    try {
      // Optimistic update
      setIsLiked((prev: any) => !prev);

      // API call
      const response = await axios.post(
        "https://apostle.onrender.com/api/song/handleLike",
        { trackId },
        {
          withCredentials: true, // Send cookies
        }
      );

      if (!response.data.success) {
        throw new Error("Failed to toggle like status.");
      }

      // Notify parent component if needed
      if (onLikeChange) {
        onLikeChange(response.data.success);
      }

      // Update state with API response
      setIsLiked(response.data.liked);
    } catch (err: any) {
      // Revert optimistic update on error
      setIsLiked((prev: any) => !prev);
      setError(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable onPress={handleLikeToggle} style={tw`mr-4`}>
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <FontAwesome
          name={isLiked ? "heart-o" : "heart"} // Toggled icons
          size={27}
          color={"white"} // Toggled colors
        />
      )}
    </Pressable>
  );
};

export default LikeToggle;
