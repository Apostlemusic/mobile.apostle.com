# Google Play Release Guide for Apostle

This guide outlines the steps to prepare, build, and release the Apostle app to the Google Play Console.

## 1. Prerequisites
- [Google Play Developer Account](https://play.google.com/console/signup)
- [EAS CLI](https://docs.expo.dev/build/setup/) installed (`npm install -g eas-cli`)
- App icon (512x512 PNG) and Feature Graphic (1024x500 PNG) for the store listing.

## 2. Configuration Check

### App Metadata
Ensure `app.json` has the correct values:
- `name`: "Apostles Music"
- `slug`: "apostles" (Matches the EAS project configuration)
- `package`: `com.washwisee.apostle`
- `version`: `1.0.0`
- `icon`: `./assets/images/Apostle-Logo-512.png` (High-resolution 512x512 generated)

### Permissions
The app currently requests:
- `INTERNET`: For streaming music.
- `FOREGROUND_SERVICE`: For background playback.
- `MODIFY_AUDIO_SETTINGS`: For volume control.
- `POST_NOTIFICATIONS`: For playback controls in the notification bar (Android 13+).

## 3. Building for Production

We use EAS (Expo Application Services) to build a signed Android App Bundle (.aab), which is the required format for Google Play.

### Step 1: Configure EAS (If not already done)
```bash
eas build:configure
```

### Step 2: Build the Production AAB
Run the following command to start a production build on Expo's servers:
```bash
eas build --platform android --profile production
```

**Note:** The first time you run this, EAS will ask if you want it to manage your Android Keystore. **Say "Yes"** unless you have an existing keystore you want to use.

### Step 3: Download the Build
Once the build is complete, you will receive a link to download the `.aab` file.

## 4. Google Play Console Steps

1. **Create App**: In the Google Play Console, click "Create app".
2. **Setup**: Complete the "Initial setup" tasks (Privacy policy, App access, Ads, Content rating, etc.).
3. **Internal Testing (Recommended)**:
   - Go to `Testing > Internal testing`.
   - Create a new release and upload the `.aab` file.
   - Add testers (emails) to verify the app on real devices.
4. **Production Release**:
   - Once tested, go to `Release > Production`.
   - Create a new release, select the build from the library, and provide release notes.
   - Click "Review release" and "Start rollout to Production".

## 5. Troubleshooting

### Permission Issues
If Google Play rejects the app due to sensitive permissions:
- Ensure you have a clear Privacy Policy URL.
- If `RECORD_AUDIO` or `CAMERA` are present but not used, remove them from `AndroidManifest.xml`.

### Versioning
If you get a "Version code already used" error:
- Increment the `versionCode` in `app.json` (under `android` section) or let EAS handle it via `autoIncrement: true` in `eas.json`.

---
*Prepared by Antigravity*
