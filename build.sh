#!/bin/bash
#Build script for parker frontend & backend
#This is the sole build script Jenkins uses, no other scripts present
set -e # quit on error
pm2 kill

cd ./backend
rm -rf node_modules
npm ci  #npm i is slower
npm run build

cd ../frontend
rm -rf node_modules
npm ci
npm run build

cd /var/lib/jenkins/workspace/parker
pm2 start
