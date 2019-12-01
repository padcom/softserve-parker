#!/bin/sh -e

docker build -t parker-runtime .
docker tag parker-runtime localhost:5000/parker-runtime
docker push localhost:5000/parker-runtime
