export interface AuraTheme {
  schemaVersion: 1;
  id: string;
  name: string;
  description: string;
  wallpaper: { source: 'remote' | 'local' | 'default'; value: string; position: string };
  colors: { background: string; accent: string; accentSoft: string; text: string; muted: string };
  typography: { heading: 'Outfit'; body: 'Manrope'; scale: number; weight: number };
  layout: { cardRadius: number; gridColumns: number; spacing: number };
  effects: { transparency: number; shadowIntensity: number; ambientLighting: number };
  animations: { enabled: boolean; intensity: number };
}

export const DEFAULT_THEME: AuraTheme = {
  schemaVersion: 1,
  id: 'aura-default',
  name: 'AURA Default',
  description: 'The original cinematic experience',
  wallpaper: { source: 'default', value: '', position: 'center 43%' },
  colors: { background: '#07101b', accent: '#b9ddfa', accentSoft: '#54b5ff', text: '#f4f7fb', muted: '#aebed0' },
  typography: { heading: 'Outfit', body: 'Manrope', scale: 1, weight: 700 },
  layout: { cardRadius: 18, gridColumns: 5, spacing: 16 },
  effects: { transparency: 0.76, shadowIntensity: 0.3, ambientLighting: 0.2 },
  animations: { enabled: true, intensity: 0.7 },
};

export const BUILT_IN_THEMES: AuraTheme[] = [
  DEFAULT_THEME,
  { ...DEFAULT_THEME, id: 'midnight-blue', name: 'Midnight Blue', description: 'Cool, calm and minimal', colors: { ...DEFAULT_THEME.colors, accent: '#a9c9e9', accentSoft: '#478fc9' } },
  { ...DEFAULT_THEME, id: 'forest', name: 'Forest', description: 'Deep greens and natural textures', colors: { ...DEFAULT_THEME.colors, accent: '#c1dfd0', accentSoft: '#579b7a' } },
  { ...DEFAULT_THEME, id: 'dusk', name: 'Dusk', description: 'Warm evening gradients', colors: { ...DEFAULT_THEME.colors, accent: '#f0cbb2', accentSoft: '#b77b61' } },
  { ...DEFAULT_THEME, id: 'aurora', name: 'Aurora Glass', description: 'Cool polar light with soft glass surfaces', colors: { ...DEFAULT_THEME.colors, background: '#071522', accent: '#b9f0e8', accentSoft: '#49b8a7' }, effects: { transparency: .68, shadowIntensity: .38, ambientLighting: .34 } },
  { ...DEFAULT_THEME, id: 'obsidian', name: 'Obsidian', description: 'Minimal charcoal with silver highlights', colors: { ...DEFAULT_THEME.colors, background: '#101114', accent: '#e4e7ec', accentSoft: '#8994a3' }, effects: { transparency: .82, shadowIntensity: .45, ambientLighting: .08 } },
  { ...DEFAULT_THEME, id: 'royal-purple', name: 'Royal Purple', description: 'Deep violet cinematic atmosphere', colors: { ...DEFAULT_THEME.colors, background: '#100b20', accent: '#dfc8ff', accentSoft: '#9167d8' } },
  { ...DEFAULT_THEME, id: 'emerald', name: 'Emerald Night', description: 'Rich emerald accents on midnight green', colors: { ...DEFAULT_THEME.colors, background: '#071713', accent: '#c2f0d8', accentSoft: '#35a879' } },
  { ...DEFAULT_THEME, id: 'crimson', name: 'Crimson Cinema', description: 'Warm red highlights for movie nights', colors: { ...DEFAULT_THEME.colors, background: '#180d12', accent: '#ffd1d7', accentSoft: '#cf5369' } },
  { ...DEFAULT_THEME, id: 'arctic', name: 'Arctic Frost', description: 'Bright ice-blue accents and crisp contrast', colors: { ...DEFAULT_THEME.colors, background: '#091522', accent: '#d7f2ff', accentSoft: '#66bce8' } },
];

const HEX = /^#[0-9a-fA-F]{6}$/;
export function validateTheme(input: unknown): input is AuraTheme {
  if (!input || typeof input !== 'object') return false;
  const t = input as Partial<AuraTheme>;
  return t.schemaVersion === 1 && typeof t.id === 'string' && typeof t.name === 'string'
    && !!t.colors && HEX.test(t.colors.background) && HEX.test(t.colors.accent)
    && HEX.test(t.colors.accentSoft) && HEX.test(t.colors.text) && HEX.test(t.colors.muted)
    && !!t.layout && Number.isFinite(t.layout.cardRadius) && Number.isFinite(t.layout.gridColumns)
    && !!t.animations && typeof t.animations.enabled === 'boolean';
}
