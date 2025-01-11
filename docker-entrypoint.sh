#!/bin/sh -l
cd /usr/src/app

bun run sub-store.js &

sleep 3

bun run index.ts
