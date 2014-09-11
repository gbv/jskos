# Introduction

**JSKOS** defines a JSON structure to encode simple knowledge organization
systems, such as classifications and thesauri. The data format can be mapped
from and to [RDF/SKOS] for most instances but not all features of SKOS are
supported.

JSKOS is currently being developed as part of [ng-skos] but it can be used
independently. Why JSKOS? Because RDF is good for exchange, aggregation,
combination, and modeling but not for processing in web applications.

In short, JSKOS consists of [concepts], [concept schemes], and [mappings].
Concept collections for grouping and sorted concepts are not supported (yet?).

The specification is hosted at <http://gbv.github.io/jskos/> in the
public GitHub repository <https://github.com/gbv/jskos>. Feedback is
appreciated!

# Concepts
[concept]: #concepts
[concepts]: #concepts

A **concept** represents a [SKOS Concept](http://www.w3.org/TR/skos-primer/#secconcept).
A concept is a JSON object with the following keys:

name      |type                       |definition
----------|---------------------------|------------
uri       |string                     |URI of the concept
notation  |array of strings           |list of notations
prefLabel |object of strings          |preferred concept labels, index by language
altLabel  |object of arrays of strings|alternative concept labels, indexed by language
narrower  |boolean or array of objects|narrower concepts
broader   |boolean or array of objects|broader concepts
related   |boolean or array of objects|related concepts
ancestors |boolean or array of objects|list of ancestors, possibly up to a top concept
inScheme  |string or object           |[concept scheme] or URI of the concept scheme

All keys are optional, so the empty object `{}` is a valid concept.

The "ancestors" field only makes sense monohierarchical classifications but
it's not forbidden to choose jus one arbitrary path of concepts that are
connected by the narrower relation.

**Example:**

```json
{
  "uri": "http://example.org/terminology/P",
  "prefLabel": {
    "en": "peace",
    "de": "Frieden"
  },
  "altLabel": {
    "de": ["Friede"]
  },
  "notation": ["P"],
  "narrower": [
    {
      "prefLabel": {
        "en": "world peace",
        "de": "Weltfrieden"
      } 
    }
  ],
  "related": [
    { 
      "prefLabel": { "en": "war", "de": "Krieg" } 
    }
  ]
}

```

The order of alternative labels with same language and the order of narrower,
broader, or related concepts is irrelevant.

Applications may use empty arrays (`[]`) and boolean values (`true` and
`false`) to indicate the known absence or existence of a property in the
following cases:

---------------------------|-----------------------------------------------
`{ "notation": [ ] }`      | concept has no notations
`{ }` (no "notation" key)  | concept may have notations (unknown)
`{ "prefLabel": { } }`     | concept has no preferred labels
`{ }` (no "prefLabel" key) | concept may have preferred labels (unknown)
`{ "narrower": false }`    | no narrower concepts exist
`{ "narrower": [ ] }`      | no narrower concepts exist
`{ "narrower": true }`     | narrower concept exist but are not known
`{ }` (no "narrower" key)  | narrower concepts may exist (unknown)
...                        | same for "broader", "related", and "ancestors"

It is not possible to indicate the existence of an unknown URI, unknown
preferred labels, and an unknown concept scheme. The following is **not
allowed**:

```json
{
  "uri": true,
  "prefLabel": { "en": false, "es": true },
  "altLabel": { "en": [] },
  "inScheme": true
}
```


# Concept Schemes
[concept scheme]: #concept-schemes
[concept schemes]: #concept-schemes

A **concept scheme** represents a [SKOS Concept Scheme].
A concept scheme is a JSON object with the following keys:

name       |type                       |definition
-----------|---------------------------|--------------------------
uri        |string                     |URI of the concept scheme
notation   |array of strings           |list of acronyms or notations of the concept scheme
prefLabel  |object of strings          |preferred titles of the concept scheme, index by language
altLabel   |object of arrays of strings|alternative titles of the concept scheme, indexed by language
topConcepts|array of objects           |top concepts of the concept scheme

All keys are optional, so the empty object `{}` is a valid concept scheme (and also a valid [concept]).

# Mappings
[mappings]: #mappings

A **mapping** represents a mapping between [concepts] of two [concept schemes].
Mappings are based on 
[SKOS mapping properties](http://www.w3.org/TR/skos-reference/#mapping).

...

# Integrity rules

URIs **must** be unique.


[RDF/SKOS]: http://www.w3.org/2004/02/skos/
[ng-skos]: http://gbv.github.io/ng-skos/
[SKOS Concept Scheme]: http://www.w3.org/TR/skos-primer/#secscheme 

----

This version: <http://gbv.github.io/jskos/{CURRENT_VERSION}.html> ({CURRENT_TIMESTAMP})\
Latest version: <http://gbv.github.io/jskos/> 

Created with [makespec](http://jakobib.github.io/makespec/)

