#!/bin/sh -e

docker build -t parker-build .
docker tag parker-build localhost:5000/parker-build
docker push localhost:5000/parker-build
