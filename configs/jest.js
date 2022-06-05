/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */

export default {
  "preset": "ts-jest",
  "testEnvironment": "node",
  "rootDir": process.cwd(),
  "transform": {},
  "extensionsToTreatAsEsm": [".ts"],
  "verbose": true,
  "globals": {
    "ts-jest": {
      "useESM": true
    }
  }
}