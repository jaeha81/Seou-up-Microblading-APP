import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useAuth } from '../core/auth/AuthContext';
import { usePluginRegistry } from '../core/plugins/PluginRegistry';
import { useNetworkStatus } from '../core/hooks/useNetworkStatus';
import { PluginErrorBoundary } from '../components/ErrorBoundary';
import { OfflineBanner } from '../components/OfflineBanner';
import { View } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PluginStoreScreen from '../screens/PluginStoreScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Register: undefined;
  Onboarding: undefined;
  [key: string]: undefined | Record<string, unknown>;
};

export type MainTabParamList = {
  Home: undefined;
  PluginStore: undefined;
  Settings: undefined;
  [key: string]: undefined | Record<string, unknown>;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  const { getEnabledTabItems } = usePluginRegistry();
  const networkStatus = useNetworkStatus();
  const tabItems = getEnabledTabItems();

  return (
    <View style={{ flex: 1 }}>
      {networkStatus === 'offline' && <OfflineBanner />}
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.tabActive,
          tabBarInactiveTintColor: Colors.tabInactive,
          tabBarStyle: {
            backgroundColor: Colors.tabBackground,
            borderTopWidth: 0.5,
            borderTopColor: Colors.border,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
          lazy: true,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          }}
        />

        {tabItems.map(({ plugin, tabBar }) => {
          const ScreenComponent = plugin.screens[0]?.component;
          if (!ScreenComponent) return null;

          const WrappedScreen = (props: Record<string, unknown>) => (
            <PluginErrorBoundary pluginName={plugin.manifest.displayName}>
              <ScreenComponent {...(props as any)} />
            </PluginErrorBoundary>
          );

          return (
            <Tab.Screen
              key={plugin.manifest.id}
              name={plugin.manifest.id}
              component={WrappedScreen}
              options={{
                tabBarLabel: tabBar.label,
                lazy: true,
                tabBarIcon: ({ color, focused, size }) => (
                  <Ionicons
                    name={(focused ? tabBar.iconNameFocused : tabBar.iconName) as keyof typeof Ionicons.glyphMap}
                    size={size}
                    color={color}
                  />
                ),
              }}
            />
          );
        })}

        <Tab.Screen
          name="PluginStore"
          component={PluginStoreScreen}
          options={{
            tabBarLabel: 'Plugins',
            tabBarIcon: ({ color, size }) => <Ionicons name="extensions-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

export function AppNavigator() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : !user?.consent_given ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
}
