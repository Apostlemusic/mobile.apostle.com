# Building Your App with TrackPlayer - Step by Step Guide

## The Problem
`react-native-track-player` is a **native module** that doesn't work with **Expo Go**. You need to create a **development build** to use it.

## Solution: Build a Development Build

### Option 1: Build Locally (Fastest for Development)

#### Step 1: Clean and Rebuild

```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install

# For iOS - install pods
cd ios && pod install && cd ..
```

#### Step 2: Run the Development Build

**For iOS:**
```bash
npx expo run:ios
```

**For Android:**
```bash
npx expo run:android
```

This command will:
1. Generate the native iOS/Android folders if they don't exist
2. Install all native dependencies
3. Build and install the app on your device/simulator
4. Start the Metro bundler

### Option 2: Use EAS Build (Recommended for Team/Production)

#### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

#### Step 2: Login to Expo
```bash
eas login
```

#### Step 3: Configure EAS Build
```bash
eas build:configure
```

#### Step 4: Create Development Build

**For iOS Simulator:**
```bash
eas build --profile development --platform ios --local
```

**For Android Emulator:**
```bash
eas build --profile development --platform android --local
```

**For Physical Devices:**
```bash
# iOS
eas build --profile development:device --platform ios

# Android  
eas build --profile development:device --platform android
```

#### Step 5: Install the Build
- Download and install the `.ipa` (iOS) or `.apk` (Android) file
- Run `npx expo start --dev-client`

## What's a Development Build?

Think of it like a custom version of Expo Go that includes your native modules (like TrackPlayer). Once built, you can use it just like Expo Go:
- Fast Refresh still works
- You can update JavaScript code without rebuilding
- You only need to rebuild when you add/change native modules

## Quick Commands Reference

```bash
# Start development server for dev build
npx expo start --dev-client

# Build and run locally
npx expo run:ios          # iOS
npx expo run:android      # Android

# Build with EAS
eas build --profile development --platform ios
eas build --profile development --platform android
```

## Troubleshooting

### Error: "Invariant Violation: requireNativeComponent was not found"
This happens when you try to run the app with `expo start` or `npx expo start` instead of using the development build.

**Solution:** You MUST use the development build commands:
```bash
# Build and run (first time, or after native changes)
npx expo run:ios          # For iOS
npx expo run:android      # For Android

# After initial build, start dev server
npx expo start --dev-client
```

**Important:** Regular `expo start` will NOT work because your app now uses native modules (TrackPlayer, LinearGradient, etc.)

### Error: "Cannot find module 'react-native-track-player'"
**Solution:** Make sure you've run `npm install` and the package is properly installed

### Error: "ios folder not found"
**Solution:** Run `npx expo prebuild` or `npx expo run:ios` to generate native folders

### Build fails on iOS
**Solution:**
```bash
cd ios
pod deintegrate
pod install
cd ..
npx expo run:ios
```

### Build fails on Android
**Solution:**
```bash
cd android
./gradlew clean
cd ..
npx expo run:android
```

## After Building

Once your development build is installed:

1. **Don't use Expo Go** - Use your custom development build instead
2. **Don't use `expo start`** - Use `npx expo start --dev-client` instead
3. **Open your app** - Open the installed development build on your device
4. **Enjoy native features** - Background audio, notifications, lock screen controls!

**⚠️ Critical:** Always use `npx expo start --dev-client` to start the dev server, NOT just `expo start` or `yarn start`!

## Do I Need to Rebuild Often?

**NO** - You only need to rebuild when:
- Adding new native modules
- Changing native configuration (AndroidManifest.xml, Info.plist)
- Updating native module versions

For JavaScript changes (99% of development), just save and Fast Refresh works!

## Recommended Workflow

1. **One-time:** Build development build
2. **Daily:** Use `npx expo start --dev-client`  
3. **Rarely:** Rebuild when adding native modules

This gives you the best of both worlds:
- Native features (TrackPlayer)
- Fast development (Fast Refresh)
