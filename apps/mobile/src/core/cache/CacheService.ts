import AsyncStorage from '@react-native-async-storage/async-storage';

type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

const TTL = {
  SHORT: 5 * 60 * 1000,
  MEDIUM: 15 * 60 * 1000,
  LONG: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
} as const;

const PREFIX = '@seouup:cache:';

async function set<T>(key: string, data: T, ttlMs: number): Promise<void> {
  const entry: CacheEntry<T> = { data, expiresAt: Date.now() + ttlMs };
  await AsyncStorage.setItem(PREFIX + key, JSON.stringify(entry));
}

async function get<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(PREFIX + key);
  if (!raw) return null;
  const entry: CacheEntry<T> = JSON.parse(raw);
  if (Date.now() > entry.expiresAt) {
    await AsyncStorage.removeItem(PREFIX + key);
    return null;
  }
  return entry.data;
}

async function getStale<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(PREFIX + key);
  if (!raw) return null;
  const entry: CacheEntry<T> = JSON.parse(raw);
  return entry.data;
}

async function invalidate(key: string): Promise<void> {
  await AsyncStorage.removeItem(PREFIX + key);
}

async function invalidatePrefix(keyPrefix: string): Promise<void> {
  const allKeys = await AsyncStorage.getAllKeys();
  const matching = allKeys.filter((k) => k.startsWith(PREFIX + keyPrefix));
  if (matching.length > 0) await AsyncStorage.multiRemove(matching);
}

async function prefetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number,
): Promise<void> {
  const existing = await AsyncStorage.getItem(PREFIX + key);
  if (existing) {
    const entry: CacheEntry<T> = JSON.parse(existing);
    const remaining = entry.expiresAt - Date.now();
    if (remaining > ttlMs * 0.3) return;
  }
  try {
    const data = await fetcher();
    await set(key, data, ttlMs);
  } catch {
  }
}

export const CacheService = { set, get, getStale, invalidate, invalidatePrefix, prefetch, TTL };
