#!/bin/sh -e

docker build -t parker-build .
docker tag parker-build docker-registry.aplaline.com/parker-build
docker push docker-registry.aplaline.com/parker-build
