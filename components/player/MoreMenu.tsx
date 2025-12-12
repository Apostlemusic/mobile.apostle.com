import React, { useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Share, ActivityIndicator, Alert } from 'react-native';
import tw from 'twrnc';
import { useAudio } from '@/contexts/AudioContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface MoreMenuProps {
  visible: boolean;
  onClose: () => void;
  onShowQueue: () => void;
  onShowDetails?: () => void;
  onShowAddToPlaylist?: () => void;
}

export const MoreMenu: React.FC<MoreMenuProps> = ({ visible, onClose, onShowQueue, onShowDetails, onShowAddToPlaylist }) => {
  const { currentSong, addToQueue, shuffleQueue } = useAudio();
  const [liking, setLiking] = useState(false);
  const [likedOnce, setLikedOnce] = useState(false);

  const isLikeDisabled = useMemo(() => !currentSong || liking, [currentSong, liking]);

  const likeSong = async () => {
    if (!currentSong?.trackId) return;
    try {
      setLiking(true);
      const res = await fetch('https://apostle.onrender.com/api/song/handleLike', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId: currentSong.trackId }),
      });
      const json = await res.json().catch(() => ({}));
      console.log('Like song response:', json);
      if (!res.ok) {
        Alert.alert('Error', json?.message || 'Failed to like song');
        return;
      }
      setLikedOnce(true);
      Alert.alert('Liked', `${currentSong.title} added to your likes`);
    } catch (e) {
      Alert.alert('Error', 'Network error while liking song');
    } finally {
      setLiking(false);
    }
  };

  const shareSong = async () => {
    if (!currentSong) return;
    try {
      await Share.share({
        message: `Check out this song: ${currentSong.title} by ${currentSong.author}`,
        url: currentSong.trackUrl,
        title: currentSong.title,
      });
    } catch (e) {
      console.log('Share error', e);
    }
  };

  const addCurrentToQueue = async () => {
    if (currentSong) await addToQueue(currentSong);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={tw`flex-1 bg-black/40`} activeOpacity={1} onPress={onClose}>
        <View style={tw`absolute bottom-0 left-0 right-0 bg-white p-6 rounded-t-3xl`}> 
          <Text style={tw`text-base font-bold mb-4`}>More Options</Text>
          <View style={tw`flex-row flex-wrap justify-between`}>
            <Option label="View Queue" icon={<Ionicons name="list" size={22} />} action={() => { onShowQueue(); onClose(); }} />

            <TouchableOpacity
              onPress={likeSong}
              disabled={isLikeDisabled}
              style={tw`w-[47%] ${isLikeDisabled ? 'opacity-60' : ''} bg-gray-100 p-4 rounded-xl flex-row items-center mb-3`}
            >
              {liking ? (
                <ActivityIndicator size="small" />
              ) : (
                <MaterialIcons name={likedOnce ? "favorite" : "favorite-border"} size={22} color={likedOnce ? "#e91e63" : "black"} />
              )}
              <Text style={tw`ml-2 text-sm font-medium`} numberOfLines={1}>
                {likedOnce ? "Liked" : "Like song"}
              </Text>
            </TouchableOpacity>

            <Option label="Add to Queue" icon={<Ionicons name="add-circle" size={22} />} action={addCurrentToQueue} />

            <Option
              label="Add to Playlist"
              icon={<Ionicons name="add" size={22} />}
              action={() => {
                onShowAddToPlaylist && onShowAddToPlaylist();
                onClose();
              }}
            />

            <Option label="Song Details" icon={<Ionicons name="information-circle" size={22} />} action={() => onShowDetails && onShowDetails()} />
            <Option label="Share Song" icon={<Ionicons name="share-social" size={22} />} action={shareSong} />
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
  <TouchableOpacity onPress={action} style={tw`w-[47%] bg-gray-100 p-4 rounded-xl flex-row items-center mb-3`}>
    {icon}
    <Text style={tw`ml-2 text-sm font-medium`} numberOfLines={1}>{label}</Text>
  </TouchableOpacity>
);
