# Music Player Migration to React Native Track Player

## Overview
The music player has been successfully migrated from Expo's Audio API to `react-native-track-player`, which provides:
- ✅ **Background playback** - Music continues playing when the app is in the background
- ✅ **Notification controls** - Play/pause/skip from the system notification
- ✅ **Lock screen controls** - Full playback controls on the lock screen
- ✅ **Native performance** - Better audio performance and stability
- ✅ **Cross-platform** - Works on both iOS and Android

## Changes Made

### 1. **Installed Dependencies**
- Added `react-native-track-player@^4.1.2` to the project
- Configured native iOS pods

### 2. **Created TrackPlayer Service** (`/services/trackPlayerService.ts`)
- Setup function to initialize TrackPlayer
- Playback service with remote control event listeners
- Configuration for background playback and notification controls

### 3. **Refactored AudioContext** (`/contexts/AudioContext.tsx`)
- Replaced Expo Audio with TrackPlayer APIs
- Maintained the same interface for backward compatibility
- Added hooks: `usePlaybackState`, `useProgress`, `useActiveTrack`
- Implemented queue management for tracks

### 4. **Updated Components**
- **MiniPlayer** (`/components/musicPlayer/Miniplayer.tsx`)
  - Connected to TrackPlayer via AudioContext
  - Real-time progress updates
  
- **MusicPlayer** (`/components/musicPlayer/MusicPlayer.tsx`)
  - Full player controls
  - Slider for seeking
  - Shuffle and repeat modes

### 5. **Simplified Hooks**
- **useAudioPlayer** (`/utils/useAudioPlayer.ts`)
  - Now simply re-exports AudioContext for backward compatibility
  
- **Removed** `musicThread.tsx` (deprecated Expo Audio implementation)

### 6. **Platform Configuration**

#### Android (`/android/app/src/main/AndroidManifest.xml`)
- Added permissions:
  - `FOREGROUND_SERVICE` - For background audio service
  - `WAKE_LOCK` - To keep CPU awake during playback
- Added TrackPlayer service declaration with `mediaPlayback` foreground service type

#### iOS (`/ios/apostle/Info.plist`)
- Added `UIBackgroundModes`:
  - `audio` - For background audio playback
  - `processing` - For audio processing tasks

### 7. **App Initialization** (`/app/_layout.tsx`)
- Added TrackPlayer setup on app start
- Configured playback options

### 8. **Service Registration** (`/index.js`)
- Registered TrackPlayer playback service before app initialization

## How to Use

### Playing a Song
```typescript
import { useAudio } from '@/contexts/AudioContext';

const MyComponent = () => {
  const { playPauseSong } = useAudio();
  
  const handlePlay = () => {
    playPauseSong({
      trackId: 'unique-id',
      title: 'Song Title',
      author: 'Artist Name',
      trackImg: 'https://image-url.com/cover.jpg',
      previewUrl: 'https://audio-url.com/song.mp3'
    });
  };
  
  return <Button onPress={handlePlay}>Play</Button>;
};
```

### Accessing Player State
```typescript
const {
  currentSong,      // Currently playing song
  isPlaying,        // Playback state
  progress,         // Current position (milliseconds)
  duration,         // Track duration (milliseconds)
  isShuffle,        // Shuffle state
  isRepeat,         // Repeat state
  handlePrev,       // Previous track
  handleNext,       // Next track
  toggleShuffle,    // Toggle shuffle
  toggleRepeat,     // Toggle repeat
  handleSliderChange, // Seek to position
  formatTime        // Format milliseconds to MM:SS
} = useAudio();
```

## Features

### Background Playback
- Music continues when app is backgrounded
- Works with screen locked
- Survives app switching

### Notification Controls
- Play/Pause button
- Skip to next/previous track
- Shows album artwork
- Displays song title and artist

### Lock Screen Controls
- Full playback controls on iOS lock screen
- Android lock screen media controls
- Artwork display

### Advanced Features
- **Queue Management**: Add multiple tracks to queue
- **Repeat Modes**: Off, Track, Queue
- **Shuffle**: Randomize playback order
- **Seeking**: Scrub through tracks
- **Progress Updates**: Real-time position updates

## Testing

### iOS
1. Build the app: `npm run ios` or `expo run:ios`
2. Play a song
3. Lock the device - controls should appear on lock screen
4. Background the app - music should continue
5. Check notification center for media controls

### Android
1. Build the app: `npm run android` or `expo run:android`
2. Play a song
3. Pull down notification shade - media notification should appear
4. Background the app - music should continue
5. Test controls from notification

## Troubleshooting

### iOS Issues
- **No audio in background**: Ensure `UIBackgroundModes` includes `audio` in Info.plist
- **Pods not linking**: Run `npx pod-install` again
- **Build errors**: Clean build folder in Xcode

### Android Issues
- **Service not starting**: Check `AndroidManifest.xml` has service declaration
- **Permissions denied**: Ensure all required permissions are declared
- **Notification not showing**: Verify `FOREGROUND_SERVICE` permission

### Common Issues
- **Track not playing**: Ensure `previewUrl` is a valid audio URL
- **Progress not updating**: Check that `progressUpdateEventInterval` is set in service options
- **Queue issues**: Verify tracks have unique `trackId` values

## Migration Checklist
- [x] Install react-native-track-player
- [x] Create TrackPlayer service
- [x] Refactor AudioContext
- [x] Update all player components
- [x] Configure Android permissions
- [x] Configure iOS background modes
- [x] Remove old Expo Audio code
- [x] Test background playback
- [x] Test notification controls
- [x] Test lock screen controls

## Next Steps (Optional Enhancements)

1. **Queue Management UI**
   - Display full queue
   - Reorder tracks
   - Remove tracks from queue

2. **Playlist Integration**
   - Load playlists into queue
   - Auto-play next track from playlist

3. **Enhanced Shuffle**
   - Implement queue shuffling algorithm
   - Remember shuffle state

4. **Audio Focus**
   - Handle interruptions (phone calls)
   - Duck audio for notifications

5. **Caching**
   - Cache frequently played tracks
   - Offline playback support

6. **Analytics**
   - Track playback events
   - Most played songs

## Resources
- [react-native-track-player Documentation](https://react-native-track-player.js.org/)
- [TrackPlayer API Reference](https://react-native-track-player.js.org/docs/api/)
- [Background Modes Guide](https://react-native-track-player.js.org/docs/basics/background-mode)

## Support
If you encounter issues:
1. Check the TrackPlayer documentation
2. Verify all native configurations are correct
3. Clean and rebuild the app
4. Check device logs for errors
