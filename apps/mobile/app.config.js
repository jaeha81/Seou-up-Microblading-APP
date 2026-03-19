const { withAndroidManifest } = require('@expo/config-plugins');

// API URL 우선순위:
// 1. EXPO_PUBLIC_API_URL 환경변수
// 2. app.json extra.apiBaseUrl
// 3. 기본값 (개발 중 로컬 네트워크 자동 감지)
const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_URL ||
  'http://localhost:8000';

/** @type {import('expo/config').ExpoConfig} */
const config = {
  name: 'Seou-up Microblading',
  slug: 'seou-up-microblading',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#1a1a2e',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.seouup.microblading',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#1a1a2e',
    },
    package: 'com.seouup.microblading',
    versionCode: 1,
    permissions: [
      'android.permission.CAMERA',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.INTERNET',
    ],
  },
  plugins: [
    [
      'expo-image-picker',
      {
        photosPermission:
          'Allow Seou-up to access your photos for brow simulation.',
        cameraPermission:
          'Allow Seou-up to use your camera for brow simulation.',
      },
    ],
    'expo-secure-store',
    'expo-font',
  ],
  extra: {
    apiBaseUrl,
    pluginRegistryUrl:
      'https://raw.githubusercontent.com/jaeha81/Seou-up-Microblading-APP/main/plugin-registry.json',
    eas: {
      projectId: process.env.EAS_PROJECT_ID || 'seou-up-microblading',
    },
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
};

module.exports = config;
