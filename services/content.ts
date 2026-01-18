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

export async function getAllSongs() {
  const res = await api.get('/api/content/songs');
  return res.data;
}

export async function getSongById(songId: string) {
  const res = await api.get(`/api/content/songs/${encodeURIComponent(songId)}`);
  return res.data;
}

export async function getSongByTrackId(trackId: string) {
  const res = await api.get(`/api/content/songs/track/${encodeURIComponent(trackId)}`);
  return res.data;
}

export async function searchSongs(query: string) {
  const res = await api.get(`/api/content/songs/search/${encodeURIComponent(query)}`);
  return res.data;
}

export async function searchAll(query: string, limit = 10) {
  const res = await api.get('/api/content/search', {
    params: { q: query, limit },
  });
  return res.data;
}

export async function getSongsByCategory(category: string) {
  const res = await api.get(`/api/content/songs/category/${encodeURIComponent(category)}`);
  return res.data;
}

export async function getCategories() {
  const res = await api.get('/api/content/categories');
  return res.data;
}

export async function getCategoryBySlug(categorySlug: string) {
  const res = await api.get(`/api/content/categories/${encodeURIComponent(categorySlug)}`);
  return res.data;
}

export async function getGenres() {
  const res = await api.get('/api/content/genres'); // ✅ FIX: GenreGrid imports this
  return res.data;
}

export async function getGenreBySlug(genreSlug: string) {
  const res = await api.get(`/api/content/genres/${encodeURIComponent(genreSlug)}`);
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

// ✅ GET user playlists (auth-based, no userId)
export async function getUserPlaylists() {
  const res = await api.get('/api/content/playlists');
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

/**
 * Songs - My Liked Songs (auth)
 * GET /api/content/songs/liked
 * Headers: Authorization: Bearer {{jwt}} (handled by api interceptor)
 */
export async function getMyLikedSongs() {
  const res = await api.get('/api/content/songs/liked');
  return res.data; // expected { success:true, songs:[...] } (or similar)
}

/**
 * Plays - Record playback
 * POST /api/content/plays
 * Body: { itemType: "song", itemId: "<songId>" }
 */
export async function recordPlayback(input: { itemType: 'song'; itemId: string }) {
  const res = await api.post('/api/content/plays', input);
  return res.data;
}

/**
 * Discover
 * GET /api/content/discover?section=...&limit=...&type=...
 */
export async function getDiscover(input: {
  section: "jump-back-in" | "new-releases" | "most-liked" | "most-listened";
  limit?: number;
  type?: "song" | "category";
}) {
  const res = await api.get("/api/content/discover", {
    params: {
      section: input.section,
      limit: input.limit,
      type: input.type,
    },
  });
  return res.data;
}

/**
 * Categories - Create (with imageUrl)
 * POST /api/content/categories
 */
export async function createCategory(input: { name: string; imageUrl?: string }) {
  const res = await api.post('/api/content/categories', input);
  return res.data;
}

/**
 * Categories - Update (with imageUrl)
 * PUT /api/content/categories
 */
export async function updateCategory(input: { categorySlug: string; imageUrl?: string; name?: string }) {
  const res = await api.put('/api/content/categories', input);
  return res.data;
}

/**
 * Genres - Create (with imageUrl)
 * POST /api/content/genres
 */
export async function createGenre(input: { name: string; imageUrl?: string }) {
  const res = await api.post('/api/content/genres', input);
  return res.data;
}

/**
 * Genres - Update (with imageUrl)
 * PUT /api/content/genres
 */
export async function updateGenre(input: { genreSlug: string; imageUrl?: string; name?: string }) {
  const res = await api.put('/api/content/genres', input);
  return res.data;
}

// ✅ Auth version (matches your Postman JSON)
export async function getLikedSongs() {
  const res = await api.get('/api/content/songs/liked');
  return res.data; // { success:true, songs:[...] }
}

