#!/bin/sh -e

ssh -t parker-qa "cd parker/backend && docker-compose up -d mysql"
