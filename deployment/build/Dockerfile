FROM node:12

MAINTAINER Matthias Hryniszak <padcom@gmail.com>

RUN apt-get update && \
    apt-get install -yq git && \
    rm -rf /var/lib/apt/lists/* && \
    rm -rf /tmp/*

RUN git config --global url.https://.insteadOf git://

RUN mkdir /build && \
    chown node:node /build

WORKDIR /build
USER node:node
