import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
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

const Index = () => {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SongProvider>
  );
};

export default Index;