#!/bin/bash

echo "Fields defined in schema but not used in examples:"
diff -u \
    <(jq -r 'if type=="array" then .[] else . end|keys[]' examples/*.json | sort -u | egrep ^[a-z]) \
    <(jq -r '.properties|keys[]' schemas/*.json | sort -u) \
   | grep -E '^[+-][a-z]'
