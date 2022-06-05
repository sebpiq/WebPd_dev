#!/bin/sh
mocha \
    -r esm --require ts-node/register --extensions ts,tsx \
    --watch --watch-files $1/src \
    $1/src/*test.ts $1/src/**/*test.ts