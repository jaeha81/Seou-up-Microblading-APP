import { ComponentType } from 'react';
import { AxiosInstance } from 'axios';
import { CacheService } from '../cache/CacheService';

export type PluginId = string;

export type PluginCategory = 'core' | 'business' | 'community' | 'management';

export type PluginScreenDef = {
  name: string;
  component: ComponentType<PluginScreenProps>;
  options?: { lazy?: boolean };
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

export type PluginEventBus = {
  emit: (event: string, data?: unknown) => void;
  on: (event: string, handler: (data?: unknown) => void) => () => void;
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
  events: PluginEventBus;
};

export type PluginPermission = 'camera' | 'storage' | 'network' | 'notifications';

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
  permissions?: PluginPermission[];
  dependencies?: string[];
  size?: string;
};

export type PluginLifecycle = {
  onActivate?: () => Promise<void>;
  onDeactivate?: () => Promise<void>;
  onUserLogin?: (userId: number) => Promise<void>;
  onUserLogout?: () => Promise<void>;
};

export interface SeouPlugin {
  readonly manifest: PluginManifest;
  readonly tabBarConfig?: PluginTabBarConfig;
  readonly screens: PluginScreenDef[];
  readonly lifecycle?: PluginLifecycle;
  initialize(services: PluginServices): Promise<void>;
  dispose?(): Promise<void>;
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
  permissions?: PluginPermission[];
  dependencies?: string[];
  size?: string;
  githubUrl?: string;
};
