/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */

export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: process.cwd(),
    moduleNameMapper: {
        '^([./a-zA-Z0-9$_-]+)\\.asc$': './__mock__/$1.asc.ts',
        '^([./a-zA-Z0-9$_-]+)\\.js.txt$': './__mock__/$1.js.ts',
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
