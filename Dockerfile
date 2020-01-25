FROM parker-runtime

MAINTAINER Matthias Hryniszak <padcom@gmail.com>

ARG domain=parker-qa.aplaline.com

ENV CONFIRM_URL_BASE=http://$domain

COPY backend/dist /app/
COPY backend/node_modules /app/node_modules
COPY backend/private.key /app/
COPY backend/public.key /app/

COPY backend/migrations /app/migrations
COPY backend/package.json /app/package.json

COPY frontend/dist /app/public
COPY admin/dist /app/public/admin

CMD node app/main.js

EXPOSE $port
