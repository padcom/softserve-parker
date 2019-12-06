#!/bin/sh -e

ssh -t parker-qa "cd parker/backend && docker-compose up -d mysql"
ssh -t parker-qa "cd parker/backend && docker container prune -f"
ssh -t parker-qa "cd parker/backend && docker image prune -f"
