import type {
  SeouPlugin,
  PluginManifest,
  PluginTabBarConfig,
  PluginScreenDef,
  PluginServices,
  PluginLifecycle,
} from '../../../apps/mobile/src/core/plugins/PluginInterface';
import ProvidersScreen from './screens/ProvidersScreen';
import { initProvidersApi } from './api/providersApi';

export class ProvidersPlugin implements SeouPlugin {
  private services: PluginServices | null = null;

  readonly manifest: PluginManifest = {
    id: 'providers',
    displayName: 'Find Providers',
    description: 'Discover certified microblading clinics near you',
    version: '1.0.0',
    category: 'community',
    iconName: 'storefront-outline',
    minAppVersion: '1.0.0',
    enabledByDefault: false,
    permissions: ['network'],
    size: '~50KB',
  };

  readonly tabBarConfig: PluginTabBarConfig = {
    label: 'Providers',
    iconName: 'storefront-outline',
    iconNameFocused: 'storefront',
  };

  readonly screens: PluginScreenDef[] = [
    { name: 'providers', component: ProvidersScreen },
  ];

  readonly lifecycle: PluginLifecycle = {
    onDeactivate: async () => {
      this.services?.cache.invalidate('providers');
    },
  };

  async initialize(services: PluginServices): Promise<void> {
    this.services = services;
    initProvidersApi(services);
    services.cache.prefetch(
      'providers',
      () => services.api.get('/api/providers'),
      services.cache.TTL.MEDIUM,
    );
  }

  async dispose(): Promise<void> {
    this.services?.cache.invalidate('providers');
    this.services = null;
  }
}
