const PREFIX = 'aura-tv:v1:';

export const storage = {
  read<T>(key: string, fallback: T): T {
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  },
  write<T>(key: string, value: T): void {
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error(`AURA TV could not persist ${key}`, error);
    }
  },
  remove(key: string): void {
    try { window.localStorage.removeItem(PREFIX + key); } catch { /* storage may be unavailable */ }
  },
};
