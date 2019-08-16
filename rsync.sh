#!/bin/sh

rsync -zvrtopgl --progress --exclude=node_modules --exclude=logs * root@118.31.121.239:/root/tokensky/tokensky_quote_server
echo "rsync dev successful"
