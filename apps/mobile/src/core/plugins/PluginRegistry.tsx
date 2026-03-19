import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { SeouPlugin, PluginId, PluginServices, PluginScreenDef, PluginTabBarConfig } from './PluginInterface';
import { usePluginStore } from './PluginStore';
import { apiClient } from '../api/client';
import { CacheService } from '../cache/CacheService';

type PluginRegistryContextValue = {
  allPlugins: SeouPlugin[];
  enabledPlugins: SeouPlugin[];
  getPlugin: (id: PluginId) => SeouPlugin | undefined;
  getEnabledScreens: () => PluginScreenDef[];
  getEnabledTabItems: () => Array<{ plugin: SeouPlugin; tabBar: PluginTabBarConfig }>;
  initialized: boolean;
};

const PluginRegistryContext = createContext<PluginRegistryContextValue | null>(null);

type PluginRegistryProviderProps = {
  children: React.ReactNode;
  plugins: SeouPlugin[];
  authServices: PluginServices['auth'];
};

export function PluginRegistryProvider({ children, plugins, authServices }: PluginRegistryProviderProps) {
  const { enabledPluginIds, hydrated } = usePluginStore();
  const [initialized, setInitialized] = useState(false);
  const initializedRef = useRef(new Set<PluginId>());

  const services: PluginServices = {
    api: {
      get: <T,>(path: string, cacheConfig?: { key: string; ttl: number }) =>
        apiClient.get<T>(path, cacheConfig ? { cache: cacheConfig } : undefined),
      post: <T,>(path: string, body?: unknown) => apiClient.post<T>(path, body),
      patch: <T,>(path: string, body?: unknown) => apiClient.patch<T>(path, body),
      delete: <T,>(path: string) => apiClient.delete<T>(path),
      raw: apiClient.raw,
    },
    cache: CacheService,
    auth: authServices,
  };

  useEffect(() => {
    if (!hydrated) return;

    const toInit = plugins.filter(
      (p) => enabledPluginIds.has(p.manifest.id) && !initializedRef.current.has(p.manifest.id),
    );

    if (toInit.length === 0) {
      setInitialized(true);
      return;
    }

    Promise.all(
      toInit.map(async (p) => {
        await p.initialize(services);
        initializedRef.current.add(p.manifest.id);
      }),
    ).then(() => setInitialized(true));
  }, [enabledPluginIds, hydrated]);

  const enabledPlugins = plugins.filter((p) => enabledPluginIds.has(p.manifest.id));

  const getPlugin = (id: PluginId) => plugins.find((p) => p.manifest.id === id);

  const getEnabledScreens = () => enabledPlugins.flatMap((p) => p.screens);

  const getEnabledTabItems = () =>
    enabledPlugins
      .filter((p) => p.tabBarConfig !== undefined)
      .map((p) => ({ plugin: p, tabBar: p.tabBarConfig! }));

  return (
    <PluginRegistryContext.Provider
      value={{ allPlugins: plugins, enabledPlugins, getPlugin, getEnabledScreens, getEnabledTabItems, initialized }}
    >
      {children}
    </PluginRegistryContext.Provider>
  );
}

export function usePluginRegistry(): PluginRegistryContextValue {
  const ctx = useContext(PluginRegistryContext);
  if (!ctx) throw new Error('usePluginRegistry must be used within PluginRegistryProvider');
  return ctx;
}
