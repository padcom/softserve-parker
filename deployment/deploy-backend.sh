#!/bin/bash -e

echo "================================================================"
echo "Building backend..."
echo "================================================================"
cd ../backend
npm ci
npm run build

echo "================================================================"
echo "Deploying database migrations..."
echo "================================================================"
cd $GIT_DIR/../backend
npm run db:migrate

echo "================================================================"
echo "Deploying backend..."
echo "================================================================"
sudo pm2 stop parker
rm -rf $DEPLOYMENT_DIR/*
cp -r app $DEPLOYMENT_DIR/
cp -r node_modules $DEPLOYMENT_DIR/
cp tsconfig.json $DEPLOYMENT_DIR/
cp database.json $DEPLOYMENT_DIR/
cp ecosystem.config.js $DEPLOYMENT_DIR/

sudo pm2 restart parker
