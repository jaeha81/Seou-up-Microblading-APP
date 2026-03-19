import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { CacheService } from '../cache/CacheService';

const BASE_URL: string = (Constants.expoConfig?.extra?.apiBaseUrl as string) ?? 'http://localhost:8000';

export type CachedRequestConfig = AxiosRequestConfig & {
  cache?: { key: string; ttl: number };
};

let _tokenProvider: (() => string | null) | null = null;

export function setTokenProvider(fn: () => string | null): void {
  _tokenProvider = fn;
}

const _client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

_client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = _tokenProvider?.();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

_client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      _tokenProvider = null;
    }
    return Promise.reject(err);
  },
);

async function get<T>(path: string, config?: CachedRequestConfig): Promise<T> {
  if (config?.cache) {
    const cached = await CacheService.get<T>(config.cache.key);
    if (cached !== null) return cached;
    const stale = await CacheService.getStale<T>(config.cache.key);
    if (stale !== null) {
      _client.get<T>(path, config).then(async (res) => {
        await CacheService.set(config.cache!.key, res.data, config.cache!.ttl);
      });
      return stale;
    }
  }
  const res = await _client.get<T>(path, config);
  if (config?.cache) {
    await CacheService.set(config.cache.key, res.data, config.cache.ttl);
  }
  return res.data;
}

async function post<T>(path: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await _client.post<T>(path, body, config);
  return res.data;
}

async function patch<T>(path: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await _client.patch<T>(path, body, config);
  return res.data;
}

async function del<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await _client.delete<T>(path, config);
  return res.data;
}

export const apiClient = { get, post, patch, delete: del, raw: _client };
