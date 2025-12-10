import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import tw from 'twrnc';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 3; // 3 cards per row, accounting for padding
const cardHeight = cardWidth * 1.4; // Maintain aspect ratio

const genres = [
  {
    id: 1,
    title: "HIGH-LIFE",
    artist: "OSHIWAMBO DANCERS",
    image: { uri: 'https://example.com/images/high-life.jpg' },
  },
  {
    id: 2,
    title: "SOUL",
    artist: "",
    image: { uri: 'https://example.com/images/soul.jpg' },
  },
  {
    id: 3,
    title: "POP",
    artist: "",
    image: { uri: 'https://example.com/images/pop.jpg' },
  },
  {
    id: 4,
    title: "FUJI",
    artist: "",
    image: { uri: 'https://example.com/images/fuji.jpg' },
  },
  {
    id: 5,
    title: "BLUES",
    artist: "",
    image: { uri: 'https://example.com/images/blues.jpg' },
  },
  {
    id: 6,
    title: "HIP-HOP",
    artist: "",
    image: { uri: 'https://example.com/images/hiphop.jpg' },
  },
  {
    id: 7,
    title: "AFRO-BEATS",
    artist: "",
    image: { uri: 'https://example.com/images/afrobeats.jpg' },
  },
  {
    id: 8,
    title: "REGGAE",
    artist: "",
    image: { uri: 'https://example.com/images/reggae.jpg' },
  },
  {
    id: 9,
    title: "RNB",
    artist: "",
    image: { uri: 'https://example.com/images/rnb.jpg' },
  },
];

export default function GenresSection() {
  const rows = [];
  for (let i = 0; i < genres.length; i += 3) {
    rows.push(genres.slice(i, i + 3));
  }

  return (
    <View style={tw`flex-1 bg-gray-50 pt-8 pb-6`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center px-6 mb-6`}>
        <Text style={tw`text-2xl font-bold text-black`}>Genre's</Text>
        <TouchableOpacity>
          <Text style={tw`text-base text-gray-600`}>more</Text>
        </TouchableOpacity>
      </View>

      {/* Genres in grid layout - no scroll */}
      <View style={tw`px-3`}>
        {rows.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={tw`flex-row justify-between mb-4`}
          >
            {row.map((genre) => (
              <TouchableOpacity
                key={genre.id}
                activeOpacity={0.9}
                style={{ width: cardWidth }}
              >
                <ImageBackground
                  source={genre.image}
                  style={[tw`overflow-hidden shadow-lg`, { width: cardWidth, height: cardHeight }]}
                  imageStyle={{ borderBottomLeftRadius: 20, borderTopRightRadius: 20 }}
                  resizeMode="cover"
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={[
                      tw`overflow-hidden p-2 shadow-lg justify-between`,
                      { width: cardWidth, height: cardHeight, borderBottomLeftRadius: 20, borderTopRightRadius: 20 }
                    ]}
                  >
                    {/* Artist at top */}
                    {genre.artist && (
                      <Text style={tw`text-white text-[9px] font-semibold`}>
                        {genre.artist}
                      </Text>
                    )}
                    
                    {/* Genre title at bottom */}
                    <Text style={tw`text-white text-sm font-bold text-right`}>
                      {genre.title}
                    </Text>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}