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

// In-memory cache layer for instant reads (avoids AsyncStorage I/O)
const memoryCache = new Map<string, CacheEntry<unknown>>();
const MAX_MEMORY_ENTRIES = 50;

function evictMemoryIfNeeded() {
  if (memoryCache.size <= MAX_MEMORY_ENTRIES) return;
  const oldest = [...memoryCache.entries()]
    .sort((a, b) => a[1].expiresAt - b[1].expiresAt)
    .slice(0, memoryCache.size - MAX_MEMORY_ENTRIES);
  oldest.forEach(([key]) => memoryCache.delete(key));
}

async function set<T>(key: string, data: T, ttlMs: number): Promise<void> {
  const entry: CacheEntry<T> = { data, expiresAt: Date.now() + ttlMs };
  memoryCache.set(key, entry as CacheEntry<unknown>);
  evictMemoryIfNeeded();
  await AsyncStorage.setItem(PREFIX + key, JSON.stringify(entry));
}

async function get<T>(key: string): Promise<T | null> {
  // Try memory first
  const mem = memoryCache.get(key);
  if (mem) {
    if (Date.now() <= mem.expiresAt) return mem.data as T;
    memoryCache.delete(key);
  }

  // Fall back to AsyncStorage
  const raw = await AsyncStorage.getItem(PREFIX + key);
  if (!raw) return null;
  const entry: CacheEntry<T> = JSON.parse(raw);
  if (Date.now() > entry.expiresAt) {
    await AsyncStorage.removeItem(PREFIX + key);
    return null;
  }
  // Promote to memory
  memoryCache.set(key, entry as CacheEntry<unknown>);
  return entry.data;
}

async function getStale<T>(key: string): Promise<T | null> {
  const mem = memoryCache.get(key);
  if (mem) return mem.data as T;

  const raw = await AsyncStorage.getItem(PREFIX + key);
  if (!raw) return null;
  const entry: CacheEntry<T> = JSON.parse(raw);
  return entry.data;
}

async function invalidate(key: string): Promise<void> {
  memoryCache.delete(key);
  await AsyncStorage.removeItem(PREFIX + key);
}

async function invalidatePrefix(keyPrefix: string): Promise<void> {
  // Clear memory
  [...memoryCache.keys()]
    .filter((k) => k.startsWith(keyPrefix))
    .forEach((k) => memoryCache.delete(k));

  // Clear AsyncStorage
  const allKeys = await AsyncStorage.getAllKeys();
  const matching = allKeys.filter((k) => k.startsWith(PREFIX + keyPrefix));
  if (matching.length > 0) await AsyncStorage.multiRemove(matching);
}

async function prefetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number,
): Promise<void> {
  // Check memory first
  const mem = memoryCache.get(key);
  if (mem) {
    const remaining = mem.expiresAt - Date.now();
    if (remaining > ttlMs * 0.3) return;
  }

  const existing = await AsyncStorage.getItem(PREFIX + key);
  if (existing) {
    const entry: CacheEntry<T> = JSON.parse(existing);
    const remaining = entry.expiresAt - Date.now();
    if (remaining > ttlMs * 0.3) {
      // Promote to memory
      memoryCache.set(key, entry as CacheEntry<unknown>);
      return;
    }
  }

  try {
    const data = await fetcher();
    await set(key, data, ttlMs);
  } catch {}
}

function clearMemory(): void {
  memoryCache.clear();
}

export const CacheService = {
  set,
  get,
  getStale,
  invalidate,
  invalidatePrefix,
  prefetch,
  clearMemory,
  TTL,
};
