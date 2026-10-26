/** @type {import("jest").Config} **/
export default {
  verbose: false,
  testEnvironment: 'node',
  // Tell Jest to only look for test files inside your compiled output directory
  roots: ['<rootDir>/dist/tests'],
  testMatch: ['**/?(*.)+(spec|test).js'],
  // moduleNameMapper: {
  //   "@src/(.*)": "<rootDir>/dist/$1",
  //   "^(..?/.+).js?$": "$1"
  // },
};