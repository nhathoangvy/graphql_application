#!/usr/local/bin/bash
cmd="deno test --allow-net --allow-env  --allow-write --allow-read --allow-plugin ./tests/main_test.ts";
eval $cmd