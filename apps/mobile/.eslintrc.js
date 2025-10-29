module.exports = {
  extends: ["@repo/eslint-config/react-native"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    ".eslintrc.js",
    "metro.config.js",
    "expo-env.d.ts",
    ".expo/**",
    "android/**",
    "ios/**",
    "node_modules/**",
  ],
  rules: {
    // Add any app-specific rules here
    "react-native/no-inline-styles": "off", // You use inline styles in your components
  },
};
