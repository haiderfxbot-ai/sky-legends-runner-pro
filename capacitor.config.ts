import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.skylegends.runner',
  appName: 'Sky Legends Runner',
  webDir: '.',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'APK'
    },
    allowMixedContent: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#121212',
      showSpinner: false
    }
  }
};

export default config;
