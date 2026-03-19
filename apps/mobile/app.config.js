/** @type {import('expo/config').ExpoConfig} */
module.exports = {
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
        photosPermission: 'Allow Seou-up to access your photos for brow simulation.',
        cameraPermission: 'Allow Seou-up to use your camera for brow simulation.',
      },
    ],
    'expo-secure-store',
    'expo-font',
  ],
  extra: {
    // API URL 우선순위: 빌드 시 env → 기본값
    apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000',
    pluginRegistryUrl:
      'https://raw.githubusercontent.com/jaeha81/Seou-up-Microblading-APP/main/plugin-registry.json',
    eas: {
      projectId: process.env.EAS_PROJECT_ID || '',
    },
  },
};
