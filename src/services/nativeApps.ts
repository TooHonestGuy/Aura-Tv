import { Capacitor, registerPlugin } from '@capacitor/core';

export interface InstalledAuraApp {
  packageName: string;
  name: string;
  iconDataUrl?: string;
  isSystem: boolean;
}

interface AuraAppsPlugin {
  getInstalledApps(options?: { includeSystem?: boolean }): Promise<{ apps: InstalledAuraApp[] }>;
  launchApp(options: { packageName: string }): Promise<{ launched: boolean }>;
}

const AuraApps = registerPlugin<AuraAppsPlugin>('AuraApps');

export async function getNativeInstalledApps(includeSystem = false): Promise<InstalledAuraApp[]> {
  if (!Capacitor.isNativePlatform()) return [];
  const result = await AuraApps.getInstalledApps({ includeSystem });
  return result.apps ?? [];
}

export async function launchNativeApp(packageName: string): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  const result = await AuraApps.launchApp({ packageName });
  return !!result.launched;
}

export const isNativeAura = () => Capacitor.isNativePlatform();
