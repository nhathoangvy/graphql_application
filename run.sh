#!/usr/local/bin/bash

cmd="source .env && deno run --allow-net --allow-env  --allow-write --allow-read --allow-plugin server.ts";
eval $cmd