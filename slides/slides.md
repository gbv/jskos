---
title: JSKOS
subtitle: knowledge organization systems in JSON
author: Jakob Voß
header-includes:
    - '\setsansfont{DejaVu Sans}'
    - '\usepackage{scrextend}'
    - '\changefontsizes{16pt}'
...


# Knowledge Organization Systems

* thesauri, classifications, taxonomies, subject-headings...
* controlled vocabularies
* "lightweight ontologies"


# Simple Knowledge Organization System (SKOS)

* RDF ontology to express\
  knowledge organization systems
* widely used in the Linked Open Data cloud


# RDF

* model (graph) 
* philosophy (open world assumption)
* technology (parser, store & query processor)

*😞  difficult to use in web applications*


# JSON

* model (arrays, objects, strings...)
* technology (JavaScript)

*😄  easy to use in web applications *


# JSON-LD

* JSON with minimal restrictions
* can be mapped to RDF\
  with a context definition

*😒  open world assumption*

*😵  no unique JSON format for given RDF data*


# JSKOS

* JSON format for knowledge organization systems
* use case: web applications and JSON APIs
* demo implementation
  [ng-skos](https://github.com/gbv/ng-skos)
  in AngularJS

* specified at <http://gbv.github.io/jskos/>

# Example

\fontsize{10}{12}\selectfont

```json
{
    "uri": "http://dewey.info/class/641.5/",
    "notation": ["641.5"],
    "inScheme": "http://dewey.info/",
    "prefLabel": {
        "en": "Cooking",
        "de": "Kochen"
    },
    "broader": [ {
        "uri": "http://dewey.info/class/641/e23/",
        "notation": ["641"]
    } ]
}
```

# Concepts in JSKOS 

...

# Concept Schemes in JSKOS 

...


# Mappings in JSKOS

...

# open / closed world statements

open world: *unknown*
  : \ \
    no `narrower` key

closed world: *explicit negation/existence*
  : \ \
    `"narrower": false`\
    `"narrower": []`\
    `"narrower": true`

*😎  good for incomplete data (e.g. async loading)*


# JSKOS and JSON-LD

* context definition for JSKOS exists
* closed world statements must first be removed


JSKOS + context definition $\rightarrow$ SKOS/RDF


# JSKOS and SKOS/RDF

* SKOS
    * no closed world statements
* JSKOS
    * no notation datatypes
    * no concept collections (yet?)
    * ...

*😴   some missing features may be added*


# Summary

...

<http://gbv.github.io/jskos>


# ng-skos

...

