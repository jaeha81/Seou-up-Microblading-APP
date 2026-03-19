/**
 * Plugin API Template
 *
 * Pattern:
 * 1. Store services reference via init function
 * 2. Export typed API functions
 * 3. Use cache for GET requests
 * 4. Invalidate cache after mutations
 */

import type { PluginServices } from '../../../../apps/mobile/src/core/plugins/PluginInterface';

// Define your data types
export type TemplateItem = {
  id: number;
  title: string;
  content: string;
};

let _services: PluginServices | null = null;

export function initTemplateApi(services: PluginServices): void {
  _services = services;
}

export async function getItems(): Promise<TemplateItem[]> {
  if (!_services) throw new Error('Plugin not initialized');
  return _services.api.get<TemplateItem[]>('/api/items', {
    key: 'template:items',
    ttl: _services.cache.TTL.MEDIUM,
  });
}

export async function getItem(id: number): Promise<TemplateItem> {
  if (!_services) throw new Error('Plugin not initialized');
  return _services.api.get<TemplateItem>(`/api/items/${id}`, {
    key: `template:item:${id}`,
    ttl: _services.cache.TTL.MEDIUM,
  });
}

export async function createItem(data: Omit<TemplateItem, 'id'>): Promise<TemplateItem> {
  if (!_services) throw new Error('Plugin not initialized');
  const result = await _services.api.post<TemplateItem>('/api/items', data);
  await _services.cache.invalidate('template:items');
  return result;
}
