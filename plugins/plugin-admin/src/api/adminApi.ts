import type { PluginServices } from '../../../../apps/mobile/src/core/plugins/PluginInterface';

export type AdminStats = {
  total_users: number;
  total_simulations: number;
  total_feedbacks: number;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
};

export type AdminFeedback = {
  id: number;
  category: string;
  rating: number | null;
  message: string;
  email: string | null;
  created_at: string;
};

let _services: PluginServices | null = null;

export function initAdminApi(services: PluginServices): void {
  _services = services;
}

export async function getStats(): Promise<AdminStats> {
  if (!_services) throw new Error('Plugin not initialized');
  return _services.api.get<AdminStats>('/api/admin/stats', {
    key: 'admin:stats',
    ttl: _services.cache.TTL.SHORT,
  });
}

export async function getUsers(): Promise<AdminUser[]> {
  if (!_services) throw new Error('Plugin not initialized');
  return _services.api.get<AdminUser[]>('/api/admin/users', {
    key: 'admin:users',
    ttl: _services.cache.TTL.SHORT,
  });
}

export async function getFeedbacks(): Promise<AdminFeedback[]> {
  if (!_services) throw new Error('Plugin not initialized');
  return _services.api.get<AdminFeedback[]>('/api/admin/feedbacks', {
    key: 'admin:feedbacks',
    ttl: _services.cache.TTL.SHORT,
  });
}

export async function deactivateUser(userId: number): Promise<void> {
  if (!_services) throw new Error('Plugin not initialized');
  await _services.api.patch(`/api/admin/users/${userId}/deactivate`);
  await _services.cache.invalidate('admin:users');
}
