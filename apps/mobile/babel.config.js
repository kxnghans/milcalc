module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Ensure NO Reanimated or Skia plugins are listed here
    ],
  };
};
