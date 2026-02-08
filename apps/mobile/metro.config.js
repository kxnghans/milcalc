const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Find the project and workspace roots
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Enable pnpm symlink support
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

// 4. Force singletons and custom resolution logic
config.resolver.extraNodeModules = {
  'react': path.resolve(workspaceRoot, 'node_modules/react'),
  'react-native': path.resolve(workspaceRoot, 'node_modules/react-native'),
  '@repo/ui': path.resolve(workspaceRoot, 'packages/ui'),
  '@repo/utils': path.resolve(workspaceRoot, 'packages/utils'),
};

// 5. Custom Resolver to fix Expo Monorepo bugs & Windows paths
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Normalize Windows paths
  const normalizedModuleName = moduleName.replace(/\\/g, '/');

  // Fix: AppEntry Bug (Force resolution to the hoisted or local expo/AppEntry)
  if (normalizedModuleName.includes('expo/AppEntry')) {
    try {
      return {
        filePath: require.resolve('expo/AppEntry.js', { paths: [projectRoot, workspaceRoot] }),
        type: 'sourceFile',
      };
    } catch (e) {
      // Fallback if require.resolve fails
      return {
        filePath: path.resolve(workspaceRoot, 'node_modules/expo/AppEntry.js'),
        type: 'sourceFile',
      };
    }
  }

  // Fix: Relative Path Bug (Catch imports of "App" from within AppEntry.js)
  if (normalizedModuleName === '../../App' || normalizedModuleName === '../App' || normalizedModuleName === './App') {
    return {
      filePath: path.resolve(projectRoot, 'App.tsx'),
      type: 'sourceFile',
    };
  }

  // Default resolver for everything else
  return context.resolveRequest(context, moduleName, platform);
};

// 6. Inline environment variables and optimize transforms
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
