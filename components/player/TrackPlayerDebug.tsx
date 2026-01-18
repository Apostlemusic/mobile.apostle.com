import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import tw from "twrnc";
import { initTrackPlayer, simplePlayUrl } from "@/services/trackPlayerService";
import { usePlayer } from "../player/PlayerContext";

const TrackPlayerDebug: React.FC = () => {
  const [id, setId] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const { playById, playPauseToggle, next, previous } = usePlayer();

  const append = (s: string) => setLogs((l) => [s, ...l].slice(0, 200));

  return (
    <ScrollView style={tw`p-4 bg-white dark:bg-[#0b0b10]`}>
      <Text style={tw`text-lg font-bold mb-3 text-black dark:text-gray-100`}>TrackPlayer Debug</Text>

      <TouchableOpacity
        style={tw`bg-blue-500 p-3 rounded mb-2`}
        onPress={async () => {
          append("Running initTrackPlayer()...");
          try {
            await initTrackPlayer();
            append("initTrackPlayer -> done");
          } catch (err: unknown) {
            append(`initTrackPlayer error: ${String(err)}`);
          }
        }}
      >
        <Text style={tw`text-white text-center`}>initTrackPlayer()</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-gray-800 p-3 rounded mb-2`}
        onPress={async () => {
          append("Toggling play/pause...");
          await playPauseToggle();
        }}
      >
        <Text style={tw`text-white text-center`}>Play / Pause</Text>
      </TouchableOpacity>

      <View style={tw`flex-row gap-2 mb-2`}>
        <TouchableOpacity
          style={tw`flex-1 bg-gray-700 p-3 rounded`}
          onPress={async () => {
            append("Previous track...");
            await previous();
          }}
        >
          <Text style={tw`text-white text-center`}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-1 bg-gray-700 p-3 rounded`}
          onPress={async () => {
            append("Next track...");
            await next();
          }}
        >
          <Text style={tw`text-white text-center`}>Next</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={tw`bg-green-600 p-3 rounded mb-4`}
        onPress={async () => {
          append("Playing sample track...");
          try {
            await initTrackPlayer();
            await simplePlayUrl("https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3", {
              id: "sample-1",
              title: "Sample MP3",
              artist: "File Examples",
              artwork: "https://via.placeholder.com/300",
            });
            append("Sample track playing");
          } catch (err: unknown) {
            append(`sample play error: ${String(err)}`);
          }
        }}
      >
        <Text style={tw`text-white text-center`}>Play Sample Track</Text>
      </TouchableOpacity>

      <View style={tw`mb-4`}>
        <Text style={tw`font-semibold mb-2 text-black dark:text-gray-100`}>Play by Mongo ID</Text>
        <TextInput
          value={id}
          onChangeText={setId}
          placeholder="Track _id"
          placeholderTextColor="#9ca3af"
          style={tw`border border-gray-200 dark:border-[#2d2d35] rounded px-3 py-2 text-black dark:text-gray-100 mb-2`}
        />
        <TouchableOpacity
          style={tw`bg-blue-600 p-3 rounded`}
          onPress={async () => {
            if (!id.trim()) return;
            append(`Play by ID: ${id}`);
            await playById(id.trim());
          }}
        >
          <Text style={tw`text-white text-center`}>Play by ID</Text>
        </TouchableOpacity>
      </View>

      <Text style={tw`font-semibold mb-2 text-black dark:text-gray-100`}>Logs</Text>
      {logs.map((l, i) => (
        <Text key={i} style={tw`text-sm text-gray-800 dark:text-gray-300 mb-1`}>- {l}</Text>
      ))}
    </ScrollView>
  );
};

export default TrackPlayerDebug;
