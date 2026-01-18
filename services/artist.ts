import { api } from '@/lib/api/client';
import { setTokens } from '@/lib/auth/tokens';

type ArtistFollowEvent = {
  artistId: string;
  userId: string;
  isFollowing: boolean;
};

const artistFollowEvents = {
  listeners: new Set<(event: ArtistFollowEvent) => void>(),
  emit(event: ArtistFollowEvent) {
    this.listeners.forEach((fn) => fn(event));
  },
  subscribe(fn: (event: ArtistFollowEvent) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  },
};

export const emitArtistFollowChanged = (event: ArtistFollowEvent) =>
  artistFollowEvents.emit(event);

export const onArtistFollowChanged = (fn: (event: ArtistFollowEvent) => void) =>
  artistFollowEvents.subscribe(fn);

function pickTokens(payload: any): { access?: string; refresh?: string } {
  return {
    access: payload?.accessToken ?? payload?.data?.accessToken,
    refresh: payload?.refreshToken ?? payload?.data?.refreshToken,
  };
}


export async function getAllArtists() {
  const res = await api.get('/api/artist/getAllArtists');
  return res.data;
}

export async function getArtistById(artistId: string) {
  const res = await api.get(`/api/artist/getArtistById/${encodeURIComponent(artistId)}`);
  return res.data;
}

export async function getArtistByName(name: string) {
  const res = await api.get(`/api/artist/getArtistByName/${encodeURIComponent(name)}`);
  return res.data;
}

export async function getLikedArtists() {
  const res = await api.get('/api/artist/getLikedArtists');
  return res.data;
}

export async function getFollowedArtists() {
  const res = await api.get('/api/artist/getFollowedArtists');
  return res.data;
}

export async function followArtist(input: { artistId: string; userId: string }) {
  const res = await api.post('/api/artist/followArtist', input);
  return res.data;
}

export async function likeArtist(input: { artistId: string; userId: string }) {
  const res = await api.post('/api/artist/likeArtist', input);
  return res.data;
}