import { BUILT_IN_THEMES, DEFAULT_THEME, validateTheme, type AuraTheme } from '../types/theme';
import { storage } from './storage';

const KEY = 'active-theme';
export function getActiveTheme(): AuraTheme {
  const saved = storage.read<unknown>(KEY, DEFAULT_THEME);
  return validateTheme(saved) ? saved : DEFAULT_THEME;
}
export function saveActiveTheme(theme: AuraTheme): void {
  if (!validateTheme(theme)) throw new Error('Invalid AURA theme');
  storage.write(KEY, theme);
}
export function getBuiltInTheme(name: string): AuraTheme {
  return BUILT_IN_THEMES.find(theme => theme.name === name) ?? DEFAULT_THEME;
}
export function applyTheme(theme: AuraTheme): void {
  const root = document.documentElement;
  root.style.setProperty('--aura-bg', theme.colors.background);
  root.style.setProperty('--ice', theme.colors.accent);
  root.style.setProperty('--blue', theme.colors.accentSoft);
  root.style.setProperty('--aura-text', theme.colors.text);
  root.style.setProperty('--aura-muted', theme.colors.muted);
  root.style.setProperty('--muted', theme.colors.muted);
  root.style.setProperty('--aura-card-radius', `${theme.layout.cardRadius}px`);
  root.style.setProperty('--aura-card-alpha', String(theme.effects.transparency));
  root.style.setProperty('--aura-shadow', String(theme.effects.shadowIntensity));
  root.style.setProperty('--aura-grid-columns', String(theme.layout.gridColumns));
  root.style.setProperty('--aura-spacing', `${theme.layout.spacing}px`);
  root.style.setProperty('--aura-type-scale', String(theme.typography.scale));
  root.style.setProperty('--aura-font-scale', `${theme.typography.scale * 100}%`);
  root.style.setProperty('--aura-ambient', String(theme.effects.ambientLighting));
  root.style.setProperty('--aura-accent', theme.colors.accent);
  root.style.setProperty('--aura-accent-soft', theme.colors.accentSoft);
  root.style.setProperty('--aura-wallpaper-position', theme.wallpaper.position || 'center 43%');
  const wallpaper = theme.wallpaper.source === 'default' || !theme.wallpaper.value
    ? 'url("https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2400&q=90")'
    : `url("${theme.wallpaper.value.replace(/["\\\\]/g, '')}")`;
  root.style.setProperty('--aura-wallpaper-image', wallpaper);

  root.style.setProperty('--aura-motion-duration', theme.animations.enabled ? `${Math.max(.08, 0.25 / Math.max(.2, theme.animations.intensity))}s` : '0.01ms');
  root.dataset.theme = theme.id;
}
