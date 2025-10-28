import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';

const albums = [
    {
        id: 1,
        title: "He Is Amazing",
        artist: "Samuel Agboyega",
        image: require('../../assets/images/album-cover.jpg'), // Replace with your image path
    },
    {
        id: 2,
        title: "Symphony's Mix, Vol 1",
        artist: "Heaven's Symphony",
        image: require('../../assets/images/album-cover.jpg'), // Replace with your image path
    },
    {
        id: 3,
        title: "OBA",
        artist: "Samuel Agboyega",
        image: require('../../assets/images/album-cover.jpg'), // Replace with your image path
    },
    {
        id: 4,
        title: "Another Album",
        artist: "Samuel Agboyega",
        image: require('../../assets/images/album-cover.jpg'), // Replace with your image path
    },
];

export default function TopHitsThisWeek() {
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
                {albums.map((album, index) => (
                    <ImageBackground
                        key={album.id}
                        source={album.image}
                        style={[tw`w-[150px] h-[220px] overflow-hidden shadow-lg mr-6`,
                        
                        ]}
                        imageStyle={{ borderBottomLeftRadius: 30, borderTopRightRadius: 30 }}
                    >
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                            style={[tw`w-[150px] h-[220px] overflow-hidden p-3 shadow-lg`,
                            { borderBottomLeftRadius: 30, borderTopRightRadius: 30 }
                            ]}
                        >
                            {/* Artist & Title */}
                            <Text style={tw`text-white text-base font-semibold mb-1 w-full`}>{album.artist}</Text>
                            <Text style={tw`text-white text-lg font-semibold absolute bottom-3 right-2 w-full text-center`}>{album.title}</Text>
                        </LinearGradient>
                    </ImageBackground>

                ))}
            </ScrollView>
        </View>
    );
}