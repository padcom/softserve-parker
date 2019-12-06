#!/bin/sh -e

ssh -t parker-qa "docker pull docker-registry.aplaline.com/parker-apache"
ssh -t parker-qa "cd parker/backend && docker-compose up -d apache"
ssh -t parker-qa "cd parker/backend && docker container prune -f"
ssh -t parker-qa "cd parker/backend && docker image prune -f"
