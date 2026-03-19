import type {
  SeouPlugin,
  PluginManifest,
  PluginTabBarConfig,
  PluginScreenDef,
  PluginServices,
  PluginLifecycle,
} from '../../../apps/mobile/src/core/plugins/PluginInterface';
import GuideListScreen from './screens/GuideListScreen';
import GuideDetailScreen from './screens/GuideDetailScreen';
import { initGuideApi } from './api/guideApi';

export class GuidePlugin implements SeouPlugin {
  private services: PluginServices | null = null;

  readonly manifest: PluginManifest = {
    id: 'guide',
    displayName: 'Startup Guide',
    description: 'Business guide for microblading entrepreneurs',
    version: '1.0.0',
    category: 'business',
    iconName: 'book-outline',
    minAppVersion: '1.0.0',
    enabledByDefault: false,
    requiredRole: ['founder'],
    permissions: ['network'],
    size: '~45KB',
  };

  readonly tabBarConfig: PluginTabBarConfig = {
    label: 'Guide',
    iconName: 'book-outline',
    iconNameFocused: 'book',
  };

  readonly screens: PluginScreenDef[] = [
    { name: 'guide', component: GuideListScreen },
    { name: 'GuideDetail', component: GuideDetailScreen },
  ];

  readonly lifecycle: PluginLifecycle = {
    onDeactivate: async () => {
      this.services?.cache.invalidate('guides');
    },
  };

  async initialize(services: PluginServices): Promise<void> {
    this.services = services;
    initGuideApi(services);
    services.cache.prefetch(
      'guides',
      () => services.api.get('/api/guides'),
      services.cache.TTL.MEDIUM,
    );
  }

  async dispose(): Promise<void> {
    this.services?.cache.invalidate('guides');
    this.services = null;
  }
}
