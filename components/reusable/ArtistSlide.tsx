import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import tw from 'twrnc';

const { width } = Dimensions.get('window');

export default function ArtistProfileCard() {
    return (
        <View style={tw`relative flex flex-row justify-end items-center`}>
            <View style={tw`w-[180px] h-[418px] absolute z-10 left-0 flex justify-center `}>
                <Image
                    source={(require("../../assets/images/artist-description.png"))}
                    style={tw`h-full w-full absolute`}
                />

                <Text style={tw`text-white text-xl font-bold mt-10 ml-2 w-[165px]`}>Sondae</Text>
                <Text style={tw`text-white text-sm font-medium mt-2 ml-2 w-[165px]`}>
                    The Pilgrim, By the water and many more, Sondae’s art and worship to GOD speaks to his listener’s like the psalms of David, Made of steel, Elohim and much more his music...
                </Text>
                <TouchableOpacity style={tw`bg-[#81888852] rounded-[6px] px-10 py-2 mt-4 mb-15 ml-2 w-[140px] items-center justify-center`}>
                    <Text style={tw`text-white text-base font-bold`}>Explore</Text>
                </TouchableOpacity>
            </View>
            <ImageBackground source={(require("../../assets/images/artist-imageholder.png"))} style={tw`h-[418px] w-[330px]`}>

            </ImageBackground>
        </View>
    );
}