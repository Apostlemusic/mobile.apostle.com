import React, { useState, useEffect } from "react";
import axios from "axios";

// Define a type for the song data
interface Song {
  trackId: string;
  title: string;
  author: string;
  trackImg: string;
  previewUrl?: string;
}

export const useFetchSongs = (url: string) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get<{ data: Song[]; success: boolean }>(url, {
          withCredentials: true,
        });
        if (res.data.success) {
          setSongs(res.data.data);
        } else {
          throw new Error("Failed to fetch songs.");
        }
      } catch (err: any) {
        console.error(err.response?.data || err.message);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [url]);

  return { songs, error, loading };
}

export type TrackData = {
  id: string;
  title: string;
  artist?: string;
  artworkUrl?: string;
  duration?: number;
  album?: string;
  // add other fields your backend returns
};

export async function requestTrackPlayback(trackId: string): Promise<{ audioUrl: string; track: TrackData }> {
  // Replace with your real endpoint and headers
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? ''}/api/tracks/play`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trackId }),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch track playback for id=${trackId}`);
  }

  const data = await res.json();
  // Expecting: { audioUrl: string, track: { id, title, ... } }
  if (!data?.audioUrl || !data?.track?.id) {
    throw new Error('Malformed playback response');
  }

  return { audioUrl: data.audioUrl, track: data.track as TrackData };
}

// A single global extended type usable across all song endpoints
export type GlobalTrack = {
  id: string;                 // canonical id
  trackId?: string;           // some APIs use trackId
  title: string;
  author: string;
  artist?: string;

  // artwork / images
  artworkUrl?: string;
  trackImg?: string;
  image?: string;

  // audio sources
  audioUrl?: string;
  trackUrl?: string;
  previewUrl?: string;

  // optional metadata
  album?: string;
  duration?: number;
  liked?: boolean;
  categoryIds?: string[];
  genreIds?: string[];
  createdAt?: string;
};

// Normalize any backend item into GlobalTrack
export function normalizeToGlobalTrack(item: any, index = 0): GlobalTrack {
  const id = item?.id ?? item?._id ?? item?.trackId ?? `tmp-${index}`;
  const title =
    item?.title ??
    item?.name ??
    item?.trackName ??
    item?.songTitle ??
    'Untitled';

  const author =
    item?.author ??
    item?.artist ??
    item?.artistName ??
    item?.singer ??
    'Unknown Artist';

  return {
    id,
    trackId: item?.trackId ?? item?.id ?? item?._id,
    title,
    author,
    artist: item?.artist ?? item?.artistName,

    // artwork
    artworkUrl: item?.artworkUrl ?? item?.artwork ?? item?.coverUrl,
    trackImg: item?.trackImg ?? item?.coverImage ?? item?.thumbnail,
    image: item?.image,

    // audio
    audioUrl: item?.audioUrl ?? item?.streamUrl,
    trackUrl: item?.trackUrl,
    previewUrl: item?.previewUrl,

    // metadata
    album: item?.album ?? item?.albumName,
    duration: item?.duration ?? item?.length,
    liked: !!item?.liked,
    categoryIds: item?.categoryIds ?? item?.categories,
    genreIds: item?.genreIds ?? item?.genres,
    createdAt: item?.createdAt,
  };
}

export function normalizeArray(items: any[] | undefined | null): GlobalTrack[] {
  if (!Array.isArray(items)) return [];
  return items.map((it, idx) => normalizeToGlobalTrack(it, idx));
}

// Helper to pick the best playable URL from a normalized track
export function pickPlayableUrl(t: GlobalTrack | undefined | null): string {
  if (!t) return '';
  return t.audioUrl || t.trackUrl || t.previewUrl || '';
}
