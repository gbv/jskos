#!/bin/bash

# check which fields ared defined in schema but not used in examples
diff -u \
    <(jq -r 'if type=="array" then .[] else . end|keys[]' examples/*.json | sort | uniq | egrep ^[a-z]) \
    <(jq -r '.properties|keys[]' schemas/*.json | sort | uniq) \
    | grep -E '^\+[a-z]'
