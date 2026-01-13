import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { useFetchSongs } from '@/hooks/useFetchSongs';
import { usePlayer } from '@/components/player/PlayerContext'; // changed: use PlayerContext

// Simple helper to normalize author/id mapping
const normalize = (s: string) => s.trim().toLowerCase();

export default function ArtistPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // expecting an artist identifier (e.g. author name or slug)
  const artistId = Array.isArray(id) ? id[0] : (id || '');

  // Fetch all songs then filter locally for now (until dedicated endpoint exists)
  const { songs, loading, error } = useFetchSongs(
    `${process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:10000"}/api/content/songs`
  );
  const { playById } = usePlayer(); // changed

  const artistSongs = useMemo(() => {
    return songs.filter(s => normalize(s.author || '') === normalize(artistId));
  }, [songs, artistId]);

  // Popular: first 5 artist songs (placeholder sort – could sort by plays once API provides)
  const popularSongs = artistSongs.slice(0, 5).map(s => ({
    id: s.trackId,
    title: s.title,
    plays: '— plays', // placeholder
    cover: { uri: s.trackImg || 'https://via.placeholder.com/60' },
    trackUrl: (s as any).trackUrl || (s as any).previewUrl || '',
    author: s.author
  }));

  // Releases mock: group songs by (placeholder) year; since year not provided, just list all
  const releases = artistSongs.map(s => ({
    cover: { uri: s.trackImg || 'https://via.placeholder.com/150' },
    title: s.title,
    type: 'Single',
    year: '—',
  }));

  const biography = `This is a placeholder biography for ${artistId}. Update the API to return artist bio, social links, and extended metadata. Until then, this section explains the artist background and style. Placeholder text continues to fill space for design.`;

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header / Hero */}
        <View style={tw`w-full h-64 mb-2`}>
          <Image
            source={{ uri: artistSongs[0]?.trackImg || 'https://via.placeholder.com/600x400?text=Artist' }}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
          <View style={tw`absolute inset-0 bg-black/30`} />
          <TouchableOpacity
            onPress={() => router.back()}
            style={tw`absolute top-12 left-5 bg-white/70 p-2 rounded-full`}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <View style={tw`absolute bottom-4 left-5`}>  
            <Text style={tw`text-3xl font-bold text-white`}>{artistId || 'Artist'}</Text>
            <Text style={tw`text-gray-200 text-base`}>Artist</Text>
          </View>
        </View>

        {/* Loading / Error States */}
        {loading && (
          <View style={tw`px-5 mt-4`}>
            <ActivityIndicator />
          </View>
        )}
        {error && !loading && (
          <Text style={tw`px-5 text-red-600 mt-4`}>{error}</Text>
        )}

        {/* Popular Section */}
        <View style={tw`px-5 mt-2`}>
          <Text style={tw`text-xl font-semibold mb-3`}>Popular</Text>
          {popularSongs.length === 0 && !loading && (
            <Text style={tw`text-gray-500`}>No songs found for this artist.</Text>
          )}
          {popularSongs.map(song => (
            <View key={song.id} style={tw`flex-row items-center justify-between py-3`}>
              <TouchableOpacity
                style={tw`flex-row items-center gap-3 flex-1`}
                onPress={() => song.id && playById(song.id)} // changed: play by id
              >
                <Image source={song.cover} style={tw`w-12 h-12 rounded-lg`} />
                <View style={tw`flex-1`}>
                  <Text style={tw`text-base font-semibold`} numberOfLines={1}>{song.title}</Text>
                  <Text style={tw`text-gray-500 text-xs`} numberOfLines={1}>{song.plays}</Text>
                </View>
              </TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={20} />
            </View>
          ))}
        </View>

        {/* All Releases */}
        <View style={tw`px-5 mt-8`}>
          <View style={tw`flex-row justify-between items-center mb-3`}>
            <Text style={tw`text-xl font-semibold`}>All releases</Text>
            <TouchableOpacity>
              <Text style={tw`text-gray-600`}>Show all</Text>
            </TouchableOpacity>
          </View>
          <View style={tw`flex-row flex-wrap justify-between`}>
            {releases.map((rel, idx) => (
              <View key={idx} style={tw`w-[48%] mb-5`}>
                <Image source={rel.cover} style={tw`w-full h-36 rounded-xl`} />
                <Text style={tw`font-semibold mt-1`} numberOfLines={1}>{rel.title}</Text>
                <Text style={tw`text-xs text-gray-600`}>{rel.type}, {rel.year}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* About Section */}
        <View style={tw`px-5 mt-8 mb-10`}>
          <Text style={tw`text-xl font-semibold mb-3`}>About</Text>
          <View style={tw`bg-white rounded-2xl p-4 shadow-sm`}>
            <Image
              source={{ uri: artistSongs[1]?.trackImg || artistSongs[0]?.trackImg || 'https://via.placeholder.com/600x400?text=About' }}
              style={tw`w-full h-40 rounded-xl mb-3`}
            />
            <Text style={tw`text-lg font-bold`}>{artistId || 'Artist'}</Text>
            <Text style={tw`text-gray-700 text-sm mt-2 leading-5`}>{biography}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
