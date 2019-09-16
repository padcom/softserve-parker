#!/bin/bash
#Build script for parker frontend & backend
#This is the sole build script Jenkins uses, no other scripts present
set -e # quit on error

## https://stackoverflow.com/a/38928517/10706046
#export BUILD_ID=dontKillMePlease

pm2 kill

echo "Building backend"
cd ./backend
echo 'Backend: npm install'
npm i
echo 'Backend: build'
npm run build

echo "Building frontend"
cd ../frontend
echo 'Frontend: npm install'
npm i
echo 'Frontend: build'
npm run build


echo "Spawning PM2"
cd ../
JENKINS_NODE_COOKIE=dontKillMe pm2 start

