#!/bin/sh

docker stop parker-mysql
docker rm parker-mysql
docker volume rm backend_parker-mysql-db
