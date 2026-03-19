import type {
  SeouPlugin,
  PluginManifest,
  PluginTabBarConfig,
  PluginScreenDef,
  PluginServices,
  PluginLifecycle,
} from '../../../apps/mobile/src/core/plugins/PluginInterface';
import AdminScreen from './screens/AdminScreen';
import { initAdminApi } from './api/adminApi';

export class AdminPlugin implements SeouPlugin {
  private services: PluginServices | null = null;

  readonly manifest: PluginManifest = {
    id: 'admin',
    displayName: 'Admin',
    description: 'Platform statistics, user management, and feedback review',
    version: '1.0.0',
    category: 'management',
    iconName: 'shield-outline',
    minAppVersion: '1.0.0',
    enabledByDefault: false,
    requiredRole: ['admin'],
    permissions: ['network'],
    size: '~60KB',
  };

  readonly tabBarConfig: PluginTabBarConfig = {
    label: 'Admin',
    iconName: 'shield-outline',
    iconNameFocused: 'shield',
  };

  readonly screens: PluginScreenDef[] = [
    { name: 'admin', component: AdminScreen },
  ];

  readonly lifecycle: PluginLifecycle = {
    onDeactivate: async () => {
      this.services?.cache.invalidate('admin-stats');
    },
  };

  async initialize(services: PluginServices): Promise<void> {
    this.services = services;
    initAdminApi(services);
  }

  async dispose(): Promise<void> {
    this.services?.cache.invalidate('admin-stats');
    this.services = null;
  }
}
