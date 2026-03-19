import './src/core/i18n';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, useAuth } from './src/core/auth/AuthContext';
import { PluginRegistryProvider } from './src/core/plugins/PluginRegistry';
import { usePluginManager } from './src/core/plugins/PluginManager';
import { AppNavigator } from './src/navigation/AppNavigator';

import { SimulatePlugin } from '../../plugins/plugin-simulate/src';
import { GuidePlugin } from '../../plugins/plugin-guide/src';
import { ProvidersPlugin } from '../../plugins/plugin-providers/src';
import { FeedbackPlugin } from '../../plugins/plugin-feedback/src';
import { AdminPlugin } from '../../plugins/plugin-admin/src';

import type { SeouPlugin } from './src/core/plugins/PluginInterface';

SplashScreen.preventAutoHideAsync();

const ALL_PLUGINS: SeouPlugin[] = [
  new SimulatePlugin(),
  new GuidePlugin(),
  new ProvidersPlugin(),
  new FeedbackPlugin(),
  new AdminPlugin(),
];

const DEFAULT_ENABLED: string[] = ['simulate'];

function AppCore() {
  const { user, isLoading } = useAuth();
  const { hydrate, enable, enabledIds } = usePluginManager();

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && enabledIds.size === 0) {
      DEFAULT_ENABLED.forEach((id) => enable(id));
    }
  }, [isLoading]);

  const authServices = {
    userId: user?.id ?? null,
    userRole: user?.role ?? null,
    token: null,
    isAuthenticated: !!user,
  };

  return (
    <PluginRegistryProvider plugins={ALL_PLUGINS} authServices={authServices}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppNavigator />
      </NavigationContainer>
    </PluginRegistryProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppCore />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
