import type { PluginServices } from '../../../../apps/mobile/src/core/plugins/PluginInterface';

export type Provider = {
  id: number;
  business_name: string;
  city: string;
  country: string;
  description: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  is_active: boolean;
};

let _services: PluginServices | null = null;

export function initProvidersApi(services: PluginServices): void {
  _services = services;
}

export async function getProviders(): Promise<Provider[]> {
  if (!_services) throw new Error('Plugin not initialized');
  return _services.api.get<Provider[]>('/api/providers', {
    key: 'providers',
    ttl: _services.cache.TTL.MEDIUM,
  });
}

export async function getProvider(id: number): Promise<Provider> {
  if (!_services) throw new Error('Plugin not initialized');
  return _services.api.get<Provider>(`/api/providers/${id}`, {
    key: `provider:${id}`,
    ttl: _services.cache.TTL.MEDIUM,
  });
}
