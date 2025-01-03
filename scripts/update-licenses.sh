#!/bin/bash

python3 -m licenseheaders -t node_modules/@webpd/dev/assets/lgpl-v3.tmpl \
    -y 2022-2025 \
    -o "Sébastien Piquemal <sebpiq@protonmail.com>, Chris McCormick" \
    -n WebPd \
    -u https://github.com/sebpiq/WebPd \
    -d src/