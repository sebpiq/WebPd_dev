import typescript from '@rollup/plugin-typescript'
import { visualizer } from "rollup-plugin-visualizer"
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { string } from 'rollup-plugin-string'
import fs from 'fs'
import path from 'path'

const GENERATED_TS_CONFIG_PATH = './tsconfig-generated-for-rollup.json'

const DIST_DIR = 'dist'

// Didn't manage to use a shared tsconfig file for rollup, which would live
// in a separate repo (WebPd_dev), so we're generating it here using a template.
const TS_CONFIG = `{
    "compilerOptions": {
        "module": "ES2022",
        "target": "ES2021",
        "esModuleInterop": true,
        "removeComments": false,
        "noImplicitAny": true,
        "preserveConstEnums": true,
        "sourceMap": true,
        "declaration": true,
        "declarationDir": "${path.resolve(DIST_DIR, 'types')}"
    },
    "typeRoots": ["./node_modules/@types"],
    "include": [
        "index.ts",
        "*.d.ts",
        "src",
        "@types/**/*.d.ts"
    ]
}`
fs.writeFileSync(GENERATED_TS_CONFIG_PATH, TS_CONFIG)

export const buildRollupConfig = (options = {}) => {
    let plugins = [
        options.importAsString ? string({
            include: options.importAsString,
        }) : null,
        typescript({ tsconfig: GENERATED_TS_CONFIG_PATH }),
        nodeResolve(),
        commonjs(),
        visualizer({
            template: 'network',
            filename: './tmp/rollup-stats.html'
        }),
    ]

    plugins = plugins.filter(plugin => !!plugin)

    return [
        // Typescript compilation
        {
            input: 'index.ts',
            output: {
                preserveModules: true,
                dir: DIST_DIR,
                sourcemap: true,
                format: 'esm',
            },
            plugins,
        },
    ]
}

export default buildRollupConfig()
