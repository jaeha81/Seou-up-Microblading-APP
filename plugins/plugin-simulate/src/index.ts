import type {
  SeouPlugin,
  PluginManifest,
  PluginTabBarConfig,
  PluginScreenDef,
  PluginServices,
  PluginLifecycle,
} from '../../../apps/mobile/src/core/plugins/PluginInterface';
import SimulateScreen from './screens/SimulateScreen';
import SimulateResultScreen from './screens/SimulateResultScreen';
import { initSimulationApi } from './api/simulationApi';

export class SimulatePlugin implements SeouPlugin {
  private services: PluginServices | null = null;

  readonly manifest: PluginManifest = {
    id: 'simulate',
    displayName: 'Brow Simulation',
    description: 'Try 12+ eyebrow styles on your photo using AI',
    version: '1.0.0',
    category: 'core',
    iconName: 'camera-outline',
    minAppVersion: '1.0.0',
    enabledByDefault: true,
    permissions: ['camera', 'storage', 'network'],
    size: '~120KB',
  };

  readonly tabBarConfig: PluginTabBarConfig = {
    label: 'Simulate',
    iconName: 'camera-outline',
    iconNameFocused: 'camera',
  };

  readonly screens: PluginScreenDef[] = [
    { name: 'simulate', component: SimulateScreen },
    { name: 'SimulateResult', component: SimulateResultScreen },
  ];

  readonly lifecycle: PluginLifecycle = {
    onDeactivate: async () => {
      this.services?.cache.invalidate('eyebrow-styles');
    },
  };

  async initialize(services: PluginServices): Promise<void> {
    this.services = services;
    initSimulationApi(services);
    services.cache.prefetch(
      'eyebrow-styles',
      () => services.api.get('/api/eyebrow-styles'),
      services.cache.TTL.LONG,
    );
  }

  async dispose(): Promise<void> {
    this.services?.cache.invalidate('eyebrow-styles');
    this.services = null;
  }
}
