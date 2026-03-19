import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type {
  SeouPlugin,
  PluginId,
  PluginServices,
  PluginScreenDef,
  PluginTabBarConfig,
} from './PluginInterface';
import { usePluginManager } from './PluginManager';
import { createEventBus } from './PluginEventBus';
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

const eventBus = createEventBus();

export function PluginRegistryProvider({ children, plugins, authServices }: PluginRegistryProviderProps) {
  const { enabledIds, hydrated, initializePlugin } = usePluginManager();
  const [initialized, setInitialized] = useState(false);

  const services: PluginServices = useMemo(() => ({
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
    events: eventBus,
  }), [authServices]);

  useEffect(() => {
    if (!hydrated) return;

    const toInit = plugins.filter((p) => enabledIds.has(p.manifest.id));

    if (toInit.length === 0) {
      setInitialized(true);
      return;
    }

    Promise.all(toInit.map((p) => initializePlugin(p, services)))
      .then(() => setInitialized(true));
  }, [enabledIds, hydrated]);

  const enabledPlugins = useMemo(
    () => plugins.filter((p) => enabledIds.has(p.manifest.id)),
    [plugins, enabledIds],
  );

  const value = useMemo<PluginRegistryContextValue>(() => ({
    allPlugins: plugins,
    enabledPlugins,
    getPlugin: (id: PluginId) => plugins.find((p) => p.manifest.id === id),
    getEnabledScreens: () => enabledPlugins.flatMap((p) => p.screens),
    getEnabledTabItems: () =>
      enabledPlugins
        .filter((p) => p.tabBarConfig !== undefined)
        .map((p) => ({ plugin: p, tabBar: p.tabBarConfig! })),
    initialized,
  }), [plugins, enabledPlugins, initialized]);

  return (
    <PluginRegistryContext.Provider value={value}>
      {children}
    </PluginRegistryContext.Provider>
  );
}

export function usePluginRegistry(): PluginRegistryContextValue {
  const ctx = useContext(PluginRegistryContext);
  if (!ctx) throw new Error('usePluginRegistry must be used within PluginRegistryProvider');
  return ctx;
}
