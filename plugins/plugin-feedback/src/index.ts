import type {
  SeouPlugin,
  PluginManifest,
  PluginTabBarConfig,
  PluginScreenDef,
  PluginServices,
} from '../../../apps/mobile/src/core/plugins/PluginInterface';
import FeedbackScreen, { initFeedbackServices } from './screens/FeedbackScreen';

export class FeedbackPlugin implements SeouPlugin {
  readonly manifest: PluginManifest = {
    id: 'feedback',
    displayName: 'Feedback',
    description: 'Send ratings, bug reports, and feature requests',
    version: '1.0.0',
    category: 'community',
    iconName: 'chatbubble-ellipses-outline',
    minAppVersion: '1.0.0',
    enabledByDefault: false,
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
    initFeedbackServices(services);
  }
}
