import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sidequest.app',
  appName: 'sidequestnew',
  webDir: 'dist',
  server: {
    cleartext: true
  }
};

export default config;
