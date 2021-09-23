#!/bin/sh

YELLOW='\033[0;33m'
CYAN='\033[0;36m'
IP=`ifconfig | grep broadcast | cut -d ' ' -f2`


echo "${YELLOW}Change of config .env, addition of IP: ${CYAN}${IP}"
sed "s/localhost/$IP/g" ./backend/.env > ./backend/.env_tmp
mv ./backend/.env_tmp ./backend/.env
