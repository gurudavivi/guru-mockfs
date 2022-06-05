import 'jest-extended';
import 'jest-date-mock';

export default {
  preset: 'ts-jest',
  testMatch: ['**/*.test.[jt]s?(x)', '**/*.spec.[jt]s?(x)'],
  testEnvironment: 'node',
  collectCoverage: false,
  verbose: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/utils/',
    '/__tests__/.+',
    '/__mocks__/.+',
    '/__fixtures__/.+',
  ],
  testTimeout: 4 * 60 * 1000, // 4 minutes
  setupFilesAfterEnv: ['jest-extended/all', 'jest-date-mock'],
};
