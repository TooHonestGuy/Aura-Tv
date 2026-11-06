# AURA TV V1.1 — Browser Preview + Android TV bridge

## Run in browser

```bash
npm install
npm run dev
```

Open the Vite URL. App shortcuts open websites in a new tab. Profiles, profile PIN hashes, apps, theme and settings are stored locally in this browser. Local media file object URLs last only for the current session. Theme export/import currently uses validated JSON files. Backup/restore uses a versioned JSON package.

## Build browser production bundle

```bash
npm run build
npm run preview
```

## Android APK via GitHub Actions

Push this repository to GitHub (default branch `main`), then open **Actions → Build AURA TV Android APK → Run workflow**. The workflow builds the web bundle, creates the Capacitor Android project on the GitHub runner and uploads a debug APK artifact.

Download the artifact from the completed workflow run. It is a Capacitor Android app with a small native bridge for installed-app discovery and launching. It is not yet a complete system-level replacement for every OEM launcher feature; validate the HOME role and remote on the target TV.

## Browser limitations

- AURA TV cannot enumerate desktop or Android installed apps from a normal browser. Add web shortcuts in Apps.
- Local media object URLs are session-only and need to be re-added after refresh.
- Weather, voice search, cloud sync and LAN pairing are not included in this browser build.
- Profile PIN is a local convenience lock; salted SHA-256 hashing is a convenience lock, not a replacement for Android secure storage.

## Data

Use **Settings → Data management → Export backup** to download local profiles, shortcuts, theme and settings. Keep a copy before clearing browser data.


## Android TV native integration (included in this source)

The GitHub Actions workflow creates the Capacitor Android project, then applies `native/android/patch-android.py`. The patch adds:
- A native `AuraApps` Capacitor plugin that queries Android `MAIN/LAUNCHER` and `LEANBACK_LAUNCHER` activities.
- App labels and actual installed launcher icons returned as PNG data URLs.
- Launching apps with Android package launch intents.
- A HOME + DEFAULT intent filter so Android can offer AURA TV as a home app where the device permits third-party launchers.
- Package visibility `<queries>` for launcher activities.

The app list is based on launchable activities, not every internal Android package/service. Some OEMs restrict visibility or home replacement; test on the actual TV. Android's own Home button remains system-owned.

The D-pad uses the WebView's keyboard events and the Capacitor App back-button event. The player maps left/right to seek and OK/Enter to play/pause. The Android TV remote must still be validated on the target device.

## Notifications and media

The bell opens an in-app AURA activity center and stores recent launcher actions locally. It does not read or intercept Android system notifications. The Library player uses the browser/WebView media element for user-selected local audio/video files; it is not a system-wide media catalog.


## V1.1 updates
- 10 ready-made themes and expanded live customization controls.
- Browser shortcut logo glyphs, plus real Android app icons from PackageManager in APK.
- In-app notification/activity center with clear-all.
- Dedicated audio/video player modal with D-pad seek/play-pause behavior.
- Android installed app discovery via launcher/Leanback intents, filtering known Android/OEM infrastructure packages.
- Android app launch via Leanback launch intent with normal launch-intent fallback.
- Android HOME intent filter and TV banner.


## V1.1.1 Theme Studio fix
- Moved the live customization editor above the preset theme cards so it is immediately visible.
- Connected theme colors to navigation, focus states, app cards, surfaces, text, and highlights.
- Connected card transparency, shadow intensity, spacing, font scale, ambient lighting, and corner radius to rendered UI.
- Connected wallpaper URL/upload selection to the cinematic background image.
- Theme edits continue to save to local browser storage and apply immediately.


## V1.1.2 GitHub Actions APK build

1. Upload/push this complete project to a GitHub repository on the `main` branch.
2. Open the repository's Actions tab.
3. Select **Build AURA TV Android APK**.
4. Click **Run workflow** (or push a commit to `main`).
5. Open the completed run and download the `aura-tv-debug-apk` artifact.
6. Extract the artifact ZIP; it contains `app-debug.apk`.

The workflow uses Node 20 and Java 17, builds the web app, generates the Capacitor Android project, applies the native Android bridge, syncs Capacitor, and builds a debug APK.

This is an unsigned/debug APK for device testing, not a Play Store release APK. No signing secrets are required for this debug build.
