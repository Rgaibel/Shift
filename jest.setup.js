/* eslint-env jest */
// Extend React Native mocks after the preset has loaded them
// This runs after setupFilesAfterEnv, so React Native is already mocked by the preset
const ReactNative = jest.requireMock('react-native');

// Ensure Keyboard API is properly mocked
if (ReactNative) {
  ReactNative.Keyboard = {
    addListener: jest.fn(() => ({
      remove: jest.fn(),
    })),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
    dismiss: jest.fn(),
  };

  // Ensure BackHandler API is properly mocked
  ReactNative.BackHandler = {
    addEventListener: jest.fn(() => ({
      remove: jest.fn(),
    })),
    removeEventListener: jest.fn(),
  };
}
