module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-redux|@react-redux|redux-persist|@reduxjs/toolkit|immer|@react-navigation|react-native-vector-icons|react-native-modal-datetime-picker|@react-native-community/datetimepicker|react-native-elements|react-native-size-matters|react-native-ratings|@react-native/js-polyfills|@react-native|react-native)/)',
  ],
  moduleNameMapper: {
    '^react-native-splash-screen$':
      '<rootDir>/__mocks__/react-native-splash-screen.js',
    '^react-native-mmkv$': '<rootDir>/__mocks__/react-native-mmkv.js',
    '^@react-native/js-polyfills/error-guard$':
      '<rootDir>/__mocks__/error-guard.js',
    '^@react-native/js-polyfills$': '<rootDir>/__mocks__/js-polyfills.js',
  },
};
