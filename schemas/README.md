This directory contains JSON Schema files for each JSKOS object type.

The core parts of each schema can be extracted with jq like this:

    jq '[.title,.allOf?,.anyOf?,.properties]' *.json
