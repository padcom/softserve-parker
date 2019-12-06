#!/bin/sh -e

docker build -t parker-runtime .
docker tag parker-runtime docker-registry.aplaline.com/parker-runtime
docker push docker-registry.aplaline.com/parker-runtime
