/** @type {import("jest").Config} **/
export default {
  verbose: false,
  testEnvironment: "node",
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        diagnostics: false,
        tsconfig: 'tsconfig.json',
        useESM: true,
      },
    ]
  },
  moduleNameMapper: {
    "@src/(.*)": "<rootDir>/src/$1",
    "^(..?/.+).js?$": "$1"
  },
};