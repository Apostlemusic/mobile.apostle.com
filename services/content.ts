import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/lib/api/client';

export function unwrapArray(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.songs)) return payload.songs;

  // playlists
  if (Array.isArray(payload?.playLists)) return payload.playLists;
  if (Array.isArray(payload?.playlists)) return payload.playlists;

  if (Array.isArray(payload?.tracks)) return payload.tracks;
  if (Array.isArray(payload?.genres)) return payload.genres;
  if (Array.isArray(payload?.categories)) return payload.categories;
  return [];
}

export async function searchSongs(query: string) {
  const res = await api.get(`/api/content/songs/search/${encodeURIComponent(query)}`);
  return res.data;
}

export async function getAllSongs() {
  const res = await api.get('/api/content/songs');
  return res.data;
}

export async function getGenres() {
  const res = await api.get('/api/content/genres'); // ✅ FIX: GenreGrid imports this
  return res.data;
}

export async function getCategories() {
  const res = await api.get('/api/content/categories');
  return res.data;
}

// ✅ Lightweight event bus: notify screens to refresh liked songs
const likedEvents = {
  listeners: new Set<() => void>(),
  emit() {
    for (const fn of this.listeners) fn();
  },
  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  },
};

export const emitLikedUpdated = () => likedEvents.emit();
export const onLikedUpdated = (fn: () => void) => likedEvents.subscribe(fn);

// Postman: GET /api/content/songs/liked?userId={{userId}}
export async function getLikedSongs(userId: string) {
  const res = await api.get('/api/content/songs/liked', { params: { userId } });
  return res.data; // { success:true, songs:[...] }
}

// Postman: POST /api/content/songs/like { songId }
// ✅ returns: { success:true, likes: string[] } where likes are USER ids
export async function likeUnlikeSong(songId: string) {
  const res = await api.post('/api/content/songs/like', { songId });
  emitLikedUpdated();
  return res.data as { success: boolean; likes: string[] };
}

// ✅ Helper: compute if current user has liked the song using the toggle response
export async function isLikedByMeFromLikesArray(likes?: unknown) {
  const userId =
    (await AsyncStorage.getItem("userId")) ||
    (await AsyncStorage.getItem("apostle.userId"));

  if (!userId) return false;
  if (!Array.isArray(likes)) return false;

  return likes.some((id) => String(id) === String(userId));
}

// ✅ GET user playlists
// Response: { success:true, playLists:[...] }
export async function getUserPlaylists(userId: string) {
  const res = await api.get('/api/content/playlists', { params: { userId } });
  const data = res.data;

  return {
    ...data,
    playlists:
      Array.isArray(data?.playLists) || Array.isArray(data?.playlists)
        ? unwrapArray(data)
        : [],
  };
}

// ✅ GET playlist by id
// Response: { success:true, playList:{...} }
export async function getPlaylistById(playlistId: string) {
  const res = await api.get(`/api/content/playlists/${encodeURIComponent(playlistId)}`);
  const data = res.data;

  return {
    ...data,
    playlist: data?.playList ?? data?.playlist ?? data?.data ?? null,
  };
}

// Postman: POST /api/content/playlists/add { playlistId, trackId }
export async function addTrackToPlaylist(input: { playlistId: string; trackId: string }) {
  const res = await api.post('/api/content/playlists/add', input);
  return res.data;
}

// Postman: POST /api/content/playlists/remove-track { playlistId, trackId }
export async function removeTrackFromPlaylist(input: {
  playlistId: string;
  trackId: string;
}) {
  const res = await api.post('/api/content/playlists/remove-track', input);
  return res.data; // { success:true, playList:{...} }
}

// (Optional but used by Library earlier)
// Postman: DELETE /api/content/playlists { playlistId }
export async function deletePlaylist(input: { playlistId: string }) {
  const res = await api.delete('/api/content/playlists', { data: input });
  return res.data;
}

// ✅ GET song by Mongo _id (used to hydrate tracksId -> full song objects)
export async function getSongById(songId: string) {
  const res = await api.get(`/api/content/songs/${encodeURIComponent(songId)}`);
  return res.data; // expect { success:true, song:{...} } or compatible shape
}

