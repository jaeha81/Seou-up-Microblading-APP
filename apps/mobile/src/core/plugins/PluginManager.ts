import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type {
  PluginId,
  PluginRegistryEntry,
  SeouPlugin,
  PluginServices,
} from './PluginInterface';

const ENABLED_KEY = '@seouup:enabled_plugins';
const REGISTRY_KEY = '@seouup:plugin_registry';
const REGISTRY_TTL = 60 * 60 * 1000;

type RegistryCache = { data: PluginRegistryEntry[]; fetchedAt: number };

type PluginManagerState = {
  enabledIds: Set<PluginId>;
  registry: PluginRegistryEntry[];
  registryLoading: boolean;
  registryError: string | null;
  hydrated: boolean;
  initializedPlugins: Set<PluginId>;

  hydrate: () => Promise<void>;
  enable: (id: PluginId) => Promise<void>;
  disable: (id: PluginId) => Promise<void>;
  isEnabled: (id: PluginId) => boolean;
  fetchRegistry: (registryUrl: string, force?: boolean) => Promise<void>;

  initializePlugin: (plugin: SeouPlugin, services: PluginServices) => Promise<void>;
  disposePlugin: (plugin: SeouPlugin) => Promise<void>;
  getInstalledCount: () => number;
};

export const usePluginManager = create<PluginManagerState>((set, get) => ({
  enabledIds: new Set<PluginId>(),
  registry: [],
  registryLoading: false,
  registryError: null,
  hydrated: false,
  initializedPlugins: new Set<PluginId>(),

  hydrate: async () => {
    const raw = await AsyncStorage.getItem(ENABLED_KEY);
    if (raw) {
      const ids: PluginId[] = JSON.parse(raw);
      set({ enabledIds: new Set(ids), hydrated: true });
    } else {
      set({ hydrated: true });
    }
  },

  enable: async (id: PluginId) => {
    const next = new Set(get().enabledIds);
    next.add(id);
    set({ enabledIds: next });
    await AsyncStorage.setItem(ENABLED_KEY, JSON.stringify([...next]));
  },

  disable: async (id: PluginId) => {
    const next = new Set(get().enabledIds);
    next.delete(id);
    set({ enabledIds: next });
    await AsyncStorage.setItem(ENABLED_KEY, JSON.stringify([...next]));
  },

  isEnabled: (id: PluginId) => get().enabledIds.has(id),

  fetchRegistry: async (registryUrl: string, force = false) => {
    if (!force) {
      const cached = await AsyncStorage.getItem(REGISTRY_KEY);
      if (cached) {
        const parsed: RegistryCache = JSON.parse(cached);
        if (Date.now() - parsed.fetchedAt < REGISTRY_TTL) {
          set({ registry: parsed.data });
          return;
        }
      }
    }

    set({ registryLoading: true, registryError: null });
    try {
      const res = await fetch(registryUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: { plugins: PluginRegistryEntry[] } = await res.json();
      const cache: RegistryCache = { data: json.plugins, fetchedAt: Date.now() };
      await AsyncStorage.setItem(REGISTRY_KEY, JSON.stringify(cache));
      set({ registry: json.plugins, registryLoading: false });
    } catch (e) {
      const cached = await AsyncStorage.getItem(REGISTRY_KEY);
      if (cached) {
        const parsed: RegistryCache = JSON.parse(cached);
        set({ registry: parsed.data, registryLoading: false });
      } else {
        set({ registryLoading: false, registryError: String(e) });
      }
    }
  },

  initializePlugin: async (plugin: SeouPlugin, services: PluginServices) => {
    const { initializedPlugins } = get();
    if (initializedPlugins.has(plugin.manifest.id)) return;

    await plugin.initialize(services);
    await plugin.lifecycle?.onActivate?.();

    const next = new Set(initializedPlugins);
    next.add(plugin.manifest.id);
    set({ initializedPlugins: next });
  },

  disposePlugin: async (plugin: SeouPlugin) => {
    const { initializedPlugins } = get();
    if (!initializedPlugins.has(plugin.manifest.id)) return;

    await plugin.lifecycle?.onDeactivate?.();
    await plugin.dispose?.();

    const next = new Set(initializedPlugins);
    next.delete(plugin.manifest.id);
    set({ initializedPlugins: next });
  },

  getInstalledCount: () => get().enabledIds.size,
}));
