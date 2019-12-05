#!/bin/sh -e

rm -rf node_modules dist
docker run --rm -it -v $(pwd):/build -v $(pwd)/../.npm-cache:/home/node/.npm parker-build npm install
docker run --rm -it -v $(pwd):/build -v $(pwd)/../.npm-cache:/home/node/.npm parker-build npm run build
