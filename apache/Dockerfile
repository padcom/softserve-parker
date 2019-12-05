FROM debian:jessie

MAINTAINER Matthias Hryniszak <padcom@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
    apt-get install -y apache2 && \
    apt-get autoclean && apt-get clean && apt-get autoremove --purge && \
    rm -rf /var/lib/apt/lists/* && \
    rm -rf /tmp/*

RUN a2enmod proxy_http

ADD 001-parker.conf /etc/apache2/sites-enabled/

ADD start.sh /

CMD [ "/start.sh" ]
