#!/bin/sh -e

ssh -t parker-qa "docker pull docker-registry.aplaline.com/parker-app"
ssh -t parker-qa "cd parker/backend && docker-compose up -d parker"
ssh -t parker-qa "cd parker/backend && docker container prune -f"
ssh -t parker-qa "cd parker/backend && docker image prune -f"
