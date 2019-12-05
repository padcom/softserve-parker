#!/bin/sh -e

docker build -t parker-apache .
docker tag parker-apache docker-registry.aplaline.com/parker-apache
docker push docker-registry.aplaline.com/parker-apache
