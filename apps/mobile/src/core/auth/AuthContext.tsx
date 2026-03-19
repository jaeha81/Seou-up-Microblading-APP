import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiClient, setTokenProvider } from '../api/client';
import { CacheService } from '../cache/CacheService';

type UserRole = 'consumer' | 'pro' | 'founder' | 'admin';

type User = {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  language: string;
  consent_given: boolean;
};

type LoginPayload = { email: string; password: string };
type RegisterPayload = { email: string; password: string; name: string; role: UserRole };

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (p: LoginPayload) => Promise<void>;
  register: (p: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'seouup_jwt';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTokenProvider(() => token);
  }, [token]);

  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(TOKEN_KEY);
        if (stored) {
          setToken(stored);
          setTokenProvider(() => stored);
          const me = await apiClient.get<User>('/api/auth/me', {
            cache: { key: 'auth:me', ttl: CacheService.TTL.SHORT },
          });
          setUser(me);
        }
      } catch {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (p: LoginPayload) => {
    const res = await apiClient.post<{ access_token: string }>('/api/auth/login', p);
    const t = res.access_token;
    await SecureStore.setItemAsync(TOKEN_KEY, t);
    setToken(t);
    setTokenProvider(() => t);
    const me = await apiClient.get<User>('/api/auth/me');
    setUser(me);
    await CacheService.set('auth:me', me, CacheService.TTL.SHORT);
  }, []);

  const register = useCallback(async (p: RegisterPayload) => {
    const res = await apiClient.post<{ access_token: string }>('/api/auth/register', p);
    const t = res.access_token;
    await SecureStore.setItemAsync(TOKEN_KEY, t);
    setToken(t);
    setTokenProvider(() => t);
    const me = await apiClient.get<User>('/api/auth/me');
    setUser(me);
  }, []);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setTokenProvider(() => null);
    await CacheService.invalidatePrefix('auth:');
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    const me = await apiClient.get<User>('/api/auth/me');
    setUser(me);
    await CacheService.set('auth:me', me, CacheService.TTL.SHORT);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, isAuthenticated: !!token, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
