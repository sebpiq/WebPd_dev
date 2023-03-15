/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */

export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: process.cwd(),
    moduleNameMapper: {
        '^([./a-zA-Z0-9$_-]+)\\.asc$': './__mock__/$1.jest-mock.ts',
        '^([./a-zA-Z0-9$_-]+)\\.generated.js.txt$': './__mock__/$1.jest-mock.ts',
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
}
