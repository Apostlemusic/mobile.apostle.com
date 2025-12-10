# Quick Start Guide - Music Player with TrackPlayer

## 🎵 What Changed?

Your music player now uses **react-native-track-player** instead of Expo Audio, giving you:
- Background playback when app is minimized
- Lock screen controls
- Notification media controls
- Better performance and reliability

## 🚀 Getting Started

### 1. Rebuild Your App

The native code has changed, so you need to rebuild:

#### For iOS:
```bash
cd ios
pod install
cd ..
npm run ios
# or
expo run:ios
```

#### For Android:
```bash
npm run android
# or
expo run:android
```

### 2. Test the Features

1. **Play a song** - Tap on any track
2. **Minimize the app** - Music should keep playing
3. **Check notifications** - You should see playback controls
4. **Lock your device** - Controls appear on lock screen

## 🎛️ Using the Player in Your Code

### Basic Usage

```typescript
import { useAudio } from '@/contexts/AudioContext';

function YourComponent() {
  const { playPauseSong, isPlaying, currentSong } = useAudio();
  
  const handlePlaySong = () => {
    playPauseSong({
      trackId: 'song-123',
      title: 'My Song',
      author: 'Artist Name',
      trackImg: 'https://example.com/cover.jpg',
      previewUrl: 'https://example.com/audio.mp3'
    });
  };
  
  return (
    <Button onPress={handlePlaySong}>
      {isPlaying ? 'Pause' : 'Play'}
    </Button>
  );
}
```

### Available Functions

```typescript
const {
  // State
  currentSong,    // The currently playing song
  isPlaying,      // Is audio playing?
  progress,       // Current position in milliseconds
  duration,       // Total track length in milliseconds
  
  // Controls
  playPauseSong,  // Play or pause a song
  handleNext,     // Skip to next track
  handlePrev,     // Go to previous track
  handleSliderChange, // Seek to position (pass milliseconds)
  
  // Features
  toggleShuffle,  // Turn shuffle on/off
  toggleRepeat,   // Turn repeat on/off
  isShuffle,      // Is shuffle enabled?
  isRepeat,       // Is repeat enabled?
  
  // Utilities
  formatTime,     // Format milliseconds to "MM:SS"
} = useAudio();
```

## 🔧 Troubleshooting

### iOS: No sound in background
- Make sure you rebuilt the app after the migration
- Check Settings → Your App → Background App Refresh is enabled

### Android: Notification not showing
- Rebuild the app
- Check notification permissions are enabled

### General: Track won't play
- Ensure `previewUrl` is a direct link to an audio file
- Check the URL is accessible (not blocked by CORS)
- Look for errors in the console

## 📱 Testing Checklist

- [ ] Song plays when tapped
- [ ] Play/pause button works
- [ ] Next/previous buttons work
- [ ] Progress bar updates
- [ ] Seeking (scrubbing) works
- [ ] Background playback works
- [ ] Lock screen controls appear
- [ ] Notification controls work
- [ ] Multiple songs can be queued

## 🎨 UI Components

### MiniPlayer
Small player at bottom of screen when a song is playing.

### MusicPlayer
Full-screen player with:
- Album artwork
- Song info
- Progress slider
- Playback controls
- Shuffle/repeat buttons

## 💡 Tips

1. **Song Objects**: Every song needs a unique `trackId`
2. **Audio URLs**: Must be direct links to audio files (MP3, M4A, etc.)
3. **Images**: Album art URLs should be square for best appearance
4. **Queue**: Songs are automatically added to the queue when played

## 📚 Need Help?

See the full migration guide: `MUSIC_PLAYER_MIGRATION.md`

## 🎉 That's It!

Your music player is now ready with native background playback support!
