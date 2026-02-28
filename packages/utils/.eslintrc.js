module.exports = {
  root: true,
  extends: ["@repo/eslint-config"],
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
