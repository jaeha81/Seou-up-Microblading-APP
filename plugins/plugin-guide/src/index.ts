import type {
  SeouPlugin,
  PluginManifest,
  PluginTabBarConfig,
  PluginScreenDef,
  PluginServices,
} from '../../../apps/mobile/src/core/plugins/PluginInterface';
import GuideListScreen from './screens/GuideListScreen';
import GuideDetailScreen from './screens/GuideDetailScreen';
import { initGuideApi } from './api/guideApi';

export class GuidePlugin implements SeouPlugin {
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

  async initialize(services: PluginServices): Promise<void> {
    initGuideApi(services);
    services.cache.prefetch(
      'guides',
      () => services.api.get('/api/guides'),
      services.cache.TTL.MEDIUM,
    );
  }
}
