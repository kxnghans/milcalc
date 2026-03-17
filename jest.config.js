module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@repo/utils/(.*)$': '<rootDir>/packages/utils/src/$1',
    '^@repo/utils$': '<rootDir>/packages/utils/src/index.ts',
    '^@repo/ui/(.*)$': '<rootDir>/packages/ui/src/$1',
    '^@repo/ui$': '<rootDir>/packages/ui/src/index.ts',
  },
  clearMocks: true,
  setupFiles: ['<rootDir>/jest.setup.js'],
  testMatch: ['<rootDir>/packages/**/__tests__/**/*.test.{ts,tsx}'],
};