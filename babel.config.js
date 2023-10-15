module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // "expo-camera",
      // {
      //   "cameraPermission": "Allow FlashMacros to access your camera."
      // },
      "react-native-reanimated/plugin" // must be listed last
    ],
  };
};
