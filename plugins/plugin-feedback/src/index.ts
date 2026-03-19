import type {
  SeouPlugin,
  PluginManifest,
  PluginTabBarConfig,
  PluginScreenDef,
  PluginServices,
} from '../../../apps/mobile/src/core/plugins/PluginInterface';
import FeedbackScreen, { initFeedbackServices } from './screens/FeedbackScreen';

export class FeedbackPlugin implements SeouPlugin {
  private services: PluginServices | null = null;

  readonly manifest: PluginManifest = {
    id: 'feedback',
    displayName: 'Feedback',
    description: 'Send ratings, bug reports, and feature requests',
    version: '1.0.0',
    category: 'community',
    iconName: 'chatbubble-ellipses-outline',
    minAppVersion: '1.0.0',
    enabledByDefault: false,
    permissions: ['network'],
    size: '~35KB',
  };

  readonly tabBarConfig: PluginTabBarConfig = {
    label: 'Feedback',
    iconName: 'chatbubble-outline',
    iconNameFocused: 'chatbubble',
  };

  readonly screens: PluginScreenDef[] = [
    { name: 'feedback', component: FeedbackScreen },
  ];

  async initialize(services: PluginServices): Promise<void> {
    this.services = services;
    initFeedbackServices(services);
  }

  async dispose(): Promise<void> {
    this.services = null;
  }
}
