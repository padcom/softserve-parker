#!/bin/sh -e

docker build -t parker-apache .
docker tag parker-apache localhost:5000/parker-apache
docker push localhost:5000/parker-apache
