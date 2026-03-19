import { ComponentType } from 'react';
import { AxiosInstance } from 'axios';
import { CacheService } from '../cache/CacheService';

export type PluginId =
  | 'simulate'
  | 'guide'
  | 'providers'
  | 'feedback'
  | 'admin';

export type PluginCategory = 'core' | 'business' | 'community' | 'management';

export type PluginScreenDef = {
  name: string;
  component: ComponentType<PluginScreenProps>;
};

export type PluginTabBarConfig = {
  label: string;
  iconName: string;
  iconNameFocused: string;
};

export type PluginScreenProps = {
  navigation: PluginNavigation;
  route: { params?: Record<string, unknown> };
};

export type PluginNavigation = {
  navigate: (screen: string, params?: Record<string, unknown>) => void;
  goBack: () => void;
  replace: (screen: string, params?: Record<string, unknown>) => void;
};

export type PluginServices = {
  api: {
    get: <T>(path: string, cacheConfig?: { key: string; ttl: number }) => Promise<T>;
    post: <T>(path: string, body?: unknown) => Promise<T>;
    patch: <T>(path: string, body?: unknown) => Promise<T>;
    delete: <T>(path: string) => Promise<T>;
    raw: AxiosInstance;
  };
  cache: typeof CacheService;
  auth: {
    userId: number | null;
    userRole: string | null;
    token: string | null;
    isAuthenticated: boolean;
  };
};

export type PluginManifest = {
  id: PluginId;
  displayName: string;
  description: string;
  version: string;
  category: PluginCategory;
  iconName: string;
  minAppVersion: string;
  enabledByDefault: boolean;
  requiredRole?: string[];
};

export interface SeouPlugin {
  readonly manifest: PluginManifest;
  readonly tabBarConfig?: PluginTabBarConfig;
  readonly screens: PluginScreenDef[];
  initialize(services: PluginServices): Promise<void>;
}

export type PluginRegistryEntry = {
  id: PluginId;
  name: string;
  description: string;
  version: string;
  category: PluginCategory;
  iconName: string;
  bundled: boolean;
  enabledByDefault: boolean;
  githubUrl?: string;
};
