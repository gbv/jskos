# Introduction

**JSKOS** defines a JSON structure to encode simple knowledge organization
systems, such as classifications and thesauri. The data format can be mapped
from and to [RDF/SKOS] for most instances, but not all features of SKOS are
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

<div class="example">
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
</div>

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

<div class="note">
It is *not possible* to indicate the existence of an unknown URI, unknown
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
</div>

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

<div section="note">
This may be modified because skos:ConceptScheme does not support prefLabel, altLabel, notation (?)
</div>

# Mappings
[mappings]: #mappings

A **mapping** represents a mapping between [concepts] of two [concept schemes].
Mappings are based on 
[SKOS mapping properties](http://www.w3.org/TR/skos-reference/#mapping).

...*this part of the specification has to be written*...


# Integrity rules

URIs of concepts and concept schemes in a JSKOS document **must** be unique.


[RDF/SKOS]: http://www.w3.org/2004/02/skos/
[ng-skos]: http://gbv.github.io/ng-skos/
[SKOS Concept Scheme]: http://www.w3.org/TR/skos-primer/#secscheme 

# References

## Normative references {.unnumbered}

* A. Phillips, M. Davis: *Tags for Identifying Languages.*
  IETF Best Current Practice BCP 47, September 2009
  <http://tools.ietf.org/html/bcp47>

* S. Bradner: *Key words for use in RFCs to Indicate Requirement Levels*. 
  RFC 2119, March 1997. <https://tools.ietf.org/html/rfc2119>

* M. Dürst, M. Suignard: *Internationalized Resource Identifiers (IRIs)*. 
  RFC 3987, January 2005. <https://tools.ietf.org/html/rfc3987>

* D. Crockford: *The application/json Media Type for JavaScript Object Notation (JSON)*.
  RFC 4627, July 2006. <https://tools.ietf.org/html/rfc4627>

## Informative references {.unnumbered}

* Alistair Miles, Sean Bechhofer (Editors): *SKOS Reference*. W3C
  Recommendation, 18 August 2009. <http://www.w3.org/TR/skos-reference>

* Jakob Voß, Moritz Horn: *ng-skos*. AngularJS module.  
  <https://github.com/gbv/ng-skos>.

* Manu Sporny, Dave Longley, Gregg Kellogg, Markus Lanthaler, 
  Niklas Lindström (Editors): *JSON-LD 1.0*. W3C
  Recommendation, 16 January 2014. <http://www.w3.org/TR/json-ld/>

# Appendices

The following appendices are *non-normative*.

## SKOS features not supported in JSKOS {.unnumbered}

JSKOS is aligned with SKOS but all references to SKOS are informative only.
The following features of SKOS are not supported in JSKOS (yet):

will be supported
  : * [Documentation Properties](http://www.w3.org/TR/2009/REC-skos-reference-20090818/#notes)
    * [Mapping properties](http://www.w3.org/TR/2009/REC-skos-reference-20090818/#mapping)
maybe supported later
  : * skos:hiddenLabel
    * skos:topConceptOf
    * [Concept Collections](http://www.w3.org/TR/2009/REC-skos-reference-20090818/#collections)
will not be supported
  : * datatypes of notations
    * skos:semanticRelation (can be derived)
    * skos:narrowerTransitive (can be derived)

## JSKOS features not supported in SKOS

The following features of JSKOS have no corresponce in SKOS:

* Closed world assumption
* Order of broaderTransitive (can be derived)

## JSON-LD context {.unnumbered}

The following [JSON-LD context document] can be used to map JSKOS to map JSKOS
to RDF triples. Boolean values (e.g. `"narrower": true` to indicate the
existence of narrower concepts) must be removed before conversion.

[JSON-LD context document]: http://www.w3.org/TR/json-ld/#the-context


```json
{
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "uri": "@id",
    "notation": "skos:notation",
    "prefLabel": {
        "@id": "skos:prefLabel",
        "@container": "@language"
    },
    "altLabel": {
        "@id": "skos:altLabel",
        "@container": "@language"
    },
    "narrower": "skos:narrower",
    "broader": "skos:broader",
    "related": "skos:related",
    "ancestors": "skos:broaderTransitive",
    "inScheme": {
        "@id": "skos:inScheme",
        "@type": "@id"
    },
    "topConcepts": "skos:hasTopConcept"
}
```

## Examples 

<div class="example">
A concept from the abbbridget Dewey Decimal Classification, edition 23:

```json
{
    "uri": "http://dewey.info/class/641.5/e23/",
    "notation": ["641.5"],
    "inScheme": "http://dewey.info/edition/e23/",
    "prefLabel": {
        "en": "Cooking",
        "de": "Kochen",
        "it": "..."
    },
    "broader": [
        {
            "uri": "http://dewey.info/class/641/e23/",
            "notation": ["641"],
            "prefLabel": {
                "en": "Food and drink",
                "de": "Essen und Trinken",
                "it": "..."
            }
        }
    ],
    "narrower": [
        {
            "uri": "http://dewey.info/class/641.502/e23/",
            "notation": ["641.502"],
            "prefLabel": {
                "en": "Miscellany",
                "de": "",
                "it": ""
            }
        },
        {
            "uri": "http://dewey.info/class/641.508/e23/",
            "notation": ["641.508"],
            "prefLabel": {
                "en": "Cooking with respect to kind of persons",
                "de": "",
                "it": "Cucina in riferimento a categorie di persone"
            }
        },
        {
            "uri": "http://dewey.info/class/641.509/e23/",
            "notation": ["641.509"],
            "prefLabel": {
                "en": "Historical, geographic, persons treatment",
                "de": "",
                "it": "Storia, geografia, persone"
            },
            "narrower": [
                {
                    "uri": "http://dewey.info/class/641.5092/e23/",
                    "notation": ["641.5092"],
                    "prefLabel": {
                        "en": "Cooks",
                        "de": "Köche",
                        "it": "Cuochi"
                    }
                }
            ]
        },
        {
            "uri": "http://dewey.info/class/641.59/e23/",
            "notation": ["641.59"],
            "prefLabel": {
                "en": "Cooking characteristic of specific geographic environments, ethnic cooking",
                "de": "",
                "it": "Cucina tipica di specifici ambienti geografici, cucina etnica"
            }
        }
    ]
}
```
</div>

----

This version: <http://gbv.github.io/jskos/{CURRENT_VERSION}.html> ({CURRENT_TIMESTAMP})\
Latest version: <http://gbv.github.io/jskos/> 

Created with [makespec](http://jakobib.github.io/makespec/)

