import type { PluginServices } from '../../../../apps/mobile/src/core/plugins/PluginInterface';

export type GuideArticle = {
  id: number;
  slug: string;
  title_en: string;
  body_en: string;
  category: 'startup' | 'technique' | 'marketing';
  is_published: boolean;
};

let _services: PluginServices | null = null;

export function initGuideApi(services: PluginServices): void {
  _services = services;
}

export async function getGuides(): Promise<GuideArticle[]> {
  if (!_services) throw new Error('Plugin not initialized');
  return _services.api.get<GuideArticle[]>('/api/guides', {
    key: 'guides',
    ttl: _services.cache.TTL.MEDIUM,
  });
}

export async function getGuide(slug: string): Promise<GuideArticle> {
  if (!_services) throw new Error('Plugin not initialized');
  return _services.api.get<GuideArticle>(`/api/guides/${slug}`, {
    key: `guide:${slug}`,
    ttl: _services.cache.TTL.MEDIUM,
  });
}
