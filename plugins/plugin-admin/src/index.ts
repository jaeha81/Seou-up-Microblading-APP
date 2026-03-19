import type {
  SeouPlugin,
  PluginManifest,
  PluginTabBarConfig,
  PluginScreenDef,
  PluginServices,
} from '../../../apps/mobile/src/core/plugins/PluginInterface';
import AdminScreen from './screens/AdminScreen';
import { initAdminApi } from './api/adminApi';

export class AdminPlugin implements SeouPlugin {
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
  };

  readonly tabBarConfig: PluginTabBarConfig = {
    label: 'Admin',
    iconName: 'shield-outline',
    iconNameFocused: 'shield',
  };

  readonly screens: PluginScreenDef[] = [
    { name: 'admin', component: AdminScreen },
  ];

  async initialize(services: PluginServices): Promise<void> {
    initAdminApi(services);
  }
}
