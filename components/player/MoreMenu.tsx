import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  Alert,
} from "react-native";
import tw from "twrnc";
import { useAudio } from "@/contexts/AudioContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getLikedSongs, likeUnlikeSong, onLikedUpdated, isLikedByMeFromLikesArray, getSongById } from "@/services/content";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MoreMenuProps {
  visible: boolean;
  onClose: () => void;
  onShowQueue: () => void;
  onShowDetails?: () => void;
  onShowAddToPlaylist?: () => void;
}

export const MoreMenu: React.FC<MoreMenuProps> = ({
  visible,
  onClose,
  onShowQueue,
  onShowDetails,
  onShowAddToPlaylist,
}) => {
  const { currentSong, addToQueue } = useAudio();

  const [liking, setLiking] = useState(false);
  const [loadingLikeState, setLoadingLikeState] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Resolved Mongo _id used by like/unlike
  const [resolvedSongId, setResolvedSongId] = useState<string>("");

  // Resolve the song's Mongo _id with hydration fallback
  useEffect(() => {
    const resolve = async () => {
      const candidates = [
        (currentSong as any)?._id,
        (currentSong as any)?.id,
        (currentSong as any)?.songId,
        (currentSong as any)?.trackId,
        (currentSong as any)?.tracksId,
      ].filter(Boolean);

      if (candidates.length > 0) {
        const first = String(candidates[0]);
        setResolvedSongId(first);
        return;
      }

      const fetchable =
        (currentSong as any)?.id ||
        (currentSong as any)?.trackId ||
        (currentSong as any)?.tracksId;

      if (!fetchable) {
        setResolvedSongId("");
        return;
      }

      try {
        const data = await getSongById(String(fetchable));
        const hydrated =
          data?.song?._id ||
          data?.data?._id ||
          data?._id ||
          data?.song?.id ||
          data?.data?.id ||
          data?.id;

        if (hydrated) {
          setResolvedSongId(String(hydrated));
        } else {
          setResolvedSongId("");
        }
      } catch {
        setResolvedSongId("");
      }
    };

    if (visible && currentSong) void resolve();
    else setResolvedSongId("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, currentSong]);

  const isLikeDisabled = useMemo(
    () => !resolvedSongId || liking || loadingLikeState,
    [resolvedSongId, liking, loadingLikeState]
  );

  const getUserId = async () =>
    (await AsyncStorage.getItem("userId")) ||
    (await AsyncStorage.getItem("apostle.userId"));

  const syncLikeState = async () => {
    if (!resolvedSongId) {
      setIsLiked(false);
      return;
    }

    try {
      setLoadingLikeState(true);
      const userId = await getUserId();
      if (!userId) {
        setIsLiked(false);
        return;
      }

      const data = await getLikedSongs(userId);
      const songs: any[] = Array.isArray(data?.songs)
        ? data.songs
        : Array.isArray(data?.data)
          ? data.data
          : [];

      const next = songs.some((s) => String(s?._id ?? s?.id) === String(resolvedSongId));
      setIsLiked(next);
    } catch {
      setIsLiked(false);
    } finally {
      setLoadingLikeState(false);
    }
  };

  useEffect(() => {
    if (!visible) return;
    void syncLikeState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, resolvedSongId]);

  useEffect(() => {
    if (!visible) return;
    const unsub = onLikedUpdated(() => {
      void syncLikeState();
    });
    return () => {
      if (typeof unsub === "function") void unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, resolvedSongId]);

  const toggleLike = async () => {
    if (!resolvedSongId) {
      Alert.alert("Error", "No song selected.");
      return;
    }
    if (liking) return;

    setLiking(true);

    try {
      const res = await likeUnlikeSong(String(resolvedSongId));
      const likedByMe = await isLikedByMeFromLikesArray(res?.likes);
      setIsLiked(likedByMe);
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.message || "Failed to update like");
    } finally {
      setLiking(false);
    }
  };

  const shareSong = async () => {
    if (!currentSong) return;
    try {
      await Share.share({
        message: `Check out this song: ${currentSong.title} by ${currentSong.author}`,
        url: (currentSong as any).trackUrl,
        title: currentSong.title,
      });
    } catch {
      // no logs
    }
  };

  const addCurrentToQueue = async () => {
    if (currentSong) await addToQueue(currentSong);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={tw`flex-1 bg-black/40`}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={tw`absolute bottom-0 left-0 right-0 bg-white p-6 rounded-t-3xl`}>
          <Text style={tw`text-base font-bold mb-4`}>More Options</Text>

          <View style={tw`flex-row flex-wrap justify-between`}>
            <Option
              label="View Queue"
              icon={<Ionicons name="list" size={22} />}
              action={() => {
                onShowQueue();
                onClose();
              }}
            />

            {/* Like/Unlike button showing correct icon */}
            <TouchableOpacity
              onPress={toggleLike}
              disabled={isLikeDisabled}
              style={tw`w-[47%] ${isLikeDisabled ? "opacity-60" : ""} bg-gray-100 p-4 rounded-xl flex-row items-center mb-3`}
            >
              {loadingLikeState || liking ? (
                <ActivityIndicator size="small" />
              ) : (
                <MaterialIcons
                  name={isLiked ? "favorite" : "favorite-border"}
                  size={22}
                  color={isLiked ? "#e91e63" : "black"}
                />
              )}

              <Text style={tw`ml-2 text-sm font-medium`} numberOfLines={1}>
                {loadingLikeState
                  ? ""
                  : liking
                    ? (isLiked ? "Unliking…" : "Liking…")
                    : isLiked
                      ? "Unlike"
                      : "Like song"}
              </Text>
            </TouchableOpacity>

            <Option
              label="Add to Queue"
              icon={<Ionicons name="add-circle" size={22} />}
              action={addCurrentToQueue}
            />

            <Option
              label="Add to Playlist"
              icon={<Ionicons name="add" size={22} />}
              action={() => {
                onShowAddToPlaylist && onShowAddToPlaylist();
                onClose();
              }}
            />

            <Option
              label="Song Details"
              icon={<Ionicons name="information-circle" size={22} />}
              action={() => onShowDetails && onShowDetails()}
            />

            <Option
              label="Share Song"
              icon={<Ionicons name="share-social" size={22} />}
              action={shareSong}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

interface OptionProps {
  label: string;
  icon: React.ReactNode;
  action?: () => void;
}
const Option: React.FC<OptionProps> = ({ label, icon, action }) => (
  <TouchableOpacity
    onPress={action}
    style={tw`w-[47%] bg-gray-100 p-4 rounded-xl flex-row items-center mb-3`}
  >
    {icon}
    <Text style={tw`ml-2 text-sm font-medium`} numberOfLines={1}>
      {label}
    </Text>
  </TouchableOpacity>
);
