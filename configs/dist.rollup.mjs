import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import { visualizer } from 'rollup-plugin-visualizer'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { string } from 'rollup-plugin-string'
import path from 'path'

const TS_CONFIG_PATH = path.resolve('configs', 'dist.tsconfig.json')
const DIST_DIR = 'dist'
const TMP_DIR = 'tmp'
const INPUT_PATH = path.resolve('src', 'index.ts')

export const buildRollupConfig = (options = {}) => {
    options.preserveModules = options.preserveModules !== undefined
        ? options.preserveModules
        : true
    
    options.sourcemap = options.sourcemap !== undefined
        ? options.sourcemap
        : false

    let plugins = [
        options.importAsString
            ? string({
                  include: options.importAsString,
              })
            : null,
        typescript({ tsconfig: TS_CONFIG_PATH }),
        nodeResolve(),
        commonjs(),
        json(),
        visualizer({
            template: 'network',
            filename: path.resolve(TMP_DIR, 'rollup-stats.html'),
        }),
    ]
    plugins = plugins.filter((plugin) => !!plugin)

    return {
        input: INPUT_PATH,
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
