# ⚡ Quick Reference - Development Build Commands

## 🚨 CRITICAL - Commands You MUST Use

### ❌ DON'T USE THESE (They won't work anymore):
```bash
expo start          # ❌ Will cause "requireNativeComponent" errors
yarn start          # ❌ Same problem
npm start           # ❌ Same problem
```

### ✅ USE THESE INSTEAD:

#### First Time Build (or after native changes):
```bash
# iOS (if you have Xcode)
npx expo run:ios

# Android (if you have Android Studio)
npx expo run:android
```

**This builds and installs your custom development build**
- Takes 5-10 minutes first time
- Installs an app on your simulator/device
- Only needed once, or when you change native code

---

#### Daily Development:
```bash
npx expo start --dev-client
```

**Then open the app that was installed by `expo run:ios`**
- NOT Expo Go
- Your custom development build
- Fast Refresh works!

---

## 📱 What You'll See

### After `npx expo run:ios`:
- App installs on simulator
- Has your app icon
- Opens automatically
- Metro bundler starts

### After `npx expo start --dev-client`:
- Metro bundler starts
- Shows QR code (ignore it for now)
- Manually open your development build app
- App connects to Metro automatically

---

## 🎯 Workflow Summary

```bash
# One-time setup (or after adding native modules)
npx expo run:ios

# Then for daily development
npx expo start --dev-client
# Open your development build app

# Make JavaScript changes → Fast Refresh! ⚡
```

---

## 🐛 Quick Fixes

### "requireNativeComponent not found"
- **Cause:** You used `expo start` instead of `npx expo start --dev-client`
- **Fix:** Kill the server, run `npx expo start --dev-client`, open your dev build app

### "No devices found"
- **Fix:** Open Xcode → Open Developer Tool → Simulator

### App won't connect
- **Fix:** Make sure you opened the **development build app**, not Expo Go

---

## 💡 Remember

1. **Build once** with `npx expo run:ios`
2. **Use daily** with `npx expo start --dev-client`
3. **Rebuild only** when adding native modules

Your app now has:
- ✅ Background audio playback
- ✅ Lock screen controls
- ✅ Notification controls
- ✅ All native features!

---

## 🆘 Still Having Issues?

Make sure:
- [ ] You ran `npx expo run:ios` successfully
- [ ] You're using `npx expo start --dev-client` (not `expo start`)
- [ ] You're opening the installed dev build app (not Expo Go)
- [ ] iOS Simulator is running
