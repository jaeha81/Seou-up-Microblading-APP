import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { PluginId, PluginRegistryEntry } from './PluginInterface';
import Constants from 'expo-constants';

const ENABLED_PLUGINS_KEY = '@seouup:enabled_plugins';
const REGISTRY_CACHE_KEY = '@seouup:plugin_registry';
const REGISTRY_CACHE_TTL = 60 * 60 * 1000;

type RegistryCache = {
  data: PluginRegistryEntry[];
  fetchedAt: number;
};

type PluginStoreState = {
  enabledPluginIds: Set<PluginId>;
  registryEntries: PluginRegistryEntry[];
  registryLoading: boolean;
  registryError: string | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  enable: (id: PluginId) => Promise<void>;
  disable: (id: PluginId) => Promise<void>;
  isEnabled: (id: PluginId) => boolean;
  fetchRegistry: (forceRefresh?: boolean) => Promise<void>;
};

export const usePluginStore = create<PluginStoreState>((set, get) => ({
  enabledPluginIds: new Set<PluginId>(),
  registryEntries: [],
  registryLoading: false,
  registryError: null,
  hydrated: false,

  hydrate: async () => {
    const raw = await AsyncStorage.getItem(ENABLED_PLUGINS_KEY);
    if (raw) {
      const ids: PluginId[] = JSON.parse(raw);
      set({ enabledPluginIds: new Set(ids), hydrated: true });
    } else {
      set({ hydrated: true });
    }
  },

  enable: async (id: PluginId) => {
    const next = new Set(get().enabledPluginIds);
    next.add(id);
    set({ enabledPluginIds: next });
    await AsyncStorage.setItem(ENABLED_PLUGINS_KEY, JSON.stringify([...next]));
  },

  disable: async (id: PluginId) => {
    const next = new Set(get().enabledPluginIds);
    next.delete(id);
    set({ enabledPluginIds: next });
    await AsyncStorage.setItem(ENABLED_PLUGINS_KEY, JSON.stringify([...next]));
  },

  isEnabled: (id: PluginId) => get().enabledPluginIds.has(id),

  fetchRegistry: async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cached = await AsyncStorage.getItem(REGISTRY_CACHE_KEY);
      if (cached) {
        const parsed: RegistryCache = JSON.parse(cached);
        if (Date.now() - parsed.fetchedAt < REGISTRY_CACHE_TTL) {
          set({ registryEntries: parsed.data });
          return;
        }
      }
    }

    set({ registryLoading: true, registryError: null });
    try {
      const url = Constants.expoConfig?.extra?.pluginRegistryUrl as string;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: { plugins: PluginRegistryEntry[] } = await res.json();
      const cachePayload: RegistryCache = { data: json.plugins, fetchedAt: Date.now() };
      await AsyncStorage.setItem(REGISTRY_CACHE_KEY, JSON.stringify(cachePayload));
      set({ registryEntries: json.plugins, registryLoading: false });
    } catch (e) {
      const cached = await AsyncStorage.getItem(REGISTRY_CACHE_KEY);
      if (cached) {
        const parsed: RegistryCache = JSON.parse(cached);
        set({ registryEntries: parsed.data, registryLoading: false });
      } else {
        set({ registryLoading: false, registryError: String(e) });
      }
    }
  },
}));
