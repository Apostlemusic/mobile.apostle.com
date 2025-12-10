import React from 'react';
import { Modal, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { useAudio } from '@/contexts/AudioContext';
import { Ionicons } from '@expo/vector-icons';

interface QueueModalProps {
  visible: boolean;
  onClose: () => void;
}

export const QueueModal: React.FC<QueueModalProps> = ({ visible, onClose }) => {
  const { queue, currentSong, playPauseSong, playingTrackId, removeFromQueue } = useAudio();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={tw`flex-1 bg-white p-4 pt-20`}>
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <Text style={tw`text-xl font-bold`}>Queue</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={26} />
          </TouchableOpacity>
        </View>

        {currentSong && (
          <View style={tw`flex-row items-center bg-gray-100 p-3 rounded-2xl mb-4`}>
            <Image source={{ uri: currentSong.trackImg }} style={tw`w-14 h-14 rounded-xl`} />
            <View style={tw`ml-3 flex-1`}>
              <Text style={tw`font-semibold`} numberOfLines={1}>{currentSong.title}</Text>
              <Text style={tw`text-gray-500 text-sm`} numberOfLines={1}>{currentSong.author}</Text>
            </View>
          </View>
        )}

        <FlatList
          data={queue}
          keyExtractor={(item) => item.trackId}
          ListEmptyComponent={<Text style={tw`text-center text-gray-500 mt-8`}>Queue is empty</Text>}
          renderItem={({ item }) => {
            const isActive = item.trackId === playingTrackId;
            return (
              <TouchableOpacity
                onPress={() => playPauseSong(item)}
                style={tw`flex-row items-center justify-between py-3 ${isActive ? 'bg-blue-50 rounded-xl px-2' : ''}`}
              >
                <View style={tw`flex-row items-center`}>
                  <Image source={{ uri: item.trackImg }} style={tw`w-12 h-12 rounded-xl`} />
                  <View style={tw`ml-3 w-48`}>
                    <Text style={tw`font-semibold`} numberOfLines={1}>{item.title}</Text>
                    <Text style={tw`text-gray-500 text-xs`} numberOfLines={1}>{item.author}</Text>
                  </View>
                </View>
                <View style={tw`flex-row items-center gap-4`}>
                  {isActive && <Ionicons name="musical-notes" size={20} color="#0081C9" />}
                  <TouchableOpacity onPress={() => removeFromQueue(item.trackId)}>
                    <Ionicons name="remove-circle-outline" size={22} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    </Modal>
  );
};
