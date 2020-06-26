import path from 'path'
import fs from 'fs'
const TEST_PATCHES_DIR = path.resolve(__dirname)
  
export default {
    subpatches: fs
        .readFileSync(path.join(TEST_PATCHES_DIR, 'subpatches.pd'))
        .toString(),
    simple: fs
        .readFileSync(path.join(TEST_PATCHES_DIR, 'simple.pd'))
        .toString(),
    nodeElems: fs
        .readFileSync(path.join(TEST_PATCHES_DIR, 'node-elems.pd'))
        .toString(),
    arrays: fs
        .readFileSync(path.join(TEST_PATCHES_DIR, 'arrays.pd'))
        .toString(),
    graphs: fs
        .readFileSync(path.join(TEST_PATCHES_DIR, 'graphs.pd'))
        .toString(),
    objectSizePdVanilla: fs
        .readFileSync(path.join(TEST_PATCHES_DIR, 'object-size-pd-vanilla.pd'))
        .toString(),
    portletsOrder1: fs
        .readFileSync(path.join(TEST_PATCHES_DIR, 'portlets-order1.pd'))
        .toString(),
    portletsOrder2: fs
        .readFileSync(path.join(TEST_PATCHES_DIR, 'portlets-order2.pd'))
        .toString(),
}
  