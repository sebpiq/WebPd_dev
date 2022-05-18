#!/bin/sh
TS_NODE_FILES=true mocha \
    --require ts-node/register --extensions ts,tsx \
    --watch --watch-files $1/src \
    $1/src/*test.ts $1/src/**/*test.ts