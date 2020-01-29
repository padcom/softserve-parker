#!/bin/sh -e

chmod o+w .

rm -rf node_modules
docker run --rm -it -v $(pwd):/build -v $(pwd)/../common:/common -v $(pwd)/../.npm-cache:/home/node/.npm parker-build npm ci
docker run --rm -it -v $(pwd):/build -v $(pwd)/../common:/common -v $(pwd)/../.npm-cache:/home/node/.npm parker-build npm run build

rm -rf node_modules
docker run --rm -it -v $(pwd):/build -v $(pwd)/../common:/common -v $(pwd)/../.npm-cache:/home/node/.npm parker-build npm ci --production
