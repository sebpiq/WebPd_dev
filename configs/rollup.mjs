import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { string } from 'rollup-plugin-string'
import fs from 'fs'
import path from 'path'

const MODULE_ROOT = process.cwd()

const PACKAGE_JSON = JSON.parse(
    fs.readFileSync(path.resolve(MODULE_ROOT, 'package.json'), {
        encoding: 'utf-8',
    })
)

const GENERATED_TS_CONFIG_PATH = './tsconfig-generated-for-rollup.json'

// Didn't manage to use a shared tsconfig file for rollup, which would live
// in a separate repo (WebPd_shared), so we're generating it here using a template.
const TS_CONFIG = `{
    "compilerOptions": {
        "module": "ESNext",
        "target": "es2021",
        "esModuleInterop": true,
        "removeComments": true,
        "noImplicitAny": true,
        "preserveConstEnums": true,
        "sourceMap": true,
        "declaration": true,
        "declarationDir": "types"
    },
    "typeRoots": ["./node_modules/@types"],
    "include": [
        "index.ts",
        "global.d.ts",
        "src",
        "@types/**/*.d.ts",
        "node_modules/@webpd/shared/types/*.ts"
    ]
}`
fs.writeFileSync(GENERATED_TS_CONFIG_PATH, TS_CONFIG)

export const buildRollupConfig = (options = {}) => {
    options.importAsString = options.importAsString || []
    // '**/*.asc'
    return [
        // Typescript compilation
        {
            input: 'index.ts',
            output: {
                file: PACKAGE_JSON.main,
                sourcemap: true,
            },
            plugins: [
                string({
                    include: options.importAsString,
                }),
                typescript({ tsconfig: GENERATED_TS_CONFIG_PATH }),
                nodeResolve(),
                commonjs(),
            ],
        },
    ]
}

export default buildRollupConfig()
