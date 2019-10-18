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
rm -rf /var/lib/parker/*
cp -r app /var/lib/parker/
cp -r node_modules /var/lib/parker/
cp tsconfig.json /var/lib/parker/
cp database.json /var/lib/parker/
cp ecosystem.config.js /var/lib/parker/
cp private.key /var/lib/parker/
cp public.key /var/lib/parker/

sudo pm2 restart parker
