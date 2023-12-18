import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import { visualizer } from 'rollup-plugin-visualizer'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { string } from 'rollup-plugin-string'
import fs from 'fs'
import path from 'path'

const GENERATED_TS_CONFIG_PATH = './tsconfig-generated-for-rollup.json'

const DIST_DIR = 'dist'

// Didn't manage to use a shared tsconfig file for rollup, which would live
// in a separate repo (WebPd_dev), so we're generating it here using a template.
const makeTsConfig = (options) => `{
    "compilerOptions": {
        "module": "ES2022",
        "target": "ES2021",
        "esModuleInterop": true,
        "removeComments": false,
        "noImplicitAny": true,
        "preserveConstEnums": true,
        "sourceMap": ${JSON.stringify(options.sourcemap)},
        "declaration": true,
        "declarationDir": "${path.resolve(DIST_DIR, 'types')}",
        "resolveJsonModule": true
    },
    "typeRoots": ["./node_modules/@types"],
    "include": [
        "index.ts",
        "*.d.ts",
        "src",
        "@types/**/*.d.ts"
    ],
}`

export const buildRollupConfig = (options = {}) => {
    options.preserveModules = options.preserveModules !== undefined
        ? options.preserveModules
        : true
    
    options.sourcemap = options.sourcemap !== undefined
        ? options.sourcemap
        : true

    fs.writeFileSync(GENERATED_TS_CONFIG_PATH, makeTsConfig(options))

    let plugins = [
        options.importAsString
            ? string({
                  include: options.importAsString,
              })
            : null,
        typescript({ tsconfig: GENERATED_TS_CONFIG_PATH }),
        nodeResolve(),
        commonjs(),
        json(),
        visualizer({
            template: 'network',
            filename: './tmp/rollup-stats.html',
        }),
    ]
    plugins = plugins.filter((plugin) => !!plugin)

    return {
        input: 'index.ts',
        output: {
            format: 'esm',
            dir: DIST_DIR,
            preserveModules: options.preserveModules,
            sourcemap: options.sourcemap,
        },
        plugins,
    }
}

export default buildRollupConfig()
