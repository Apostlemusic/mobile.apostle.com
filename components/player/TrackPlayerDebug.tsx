import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { setupPlayer, updateOptions, debugStatus } from '@/services/trackPlayerService';
import TrackPlayer from 'react-native-track-player';
import { usePlayer } from '../player/PlayerContext';

const TrackPlayerDebug: React.FC = () => {
  const [id, setId] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const { playById, currentTrack, audioUrl, prevHistory } = usePlayer();

  const append = (s: string) => setLogs((l:any) => [s, ...l].slice(0, 200));

  return (
    <ScrollView style={tw`p-4`}>
      <Text style={tw`text-lg font-bold mb-3`}>TrackPlayer Debug</Text>

      <TouchableOpacity
        style={tw`bg-blue-500 p-3 rounded mb-2`}
        onPress={async () => {
          append('Running setupPlayer()...');
          try {
            const ok = await setupPlayer();
            append(`setupPlayer -> ${ok}`);
          } catch (err: any) {
            append(`setupPlayer error: ${String(err)}`);
          }
        }}
      >
        <Text style={tw`text-white text-center`}>setupPlayer()</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-blue-500 p-3 rounded mb-2`}
        onPress={async () => {
          append('Running updateOptions()...');
          try {
            await updateOptions();
            append('updateOptions -> done');
          } catch (err: any) {
            append(`updateOptions error: ${String(err)}`);
          }
        }}
      >
        <Text style={tw`text-white text-center`}>updateOptions()</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-gray-800 p-3 rounded mb-4`}
        onPress={async () => {
          append('Running debugStatus()...');
          try {
            const out = await debugStatus();
            append(JSON.stringify(out));
          } catch (err: any) {
            append(`debugStatus error: ${String(err)}`);
          }
        }}
      >
        <Text style={tw`text-white text-center`}>debugStatus()</Text>
      </TouchableOpacity>

      <Text style={tw`font-semibold mb-2`}>Logs</Text>
      <TouchableOpacity
        style={tw`bg-green-600 p-3 rounded mb-2`}
        onPress={async () => {
          append('Adding sample track and playing...');
          try {
            // public sample mp3
            const sample = {
              id: 'sample-1',
              url: 'https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3',
              title: 'Sample MP3',
              artist: 'File Examples',
              artwork: 'https://via.placeholder.com/300',
            };
            await setupPlayer();
            await TrackPlayer.reset();
            await TrackPlayer.add(sample as any);
            await TrackPlayer.play();
            append('Sample track playing');
          } catch (err: any) {
            append(`sample play error: ${String(err)}`);
          }
        }}
      >
        <Text style={tw`text-white text-center`}>Play Sample Track</Text>
      </TouchableOpacity>

      <View>
        <input value={id} onChange={(e) => setId(e.target.value)} placeholder="Track ID" />
        <button onClick={() => id && playById(id)}>Play by ID</button>
        <div>Now: {currentTrack?.id} - {currentTrack?.title}</div>
        <div>Audio: {audioUrl ? 'loaded' : 'none'}</div>
        <div>Prev history: {prevHistory.map(t => t.title).join(', ')}</div>
      </View>

      {logs.map((l, i) => (
        <Text key={i} style={tw`text-sm text-gray-800 mb-1`}>- {l}</Text>
      ))}
    </ScrollView>
  );
};

export default TrackPlayerDebug;
