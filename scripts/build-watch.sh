#!/bin/sh
set -e
trap "exit" INT TERM
trap "kill 0" EXIT

cd ../WebPd_compiler ; npm run build:dist -- --watch &
cd ../WebPd_compiler ; npm run build:bindings -- --watch &
cd ../WebPd_pd-parser ; npm run build:dist -- --watch &
cd ../WebPd_runtime ; npm run build:dist -- --watch &
cd ../WebPd_runtime ; echo src/WebPdWorkletProcessor.ts | entr npm run build:worklet-processor & 
cd ../WebPd ; npm run build:runtime -- --watch &
cd ../WebPd ; npm run build:dist -- --watch &
cd ../WebPd_website ; npm run build:workers -- --watch