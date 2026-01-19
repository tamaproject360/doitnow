const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Mock wa-sqlite modules for web platform to fix bundling errors
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    // Mock wa-sqlite WASM modules for web
    if (moduleName.includes('wa-sqlite') && moduleName.includes('.wasm')) {
      return {
        type: 'empty',
      };
    }
    // Mock wa-sqlite worker modules for web
    if (moduleName.includes('wa-sqlite') && moduleName.includes('worker')) {
      return {
        type: 'empty',
      };
    }
  }

  // Ensure you call the default resolver
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
