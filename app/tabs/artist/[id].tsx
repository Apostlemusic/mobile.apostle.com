import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '@/components/player/PlayerContext';
import { followArtist, getArtistByName, emitArtistFollowChanged, onArtistFollowChanged } from '@/services/artist';
import { getUserId } from '@/services/authStorage';

// Simple helper to normalize author/id mapping
const normalize = (s: string) => s.trim().toLowerCase();
const isMongoId = (v?: string) => typeof v === "string" && /^[a-f0-9]{24}$/i.test(v);

export default function ArtistPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const artistName = Array.isArray(id) ? id[0] : (id || '');

  const { playById } = usePlayer();

  const [artist, setArtist] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const id = await getUserId();
      if (mounted) setUserId(id || '');
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!artistName) return;

    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getArtistByName(artistName);

        if (!mounted) return;

        setArtist(data?.artist ?? null);
        setSongs(Array.isArray(data?.songs) ? data.songs : []);
        setAlbums(Array.isArray(data?.albums) ? data.albums : []);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Failed to load artist");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [artistName]);

  useEffect(() => {
    if (!artist || !userId) {
      setIsFollowing(false);
      return;
    }
    const followers = Array.isArray(artist?.followers) ? artist.followers : [];
    setIsFollowing(followers.some((id: any) => String(id) === String(userId)));
  }, [artist, userId]);

  useEffect(() => {
    if (!artist?._id || !userId) return;
    const unsubscribe = onArtistFollowChanged((event) => {
      if (String(event.artistId) !== String(artist._id)) return;
      if (String(event.userId) !== String(userId)) return;
      setArtist((prev: any) => {
        if (!prev) return prev;
        const followers = Array.isArray(prev.followers) ? prev.followers : [];
        const exists = followers.some((id: any) => String(id) === String(userId));
        const nextFollowers = event.isFollowing
          ? exists
            ? followers
            : [...followers, userId]
          : followers.filter((id: any) => String(id) !== String(userId));
        return { ...prev, followers: nextFollowers };
      });
      setIsFollowing(event.isFollowing);
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [artist?._id, userId]);

  const artistSongs = useMemo(() => {
    return songs.filter(s => normalize(s.author || '') === normalize(artistName));
  }, [songs, artistName]);

  const popularSongs = artistSongs.slice(0, 5).map(s => ({
    id: isMongoId(s._id) ? s._id : undefined,
    title: s.title,
    plays: '— plays',
    cover: { uri: s.trackImg || 'https://via.placeholder.com/60' },
    trackUrl: s.trackUrl || '',
    author: s.author
  }));

  const releases = (albums.length > 0 ? albums : artistSongs).map((s: any) => ({
    cover: { uri: s.trackImg || 'https://via.placeholder.com/150' },
    title: s.title || s.name || 'Release',
    type: s.type || 'Single',
    year: s.year || '—',
  }));

  const biography = artist?.about || artist?.description || '';
  const profileImg = artist?.profileImg || artistSongs[0]?.trackImg || 'https://via.placeholder.com/600x400?text=Artist';
  const followerCount = Array.isArray(artist?.followers) ? artist.followers.length : 0;

  const handleFollowToggle = async () => {
    if (!artist?._id || !userId || followLoading) return;
    try {
      setFollowLoading(true);
      await followArtist({ artistId: artist._id, userId });
      const followers = Array.isArray(artist?.followers) ? artist.followers : [];
      const exists = followers.some((id: any) => String(id) === String(userId));
      const nextFollowers = exists
        ? followers.filter((id: any) => String(id) !== String(userId))
        : [...followers, userId];
      const nextIsFollowing = !exists;
      setArtist((prev: any) => (prev ? { ...prev, followers: nextFollowers } : prev));
      setIsFollowing(nextIsFollowing);
      emitArtistFollowChanged({ artistId: String(artist._id), userId: String(userId), isFollowing: nextIsFollowing });
    } catch (e: any) {
      console.error('Failed to follow artist:', e?.response?.data ?? e);
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={tw`flex-1 bg-white dark:bg-[#0b0b10]`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header / Hero */}
        <View style={tw`w-full h-64 mb-2`}>
          <Image
            source={{ uri: profileImg }}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
          <View style={tw`absolute inset-0 bg-black/30`} />
          <TouchableOpacity
            onPress={() => router.back()}
            style={tw`absolute top-12 left-5 bg-white/70 dark:bg-black/50 p-2 rounded-full`}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <View style={tw`absolute bottom-4 left-5`}>  
            <Text style={tw`text-3xl font-bold text-white`}>{artist?.name || artistName || 'Artist'}</Text>
            <Text style={tw`text-gray-200 text-base`}>{artist?.description || 'Artist'}</Text>
          </View>
        </View>

        {/* Artist Meta + Follow */}
        <View style={tw`px-5 mt-3 flex-row items-center justify-between`}>
          <View style={tw`flex-1 pr-3`}>
            {artist?.about ? (
              <Text style={tw`text-sm text-gray-600 dark:text-gray-300`} numberOfLines={3}>
                {artist.about}
              </Text>
            ) : null}
            <Text style={tw`text-xs text-gray-500 dark:text-gray-400 mt-2`}>
              {followerCount} follower{followerCount === 1 ? '' : 's'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleFollowToggle}
            disabled={!userId || followLoading}
            style={[
              tw`px-5 py-2 rounded-xl`,
              isFollowing
                ? tw`bg-[#f1f3f5] dark:bg-[#23232b]`
                : tw`bg-[#2e77ff]`,
              !userId || followLoading ? tw`opacity-60` : null,
            ]}
          >
            <Text
              style={[
                tw`text-sm font-bold`,
                isFollowing ? tw`text-black dark:text-gray-100` : tw`text-white`,
              ]}
            >
              {followLoading ? 'Please wait…' : isFollowing ? 'Unfollow' : 'Follow'}
            </Text>
          </TouchableOpacity>
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
          <Text style={tw`text-xl font-semibold mb-3 text-black dark:text-gray-100`}>Popular</Text>
          {popularSongs.length === 0 && !loading && (
            <Text style={tw`text-gray-500 dark:text-gray-400`}>No songs found for this artist.</Text>
          )}
          {popularSongs.map(song => (
            <View key={song.id} style={tw`flex-row items-center justify-between py-3`}>
              <TouchableOpacity
                style={tw`flex-row items-center gap-3 flex-1`}
                onPress={() => song.id && playById(String(song.id))}
              >
                <Image source={song.cover} style={tw`w-12 h-12 rounded-lg`} />
                <View style={tw`flex-1`}>
                  <Text style={tw`text-base font-semibold text-black dark:text-gray-100`} numberOfLines={1}>{song.title}</Text>
                  <Text style={tw`text-gray-500 dark:text-gray-400 text-xs`} numberOfLines={1}>{song.author}</Text>
                </View>
              </TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={20} color="#9ca3af" />
            </View>
          ))}
        </View>

        {/* All Releases */}
        <View style={tw`px-5 mt-8`}>
          <View style={tw`flex-row justify-between items-center mb-3`}>
            <Text style={tw`text-xl font-semibold text-black dark:text-gray-100`}>All releases</Text>
            {/* <TouchableOpacity>
              <Text style={tw`text-gray-600`}>Show all</Text>
            </TouchableOpacity> */}
          </View>
          <View style={tw`flex-row flex-wrap justify-between`}>
            {releases.map((rel, idx) => (
              <View key={idx} style={tw`w-[48%] mb-5`}>
                <Image source={rel.cover} style={tw`w-full h-36 rounded-xl`} />
                <Text style={tw`font-semibold mt-1 text-black dark:text-gray-100`} numberOfLines={1}>{rel.title}</Text>
                <Text style={tw`text-xs text-gray-600 dark:text-gray-400`}>{rel.type}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* About Section */}
        <View style={tw`px-5 mt-8 mb-10`}>
          <Text style={tw`text-xl font-semibold mb-3 text-black dark:text-gray-100`}>About</Text>
          <View style={tw`bg-white dark:bg-[#14141b] rounded-2xl p-4 shadow-sm`}>
            <Image
              source={{ uri: artist?.profileImg || artistSongs[1]?.trackImg || artistSongs[0]?.trackImg || 'https://via.placeholder.com/600x400?text=About' }}
              style={tw`w-full h-40 rounded-xl mb-3`}
            />
            <Text style={tw`text-lg font-bold text-black dark:text-gray-100`}>{artist?.name || artistName || 'Artist'}</Text>
            {biography ? (
              <Text style={tw`text-gray-700 dark:text-gray-300 text-sm mt-2 leading-5`}>
                {biography}
              </Text>
            ) : (
              <Text style={tw`text-gray-500 dark:text-gray-400 text-sm mt-2`}>
                No biography available for this artist yet.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
