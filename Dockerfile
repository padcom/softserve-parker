FROM parker-runtime

MAINTAINER Matthias Hryniszak <padcom@gmail.com>

ARG domain=parker.aplaline.com
ARG port=3000

ENV CONFIRM_URL_BASE=http://$domain
ENV SMTP_HOST=127.0.0.1
ENV SMTP_PORT=2525
ENV SMTP_SECURE=false
ENV SMTP_USER=
ENV SMTP_PASSWORD=
ENV GELF_HOST=
ENV GELF_PORT=
ENV LOG_LEVEL=info

COPY common /common/
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
