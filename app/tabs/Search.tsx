import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import tw from "twrnc";

// Components
import { SearchSkeleton } from "@/components/reusable/Skeleton";
import ArtistProfileCard from "@/components/reusable/ArtistSlide";
import TopHitsThisWeek from "@/components/reusable/HotAlbums";
import Search from "@/components/icon/Search";

// Context
import { SongProvider } from "@/contexts/SongContext";
import GenresSection from "@/components/reusable/GenreGrid";
import { usePlayer } from "@/components/player/PlayerContext"; // added

const Index = () => {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]); // typed to any[] since API may vary
  const [isSearching, setIsSearching] = useState(false);
  const { playById } = usePlayer(); // added

  // Initial loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Search effect
  useEffect(() => {
    if (search === "") {
      setResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      setIsSearching(true);
      try {
        const response = await axios.get(
          `https://apostle.onrender.com/api/song/getSongWithQuery/${search}`
        );
        setResults(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchSearchResults();
  }, [search]);

  // Loading state
  if (isLoading) {
    return <SearchSkeleton />;
  }

  return (
    <SongProvider>
      <KeyboardAvoidingView
        style={tw`flex-1 mb-26`}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          {/* Search Header Section */}
          <View style={tw`relative`}>
            <View style={tw`w-full h-[420px] justify-end`}>
              <View style={tw`absolute top-0 w-full z-10`}>
                {/* Search Bar */}
                <View
                  style={tw`flex-row items-center bg-[#F9F9F9D4] rounded-xl p-3 shadow-md mx-4 mb-5 border border-[#26425299]`}
                >
                  <TextInput
                    placeholder="Search keywords"
                    placeholderTextColor="gray"
                    style={tw`text-base flex-1`}
                    value={search}
                    onChangeText={setSearch}
                  />
                  <Search />
                </View>
              </View>
              <ArtistProfileCard />
            </View>
          </View>

          {/* Main Content */}
          <View>
            <TopHitsThisWeek />

            <GenresSection />

            {/* Search Results */}
            {isSearching ? (
              <Text style={tw`px-4 py-2 text-gray-600`}>Searching…</Text>
            ) : results.length > 0 ? (
              <View style={tw`px-4 mt-4`}>
                {results.map((item: any, idx: number) => {
                  const id = item?.trackId ?? item?._id;
                  return (
                    <TouchableOpacity
                      key={id ? String(id) : `${idx}`}
                      style={tw`flex-row items-center p-3 mb-2 rounded-2xl bg-white border border-[#eaeaea]`}
                      activeOpacity={0.9}
                      onPress={() => id && playById(id)} // added
                    >
                      <View
                        style={[
                          tw`w-14 h-14 rounded-xl mr-3`,
                          { overflow: "hidden", backgroundColor: "#f1f1f1" },
                        ]}
                      >
                        {item?.trackImg ? (
                          <Image
                            source={{ uri: item.trackImg }}
                            style={tw`w-full h-full`}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={tw`flex-1 items-center justify-center`}>
                            <Text style={tw`text-gray-500`}>🎵</Text>
                          </View>
                        )}
                      </View>
                      <View style={tw`flex-1`}>
                        <Text
                          style={[
                            tw`text-black`,
                            { fontSize: 16, fontWeight: "700" },
                          ]}
                          numberOfLines={1}
                        >
                          {item?.title ?? "Unknown Title"}
                        </Text>
                        <Text
                          style={[tw`text-gray-500`, { fontSize: 12 }]}
                          numberOfLines={1}
                        >
                          {item?.author ??
                            (item?.artists?.join(", ") ?? "Unknown Artist")}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : search.length > 0 ? (
              <Text style={tw`px-4 py-2 text-gray-600`}>
                No results for “{search}”
              </Text>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SongProvider>
  );
};

export default Index;