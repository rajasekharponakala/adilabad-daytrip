# Android field guide

The Android pilot uses native app chrome, five bottom-navigation destinations and a packaged WebView edition of the atlas. Guides, credited photos, heritage notes, saved items, route calculations, and the seven interactive exhibits work on device. Source and external map links open in your browser. Fieldday requests no location or internet permission. Use a maintained Android System WebView for the interactive content.

## Install

Download `fieldday-india-android.apk` from the Android pilot release, open it on Android 8.0 or newer and approve installation for that download source if prompted. The `SHA256SUMS` file verifies the exact download. The APK is a debug-signed pilot for direct installation; store distribution and upgrades with a persistent production signing key are separate release steps. CI debug signatures can differ between builds; uninstalling an older pilot to install a new one removes its saved items.

## Build and test

The [Android APK workflow](../.github/workflows/android.yml) builds on main changes, pull requests and manual runs. It runs the web data tests, builds the site, copies the static content to generated Android assets, then uses the pinned Gradle wrapper to compile the app. It verifies the APK signature, uploads the APK and checksum, and exercises the app on an Android 15 emulator.

For a local build, install Node 22, JDK 17, Android SDK platform 35 and build tools 35.0.0. Set `ANDROID_HOME`, then run:

```sh
npm ci
npm run build
cd android
./gradlew :app:assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
# With an Android emulator or device connected:
./gradlew :app:connectedDebugAndroidTest
```

For a GitHub-hosted build, run `gh workflow run android.yml --ref main`. Download the completed workflow's `fieldday-india-android` artifact. The separate `android-device-test-results` artifact contains the device test report.
