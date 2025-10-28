import React from "react";
import { View, Text, ScrollView, ImageBackground, TouchableOpacity } from "react-native";
import tw from "twrnc";

const data = {
    songs: [
        {
            name: "OBA",
            artist: "Samuel Agboyega",
            image: { uri: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2" },
        },
        {
            name: "Bordeaux",
            artist: "Drae",
            image: { uri: "https://images.unsplash.com/photo-1526401281623-7a4b3af2a1c5" },
        },
        {
            name: "Reach",
            artist: "Drae",
            image: { uri: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4" },
        },
    ],
    artists: [
        {
            name: "Sondae",
            artist: "",
            image: { uri: "https://images.unsplash.com/photo-1603415526960-f7e0328d8fdd" },
        },
        {
            name: "Min. Femi Lazarus",
            artist: "",
            image: { uri: "https://images.unsplash.com/photo-1614289371518-9e1a7b9c4d4b" },
        },
        {
            name: "Sondae",
            artist: "",
            image: { uri: "https://images.unsplash.com/photo-1603415526960-f7e0328d8fdd" },
        },
    ],
    churches: [
        {
            name: "The Father’s House Church",
            artist: "",
            image: { uri: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d" },
        },
        {
            name: "Denomination Church",
            artist: "",
            image: { uri: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da" },
        },
        {
            name: "The Father’s House Church",
            artist: "",
            image: { uri: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d" },
        },
    ],
    podcasts: [
        {
            name: "OBA",
            artist: "Femi Lazarus",
            image: { uri: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7" },
        },
        {
            name: "Bordeaux",
            artist: "Drae",
            image: { uri: "https://images.unsplash.com/photo-1485217988980-11786ced9454" },
        },
    ],
};

const Section = ({ title, data }: { title: string; data: any[] }) => (
    <View style={tw`mt-8`}>
        <View style={tw`flex-row justify-between items-center px-4`}>
            <Text style={tw`text-lg font-semibold text-gray-900`}>{title}</Text>
            <TouchableOpacity>
                <Text style={tw`text-sm text-gray-500`}>more</Text>
            </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`mt-3 pl-4`}>
            {data.map((item, index) => (
                <View key={index} style={[tw`mr-4`, { width: 150, height: 200 }]}>
                    <ImageBackground
                        source={item.image}
                        style={tw`flex-1 justify-between py-3 px-2`}
                        imageStyle={{
                            borderBottomLeftRadius: 30,
                            borderTopRightRadius: 30,
                            backgroundColor: "#e0e0e0",
                        }}
                    >
                        {item.artist && (
                            <Text
                                style={tw`text-white text-[16px] font-extrabold text-left w-2/3`}
                            >
                                {item.name}
                            </Text>
                        )}
                        <View style={tw`w-full flex justify-end items-end`}>
                            <Text style={tw`text-white text-sm font-extrabold text-right w-2/3`}>
                                {item.artist}
                            </Text>
                        </View>
                    </ImageBackground>
                </View>
            ))}
        </ScrollView>
    </View>
);

export default function MoreForYou() {
    return (
        <ScrollView style={tw`flex-1 bg-white`} showsVerticalScrollIndicator={false} overScrollMode="never">
            {/* Header */}
            <View style={tw`px-4 mt-8`}>
                <Text style={tw`text-2xl font-bold text-gray-900`}>More For YOU</Text>
                <Text style={tw`text-gray-500 mt-1`}>
                    We’ve seen your rotation and know this would fit right in
                </Text>
            </View>

            {/* Sections */}
            <Section title="Artists" data={data.artists} />
            <Section title="Songs, Ep’s & Albums" data={data.songs} />
            <Section title="Podcasts" data={data.podcasts} />
            <Section title="Churches & Organizations" data={data.churches} />

            <View style={tw`h-8`} />
        </ScrollView>
    );
}
