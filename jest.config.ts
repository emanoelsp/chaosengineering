import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/cypress/'],
  collectCoverageFrom: [
    'src/services/**/*.ts',
    'src/lib/**/*.ts',
    'src/hooks/**/*.ts',
    'src/ai/**/*.ts',
    'src/stores/**/*.ts',
    'src/schemas/**/*.ts',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
}

export default createJestConfig(config)
