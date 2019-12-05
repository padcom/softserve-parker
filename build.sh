#!/bin/sh -e

# Create a folder for caching NPM packages to speed up the build
rm -rf .npm-cache
mkdir -p .npm-cache

# Create apache container
cd apache
./build.sh

# Create build container
cd ../deployment/build
./build.sh

# Build parts of the application using build container
cd ../../backend
./build.sh

cd ../frontend
./build.sh

cd ../admin
./build.sh

# Create runtime container
cd ../deployment/runtime
./build.sh

# Build application
cd ../..
docker build -t parker-app .
docker tag parker-app docker-registry.aplaline.com/parker-app
docker push docker-registry.aplaline.com/parker-app
