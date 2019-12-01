#!/bin/sh -e

ssh -t parker-qa "docker pull localhost:5000/parker-app"
ssh -t parker-qa "cd parker/backend && docker-compose up -d parker"
