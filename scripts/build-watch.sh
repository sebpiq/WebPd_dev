#!/bin/sh
set -e
trap "exit" INT TERM
trap "kill 0" EXIT

cd ../WebPd_compiler-js ; npm run rollup -- --watch &
cd ../WebPd_compiler-js ; npm run rollup:assemblyscript-wasm-bindings -- --watch &
cd ../WebPd_compiler-js ; echo src/engine-assemblyscript/core-code/fs.asc | entr npm run transpile &
cd ../WebPd_pd-registry ; npm run rollup -- --watch & 
cd ../WebPd_audioworklets ; npm run rollup -- --watch &
cd ../WebPd_audioworklets ; echo src/WebPdWorkletProcessor.ts | entr npm run transpile