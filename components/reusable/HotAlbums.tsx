import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ImageBackground } from "react-native";
import tw from "twrnc";
import LinearGradient from "react-native-linear-gradient";
import { getAllSongs } from "@/services/content";


const fallbackAlbums = [
  {
    id: 1,
    title: "He Is Amazing",
    artist: "Samuel Agboyega",
    image: require("../../assets/images/album-cover.jpg"),
  },
  {
    id: 2,
    title: "Symphony's Mix, Vol 1",
    artist: "Heaven's Symphony",
    image: require("../../assets/images/album-cover.jpg"),
  },
  {
    id: 3,
    title: "OBA",
    artist: "Samuel Agboyega",
    image: require("../../assets/images/album-cover.jpg"),
  },
  {
    id: 4,
    title: "Another Album",
    artist: "Samuel Agboyega",
    image: require("../../assets/images/album-cover.jpg"),
  },
];

function pickSongs(payload: any): any[] {
  if (Array.isArray(payload?.songs)) return payload.songs;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
}

export default function TopHitsThisWeek() {
  const [albums, setAlbums] = useState<any[]>(fallbackAlbums);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getAllSongs();
        const songs = pickSongs(data);

        if (!mounted) return;

        if (songs.length > 0) {
          setAlbums(
            songs.slice(0, 10).map((s: any, idx: number) => ({
              id: s?._id ?? s?.trackId ?? idx,
              title: s?.title ?? "Unknown",
              artist: s?.author ?? (Array.isArray(s?.artists) ? s.artists.join(", ") : "Unknown"),
              // keep UI identical: if API provides image use it, otherwise keep your local fallback image
              image: s?.trackImg ? { uri: s.trackImg } : require("../../assets/images/album-cover.jpg"),
            }))
          );
        }
      } catch (e) {
        console.error("Failed to load top hits:", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={tw`flex-1 bg-gray-50 pt-15`}>
      <Text style={tw`text-2xl font-bold text-black ml-6 mb-5`}>
        Top Hit's This Week
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-6`}
      >
        {albums.map((album: any) => (
          <ImageBackground
            key={album.id}
            source={album.image}
            style={[tw`w-[150px] h-[220px] overflow-hidden shadow-lg mr-6`]}
            imageStyle={{ borderBottomLeftRadius: 30, borderTopRightRadius: 30 }}
          >
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={[
                tw`w-[150px] h-[220px] overflow-hidden p-3 shadow-lg`,
                { borderBottomLeftRadius: 30, borderTopRightRadius: 30 },
              ]}
            >
              {/* Artist & Title */}
              <Text style={tw`text-white text-base font-semibold mb-1 w-full`}>
                {album.artist}
              </Text>
              <Text
                style={tw`text-white text-lg font-semibold absolute bottom-3 right-2 w-full text-center`}
              >
                {album.title}
              </Text>
            </LinearGradient>
          </ImageBackground>
        ))}
      </ScrollView>
    </View>
  );
}