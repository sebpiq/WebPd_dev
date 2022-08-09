/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */

export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: process.cwd(),
    moduleNameMapper: {
        '^([./a-zA-Z0-9$_-]+)\\.asc$': '$1.jest-mock.ts'
    },
    extensionsToTreatAsEsm: ['.ts'],
    verbose: true,
    globals: {
        'ts-jest': {
            useESM: true,
            diagnostics: true
        },
    },
}
