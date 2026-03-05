import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'MilCalc',
  slug: 'milcalc-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  platforms: ['ios', 'android'],
  icon: './assets/3d_splash.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/3d_splash.png',
    resizeMode: 'contain',
    backgroundColor: '#FFFFFF',
  },
  scheme: 'milcalc',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'dev.milcalc.mobile',
    newArchEnabled: true,
  },
  android: {
    package: 'dev.milcalc.mobile',
    adaptiveIcon: {
      foregroundImage: './assets/3d_splash.png',
      backgroundColor: '#FFFFFF',
    },
    softwareKeyboardLayoutMode: 'resize',
    newArchEnabled: true,
    permissions: [
      // Removed generic location/storage permissions to follow JIT model
    ],
  },
  web: {
    favicon: './assets/3d_splash.png',
  },
  plugins: [
    'expo-router',
    'expo-font',
    [
      'expo-asset',
      {
        assets: ['./assets/3d_splash.png'],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    eas: {
      projectId: 'your-project-id', // Replace with actual ID if using EAS
    },
  },
});
