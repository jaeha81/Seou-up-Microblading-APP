import type {
  SeouPlugin,
  PluginManifest,
  PluginTabBarConfig,
  PluginScreenDef,
  PluginServices,
} from '../../../apps/mobile/src/core/plugins/PluginInterface';
import ProvidersScreen from './screens/ProvidersScreen';
import { initProvidersApi } from './api/providersApi';

export class ProvidersPlugin implements SeouPlugin {
  readonly manifest: PluginManifest = {
    id: 'providers',
    displayName: 'Find Providers',
    description: 'Discover certified microblading clinics near you',
    version: '1.0.0',
    category: 'community',
    iconName: 'storefront-outline',
    minAppVersion: '1.0.0',
    enabledByDefault: false,
  };

  readonly tabBarConfig: PluginTabBarConfig = {
    label: 'Providers',
    iconName: 'storefront-outline',
    iconNameFocused: 'storefront',
  };

  readonly screens: PluginScreenDef[] = [
    { name: 'providers', component: ProvidersScreen },
  ];

  async initialize(services: PluginServices): Promise<void> {
    initProvidersApi(services);
    services.cache.prefetch(
      'providers',
      () => services.api.get('/api/providers'),
      services.cache.TTL.MEDIUM,
    );
  }
}
