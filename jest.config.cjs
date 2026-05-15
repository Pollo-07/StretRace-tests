module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/specs'],
  testMatch: ['**/*.spec.ts'],
  collectCoverageFrom: ['specs/**/*.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],


    moduleNameMapper: {
    "^jsonwebtoken$": "<rootDir>/node_modules/jsonwebtoken"
  }
};
