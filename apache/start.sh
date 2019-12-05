#!/bin/sh

rm -f /run/apache2/apache2.pid
/usr/sbin/apache2ctl -D FOREGROUND
