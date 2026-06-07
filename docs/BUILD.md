# Build Guide

## Development Build

### Web Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Server runs at http://localhost:8080
```

### Android Development
```bash
# Install dependencies
npm install

# Initialize Capacitor (first time only)
npx cap add android

# Sync web assets to Android
npx cap sync android

# Open in Android Studio
npx cap open android
```

## Production Build

### Web (Static Files)
The project is a static site. Simply serve the root directory with any web server.

```bash
# Using http-server
npx http-server -p 8080 -c-1

# Using Python
python -m http.server 8080
```

### Android APK (Debug)
```bash
cd android
chmod +x gradlew
./gradlew assembleDebug
```
Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### Android APK (Release)
```bash
cd android
./gradlew assembleRelease
```
Output: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

### Android AAB (Google Play)
```bash
cd android
./gradlew bundleRelease
```
Output: `android/app/build/outputs/bundle/release/app-release.aab`

## Signing APK/AAB

### Generate Keystore
```bash
keytool -genkey -v -keystore sky-legends-release.keystore \
  -alias sky-legends -keyalg RSA -keysize 2048 -validity 10000
```

### Configure Signing
In `android/app/build.gradle`, add:
```groovy
android {
    signingConfigs {
        release {
            storeFile file('sky-legends-release.keystore')
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias 'sky-legends'
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### Sign APK
```bash
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore sky-legends-release.keystore \
  app-release-unsigned.apk sky-legends

zipalign -v 4 app-release-unsigned.apk sky-legends-runner.apk
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/android-build.yml`) automates:

1. **Build Job**
   - Installs Node.js and Java
   - Installs npm dependencies
   - Adds Android platform
   - Syncs Capacitor
   - Builds Debug APK
   - Builds Release APK
   - Builds Release AAB
   - Uploads all artifacts

2. **Release Job** (on release creation)
   - Downloads artifacts
   - Creates GitHub Release
   - Attaches APK and AAB

### Triggering Builds
- **Push to main/develop**: Builds debug and release
- **Pull request**: Builds debug
- **Release creation**: Builds and creates GitHub Release

### Environment Variables
No secrets required for basic builds. For signed releases, add:
- `KEYSTORE_PASSWORD`
- `KEY_PASSWORD`

## Performance Optimization

### Build Optimization
```bash
# Clean builds
cd android && ./gradlew clean

# Remove unused resources
cd android && ./gradlew shrinkReleaseRes
```

### Asset Optimization
- Use WebP images for smaller file size
- Compress audio files
- Minify JavaScript (optional)

## Testing

### Local Testing
```bash
# Start server
npm start

# Open browser DevTools
# Enable device mode
# Test on various screen sizes
```

### Device Testing
```bash
# Run on connected device
npx cap run android

# Run on specific device
npx cap run android -d <device-id>
```

## Troubleshooting

### Build Fails
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx cap sync android
cd android
./gradlew assembleDebug
```

### Gradle Issues
```bash
# Update Gradle
cd android
./gradlew wrapper --gradle-version 8.4

# Or use Gradle daemon
./gradlew --stop
./gradlew assembleDebug
```

### Memory Issues
```bash
# Increase heap size in android/gradle.properties
org.gradle.jvmargs=-Xmx4096m
```
