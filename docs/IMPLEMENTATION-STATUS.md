# AURA TV implementation status

## Inspected baseline (V0.2)
- React 18 + TypeScript + Vite 6 + Lucide React.
- Single `App.tsx` contains page routing, sample app/media/theme/profile data, and all screen components.
- `styles.css` contains the locked cinematic dark-glass visual system, profile overlay, responsive breakpoints, and reduced-motion handling.
- The baseline is a browser UI prototype: app launching, installed-app discovery, persistent profiles, theme application, import/export, native Android, and LAN sync were not implemented.

## Phase 2 foundation added
- `src/types/theme.ts`: versioned theme contract, built-in themes, and basic validation.
- `src/services/storage.ts`: namespaced, guarded localStorage adapter for browser preview.
- `src/services/themeService.ts`: theme load/save and CSS-variable application.
- `src/services/profileService.ts`: profile persistence and active-profile selection.

## Phase 3 UI wiring added
- Theme selection now persists and applies shared CSS tokens.
- Profile selection persists between browser refreshes.
- Home clock/date now use device-local time instead of a fixed timestamp.
- Arrow keys move focus spatially through visible controls; Escape/Backspace closes the profile overlay; Home and F1 retain the original shortcuts.
- Added a clear `:focus-visible` treatment for remote/keyboard navigation.

## Not yet implemented
- Actual installed Android app enumeration/launching, profile CRUD/PINs, full Theme Studio controls, theme ZIP import/export UI, backup/restore, screensaver, voice, Android HOME role, native database, PC Theme Studio and LAN pairing.

## Platform boundary
The browser preview can persist UI preferences in localStorage. It cannot enumerate or launch Android packages, set itself as the HOME app, access Android system settings, or guarantee offline speech recognition. Those require a native Android layer (Capacitor plus a Kotlin plugin/native shell) and device testing.

## Verification
- The new theme and storage modules pass standalone strict TypeScript compilation.
- Full Vite build remains unverified because dependencies were not installed: `npm install` timed out in this environment. Run `npm install` and `npm run build` on the development PC.
