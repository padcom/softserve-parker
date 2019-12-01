#!/bin/sh -e

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
docker tag parker-app localhost:5000/parker-app
docker push localhost:5000/parker-app
