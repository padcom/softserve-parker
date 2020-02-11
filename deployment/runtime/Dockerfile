FROM node:12

MAINTAINER Matthias Hryniszak <padcom@gmail.com>

RUN mkdir /app && \
    chown node:node /app

ENV NODE_ENV=production

ENV TZ=Europe/Warsaw
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app
USER node:node
