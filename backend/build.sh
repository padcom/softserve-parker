#!/bin/sh -e

rm -rf node_modules dist
docker run --rm -it -v $(pwd):/build parker-build npm install
docker run --rm -it -v $(pwd):/build parker-build npm run build

rm -rf node_modules
docker run --rm -it -v $(pwd):/build parker-build npm ci --production
