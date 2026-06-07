# Installation Guide

## Prerequisites

### Required Software
- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- **Git** (for cloning the repository)

### For Android Development
- **Android Studio** 2023 or higher
- **JDK** 17
- **Android SDK** API 34

## Quick Start (Web Only)

### Step 1: Clone Repository
```bash
git clone https://github.com/haiderfxbot-ai/sky-legends-runner-pro.git
cd sky-legends-runner-pro
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm start
```

### Step 4: Open in Browser
Navigate to: `http://localhost:8080`

## Android Development Setup

### Step 1: Install Android Studio
Download and install Android Studio from https://developer.android.com/studio

### Step 2: Install Java JDK 17
```bash
# Ubuntu/Debian
sudo apt install openjdk-17-jdk

# macOS (using Homebrew)
brew install openjdk@17
```

### Step 3: Initialize Capacitor
```bash
npx cap init "Sky Legends Runner" "com.skylegends.runner" --web-dir .
```

### Step 4: Add Android Platform
```bash
npx cap add android
```

### Step 5: Sync Project
```bash
npx cap sync android
```

### Step 6: Open in Android Studio
```bash
npx cap open android
```

### Step 7: Build APK
```bash
cd android
./gradlew assembleDebug
```

The APK will be generated at:
`android/app/build/outputs/apk/debug/app-debug.apk`

## Production Build

### Debug APK
```bash
cd android
./gradlew assembleDebug
```

### Release APK
```bash
cd android
./gradlew assembleRelease
```

### Release AAB (for Google Play)
```bash
cd android
./gradlew bundleRelease
```

## CI/CD Pipeline

The project includes GitHub Actions workflow for automated builds:

1. Push to `main` or `develop` branch
2. Workflow automatically:
   - Installs dependencies
   - Builds Android APK and AAB
   - Uploads artifacts
3. On release creation:
   - Downloads build artifacts
   - Creates GitHub Release
   - Attaches APK to release

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Or use different port
npx http-server -p 3000
```

#### Android Build Fails
```bash
# Clean build
cd android
./gradlew clean
./gradlew assembleDebug
```

#### Capacitor Sync Issues
```bash
# Remove and re-add Android
npx cap remove android
npx cap add android
npx cap sync
```

#### Node Modules Issues
```bash
# Clear cache and reinstall
rm -rf node_modules
npm cache clean --force
npm install
```

## Development Tools

### Useful Commands
```bash
# Start server
npm start

# Run Android
npx cap run android

# Open Android Studio
npx cap open android

# Sync changes
npx cap sync

# Update Capacitor
npx cap update
```

### Browser Development
1. Open Chrome DevTools
2. Enable device toolbar (Ctrl+Shift+M)
3. Select mobile device
4. Test touch interactions

## Performance Testing

### Chrome DevTools
1. Open Performance tab
2. Record session
3. Check for:
   - Frame drops
   - Memory leaks
   - Long tasks

### Android Profiler
1. Open Android Studio
2. Run app on device
3. Open Profiler tab
4. Monitor CPU, Memory, Network

## Deployment

### Google Play Store
1. Build AAB: `./gradlew bundleRelease`
2. Sign the AAB
3. Upload to Google Play Console
4. Complete store listing
5. Submit for review

### Direct APK Distribution
1. Build APK: `./gradlew assembleRelease`
2. Sign the APK
3. Distribute via website or file sharing
4. Users enable "Install from unknown sources"
