This repository contains the specification of **JSKOS data format for knowledge organization systems** based on JSON and SKOS. See <http://gbv.github.io/jskos/>.

Examples included in directory `examples` are checked against JSKOS JSON Schema and converted to RDF with JSON-LD. 

[![Test](https://github.com/gbv/jskos/actions/workflows/test.yml/badge.svg)](https://github.com/gbv/jskos/actions/workflows/test.yml)

When releasing a new version of the spec, run `npm version patch` (or `minor`/`major`) to both add a Git tag for the version as well as update the version number in `package.json`.
