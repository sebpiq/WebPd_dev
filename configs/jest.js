/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */

export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: process.cwd(),
    moduleNameMapper: {
        '^((?:[.a-zA-Z0-9$_-]+/)*)([.a-zA-Z0-9$_-]+)\\.js.txt$': '$1__mock__/$2.js.ts',
    },
    extensionsToTreatAsEsm: ['.ts'],
    transform: {
        '.*\.ts': ['ts-jest', {
            useESM: true,
            diagnostics: true,
        }]
    },
    verbose: true,
    watchPathIgnorePatterns: ['tmp/'],
    testTimeout: 30000,
    // This helps dealing with jest getting out of memory errors when 
    // testing Wasm modules
    workerIdleMemoryLimit: 0.2,
    maxConcurrency: 2,
    maxWorkers: 1,
}
