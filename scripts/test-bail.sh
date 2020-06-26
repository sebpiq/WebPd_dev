#!/bin/sh
TS_NODE_FILES=true mocha -b --require ts-node/register --extensions ts,tsx $1/src/*test.ts