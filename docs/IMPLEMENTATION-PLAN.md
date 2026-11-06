# AURA TV technical implementation plan

## Phase 1 — Inspection (completed)
1. Extracted and inventoried the supplied seven-file ZIP.
2. Inspected React/TypeScript entry points, app screens, CSS and Vite/TypeScript configuration.
3. Identified existing screens and all placeholder interactions.
4. Confirmed no Android project, Capacitor integration, persistence layer, or LAN server exists in the archive.

## Phase 2 — Foundation (in progress)
1. Define a versioned shared theme contract (`src/types/theme.ts`).
2. Validate theme payloads before applying them.
3. Add a namespaced persistence adapter (`src/services/storage.ts`).
4. Add theme load/save/apply services (`src/services/themeService.ts`).
5. Add profile persistence and active-profile selection (`src/services/profileService.ts`).
6. Later: migrate the adapter to native SQLite/Preferences without changing the domain interfaces.

## Phase 3 — Connect existing UI (in progress)
1. Persist the selected built-in theme and apply its accent, text, background and layout tokens.
2. Persist profile selection.
3. Replace static clock/date with device-local time.
4. Add visible keyboard focus and directional focus movement for desktop preview; validate on an actual Android TV remote later.
5. Next: real profile CRUD, app sorting/favourites, theme editor controls and validated import/export UI.

## Phase 4 — Android integration (not started)
- Add Capacitor Android shell and Kotlin plugin boundary.
- Implement installed-app discovery and launch intents using Android package APIs.
- Implement HOME role/default launcher onboarding where Android permits it.
- Handle Android 11+ package visibility declarations and test on Android 12 TV hardware.
- Verify D-pad, BACK, HOME and MENU behavior on-device.

## Phase 5 — P0 feature completion (not started)
- Real profile CRUD and secure PIN verification (salted password hash; never plaintext).
- App favourites, hidden apps, ordering and categories from installed packages.
- Wallpaper/font/layout controls wired to theme state.
- Safe theme ZIP import/export and schema migration.
- Local backup/restore with validation and integrity checks.
- Screensaver and persistent settings.

## Phase 6 — PC Theme Studio and LAN (P1; not started)
- Reuse the exact theme schema in the PC editor.
- Pairing code/QR and explicit TV-side approval.
- LAN-only HTTP/WebSocket endpoint, short-lived pairing flow and per-device token.
- Validate theme on TV before applying; no public listener by default.

## Acceptance gates
- Existing profile screen, logo, page sections, typography, colors and animation identity remain visually intact.
- Browser build passes TypeScript and Vite production build.
- Every visible control has real behavior or is explicitly labelled unavailable/planned.
- Android-specific claims are only made after tests on target Android 12 TV hardware.
