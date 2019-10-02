module.exports = {
    "setupFiles": ["./jest-setup-file.ts"],
    "transform": {
      "^.+\\.ts?$": "ts-jest"
    },
    "testRegex": "\\.(spec|test)\\.ts?$",
    "moduleFileExtensions": ["js", "ts"],
    "modulePaths": ["<rootDir>/app/"],
    "testEnvironment": "node",
    "forceExit": true,
    "setupFiles": ["./jest-setup-file.ts"],
    "coverageThreshold": {
      "global": {
        "branches": 85,
        "functions": 85,
        "lines": 85,
        "statements": 85
      }
    }
  };