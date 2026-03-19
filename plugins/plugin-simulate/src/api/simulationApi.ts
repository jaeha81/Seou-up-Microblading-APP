import type { PluginServices } from '../../../../apps/mobile/src/core/plugins/PluginInterface';

export type EyebrowStyle = {
  id: number;
  slug: string;
  name_en: string;
  name_ko: string;
  name_th: string;
  name_vi: string;
  is_active: boolean;
};

export type Simulation = {
  id: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  eyebrow_style_id: number;
  result_data: Record<string, unknown> | null;
};

let _services: PluginServices | null = null;

export function initSimulationApi(services: PluginServices): void {
  _services = services;
}

export async function getStyles(): Promise<EyebrowStyle[]> {
  if (!_services) throw new Error('Plugin not initialized');
  return _services.api.get<EyebrowStyle[]>('/api/eyebrow-styles', {
    key: 'eyebrow-styles',
    ttl: _services.cache.TTL.LONG,
  });
}

export async function createSimulation(styleId: number): Promise<{ id: number }> {
  if (!_services) throw new Error('Plugin not initialized');
  return _services.api.post<{ id: number }>('/api/simulations', { eyebrow_style_id: styleId });
}

export async function uploadPhoto(simId: number, photoUri: string): Promise<{ status: string }> {
  if (!_services) throw new Error('Plugin not initialized');
  const formData = new FormData();
  const filename = photoUri.split('/').pop() ?? 'photo.jpg';
  const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
  const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
  formData.append('file', { uri: photoUri, name: filename, type: mimeType } as unknown as Blob);
  return _services.api.raw.post<{ status: string }>(
    `/api/simulations/${simId}/upload`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  ).then((r) => r.data);
}

export async function getSimulation(simId: number): Promise<Simulation> {
  if (!_services) throw new Error('Plugin not initialized');
  return _services.api.get<Simulation>(`/api/simulations/${simId}`);
}
