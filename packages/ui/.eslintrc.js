module.exports = {
  extends: ["@repo/eslint-config/react-native"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    ".eslintrc.js",
    "node_modules/**",
    "dist/**",
  ],
  env: {
    node: true,
  },
};
