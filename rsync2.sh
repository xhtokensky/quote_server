#!/bin/sh

rsync -zvrtopgl --progress --exclude=node_modules --exclude=logs * hardrole@192.168.3.14:/home/hardrole/tokensky/tokensky_quote_server
echo "rsync dev successful"
