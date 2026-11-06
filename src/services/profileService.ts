import { storage } from './storage';

export interface AuraProfile { id: string; name: string; detail: string; letter: string; gradient: string; createdAt: string }
const DEFAULT_PROFILES: AuraProfile[] = [
  { id: 'rudra', name: 'Rudra', detail: 'Personal profile', letter: 'R', gradient: 'profile-rudra', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'family', name: 'Family', detail: 'Shared watchlist', letter: '✿', gradient: 'profile-family', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'guests', name: 'Guests', detail: 'Temporary viewing', letter: 'G', gradient: 'profile-guest', createdAt: '2026-01-01T00:00:00.000Z' },
];
export function getProfiles(): AuraProfile[] {
  const profiles = storage.read<unknown>('profiles', DEFAULT_PROFILES);
  return Array.isArray(profiles) && profiles.every(p => p && typeof p.id === 'string' && typeof p.name === 'string') ? profiles : DEFAULT_PROFILES;
}
export function saveProfiles(profiles: AuraProfile[]): void { storage.write('profiles', profiles); }
export function getActiveProfileId(): string {
  const profiles = getProfiles();
  const saved = storage.read<string>('active-profile', 'rudra');
  return profiles.some(profile => profile.id === saved) ? saved : (profiles[0]?.id ?? '');
}
export function saveActiveProfile(id: string): void { storage.write('active-profile', id); }
