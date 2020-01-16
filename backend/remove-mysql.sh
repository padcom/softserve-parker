#!/bin/sh

docker stop parker-mysql
docker rm parker-mysql
docker volume rm parker_parker-mysql-db
