// Import Jest DOM extensions
require("@testing-library/jest-dom");

// Mock global fetch
global.fetch = jest.fn();

// Reset all mocks after each test
afterEach(() => {
  jest.resetAllMocks();
});
