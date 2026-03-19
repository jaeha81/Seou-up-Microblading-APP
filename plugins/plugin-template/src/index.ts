/**
 * Seou-up Plugin Template
 *
 * Copy this directory and rename to create a new plugin.
 *
 * Steps:
 * 1. Copy plugin-template/ -> plugin-yourname/
 * 2. Update manifest (id, displayName, description, etc.)
 * 3. Implement your screen(s) in src/screens/
 * 4. (Optional) Add API calls in src/api/
 * 5. Register in plugin-registry.json
 * 6. Import in apps/mobile/App.tsx ALL_PLUGINS array
 *
 * Guidelines (5 optimization rules):
 * - No images/animations unless essential
 * - Async data with cache (use services.cache)
 * - Use SkeletonCard/SkeletonBox for loading states
 * - Minimal data transfer, no extra libraries
 * - Async init, instant interaction response
 */

import type {
  SeouPlugin,
  PluginManifest,
  PluginTabBarConfig,
  PluginScreenDef,
  PluginServices,
  PluginLifecycle,
} from '../../../apps/mobile/src/core/plugins/PluginInterface';
import MainScreen from './screens/MainScreen';

export class TemplatePlugin implements SeouPlugin {
  private services: PluginServices | null = null;

  readonly manifest: PluginManifest = {
    id: 'template',                      // <-- Change this
    displayName: 'My Plugin',            // <-- Change this
    description: 'Description here',     // <-- Change this
    version: '1.0.0',
    category: 'community',              // core | business | community | management
    iconName: 'cube-outline',           // Ionicons name
    minAppVersion: '1.0.0',
    enabledByDefault: false,
    permissions: ['network'],            // camera | storage | network | notifications
    size: '~30KB',
  };

  readonly tabBarConfig: PluginTabBarConfig = {
    label: 'My Plugin',                 // <-- Change this
    iconName: 'cube-outline',           // <-- Change this
    iconNameFocused: 'cube',            // <-- Change this
  };

  readonly screens: PluginScreenDef[] = [
    { name: 'template', component: MainScreen },
    // Add more screens: { name: 'Detail', component: DetailScreen }
  ];

  readonly lifecycle: PluginLifecycle = {
    onActivate: async () => {
      // Called when plugin is enabled
    },
    onDeactivate: async () => {
      // Called when plugin is disabled - clean up cache
      this.services?.cache.invalidatePrefix('template:');
    },
  };

  async initialize(services: PluginServices): Promise<void> {
    this.services = services;
    // Pre-fetch data if needed:
    // services.cache.prefetch('template:data', () => services.api.get('/api/data'), services.cache.TTL.MEDIUM);
  }

  async dispose(): Promise<void> {
    this.services?.cache.invalidatePrefix('template:');
    this.services = null;
  }
}
