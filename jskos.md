# Introduction

**JSKOS** defines a JavaScript Object Notation (JSON) structure to encode
knowledge organization systems, such as classifications, thesauri, and
authority files. The current draft of JSKOS supports encoding of [concepts] and
[concept schemes] with their corresponding properties. A later version will
also support [concept mappings] and [concept collections].

The main part of JSKOS is compatible with Simple Knowledge Organisation System
(SKOS) and JavaScript Object Notation for Linked Data (JSON-LD) but JSKOS can
be used without having to be experienced in any of these technologies. A simple
JSKOS document can be mapped to SKOS expressed in the Resource Description
Framework (RDF), and vice versa. An extended JSKOS document may further include
[closed world statements] without correspondence in RDF. This feature
especially allows for use of knowledge organization systems in web
applications.

JSKOS is currently being developed as part of [ng-skos] but it can be used
independently. The specification is hosted at <http://gbv.github.io/jskos/> in
the public GitHub repository <https://github.com/gbv/jskos>. Feedback is
appreciated!

# Concepts
[concept]: #concepts
[concepts]: #concepts

A **concept** represents a [SKOS Concept](http://www.w3.org/TR/skos-primer/#secconcept).
A concept is a JSON object with the following properties:

name        |type                       |description
------------|---------------------------|------------------------------------------------
uri         |string                     |URI of the concept
type        |string                     |the value `skos:Concept`
notation    |array of strings           |list of notations
prefLabel   |object of strings          |preferred concept labels, index by language
altLabel    |object of arrays of strings|alternative concept labels, indexed by language
hiddenLabel |object of arrays of strings|hidden concept labels, indexed by language
narrower    |boolean or array of objects|narrower concepts
broader     |boolean or array of objects|broader concepts
related     |boolean or array of objects|related concepts
ancestors   |boolean or array of objects|list of ancestors, possibly up to a top concept
inScheme    |array of strings or objects|[concept scheme]s or URI of the concept schemes
topConceptOf|array of strings or objects|[concept scheme]s or URI of the concept schemes
@context    |string                     |URI referencing a [JSKOS context document]

All properties are optional, so the empty object `{}` is also a valid concept.
Additional properties, not included in this list, should be ignored.

Applications MAY use only the first element of property `notation` and/or property
`inScheme` for simplification.

The "ancestors" field only makes sense monohierarchical classifications but
it's not forbidden to choose jus one arbitrary path of concepts that are
connected by the narrower relation.

<div class="example">
```json
{
  "uri": "http://example.org/terminology/P",
  "type": "skos:Concept",
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

# Concept Schemes
[concept scheme]: #concept-schemes
[concept schemes]: #concept-schemes

A **concept scheme** represents a [SKOS Concept Scheme].
A concept scheme is a JSON object with the following properties:

property   |type                       |definition
-----------|---------------------------|--------------------------
uri        |string                     |URI of the concept scheme
type       |string                     |the value `skos:ConceptScheme`
notation   |array of strings           |list of acronyms or notations of the concept scheme
prefLabel  |object of strings          |preferred titles of the concept scheme, index by language
altLabel   |object of arrays of strings|alternative titles of the concept scheme, indexed by language
hiddenLabel|object of arrays of strings|hidden titles of the concept scheme, indexed by language
topConcepts|array of objects           |top concepts of the concept scheme
@context   |string                     |URI referencing a [JSKOS context document]

All properties are optional, so the empty object `{}` is also a valid concept
scheme. Additional properties, not included in this list, should be ignored.

<div section="note">
notation and label properties do not imply a domain, so they can be used for both, concepts and concept schemes.
</div>


# Mappings
[mappings]: #mappings
[concept mappings]: #mappings

A **mapping** represents a mapping between [concepts] of two [concept schemes].

Support to encode mappings, based on 
[SKOS mapping properties](http://www.w3.org/TR/skos-reference/#mapping)
is planned.


# Collections
[collections]: #collections
[concept collections]: #collections

Support to encode [collections of
concepts](http://www.w3.org/TR/skos-primer/#seccollections) is planned.


# Closed world statements
[closed world statements]: #closed-world-statements

By default, an JSKOS document should be interpreted as possible incomplete: a
missing property does not imply that no value exists for this property: this
assumption is also known as open-world assumption. A JSKOS document may include
special closed world statements to explicitly disable the open world assumption
for selected properties.

Applications may use empty arrays, objects, or boolean values (`true` and
`false`) to explicitly state the known absence or existence of the following
properties:

property  | explicit negation | explicit existence
----------|-------------------|-------------------
notation  | `[ ]` or `false`  | `true`
prefLabel | `{ }` or `false`  | `true`
altLabel  | `{ }` or `false`  | `true`
narrower  | `[ ]` or `false`  | `true`
broader   | `[ ]` or `false`  | `true`
ancestors | `[ ]` or `false`  | `true`
related   | `[ ]` or `false`  | `true`

*TODO:* is it possible to express existence of labels in unknown languages?

<div class="example">
The following concept has at least one preferred label but no alternative
labels, notations, nor narrower concepts. Nothing is known about broader
concepts, related concepts, and other possible concept properties:

```json
{
  "type": "skos:Concept",
  "prefLabel": true,
  "altLabel": { },
  "notation": [ ],
  "narrower": false
}
```
</div>

<div class="note">
It is *not possible* to indicate the existence of an unknown URI, unknown
preferred labels, and an unknown concept scheme. The following key-value 
pairs are **not allowed**, each:

```json
{
  "uri": true,
  "prefLabel": { "en": false, "es": true },
  "altLabel": { "en": [] },
  "inScheme": true
}
```
</div>


# Integrity rules

URIs of concepts and concept schemes in a JSKOS document **must** be unique.

*topConceptOf is a sub-property of inScheme*

[RDF/SKOS]: http://www.w3.org/2004/02/skos/
[ng-skos]: http://gbv.github.io/ng-skos/
[SKOS Concept Scheme]: http://www.w3.org/TR/skos-primer/#secscheme 

# References {.unnumbered}

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

# Appendices {.unnumbered}

The following appendices are *non-normative*.

## SKOS features not supported in JSKOS {.unnumbered}

JSKOS is aligned with SKOS but all references to SKOS are informative only.
The following features of SKOS are not supported in JSKOS (yet):

will be supported
  : * [documentation properties]
    * [mapping properties]
maybe supported later
  : * [Concept Collections](http://www.w3.org/TR/2009/REC-skos-reference-20090818/#collections)
    * [closed world statements] about missing or more languages
will not be supported
  : * datatypes of notations (of little use in practice)
    * labels and notes without language tag (rarely used in practice)
    * skos:semanticRelation (can be derived)
    * skos:narrowerTransitive (can be derived)

[documentation properties]: http://www.w3.org/TR/2009/REC-skos-reference-20090818/#notes
[mapping properties]: http://www.w3.org/TR/2009/REC-skos-reference-20090818/#mapping

## JSKOS features not supported in SKOS {.unnumbered}

The following features of JSKOS have no corresponce in SKOS:

* [closed world statements](#closed-world-statements)
* order of broaderTransitive statements (can be derived)
* order of multiple notations
* order of multiple inScheme statements

## JSON-LD context {.unnumbered}

The following [JSON-LD context document] can be used to map JSKOS to map JSKOS
to RDF triples. Boolean values (e.g. `"narrower": true` to indicate the
existence of narrower concepts) must be removed before conversion. Type
information (`rdf:type skos:Concept` or `rdf:type skos:ConceptScheme`) SHOULD
also be added as it is implicitly given in JSKOS.

[JSON-LD context document]: http://www.w3.org/TR/json-ld/#the-context

```json
{
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "uri": "@id",
    "type" "http://www.w3c.org/1999/02/22-rdf-syntax-ns#type",
    "notation": "skos:notation",
    "prefLabel": {
        "@id": "skos:prefLabel",
        "@container": "@language"
    },
    "altLabel": {
        "@id": "skos:altLabel",
        "@container": "@language"
    },
    "hiddenLabel": {
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
    "topConceptOf": {
        "@id": "skos:topConceptOf",
        "@type": "@id"
    },
    "topConcepts": "skos:hasTopConcept"
}
```

## Examples  {.unnumbered}

<div class="example">
A concept from the abbbridget Dewey Decimal Classification, edition 23:

```json
{
    "uri": "http://dewey.info/class/641.5/e23/",
    "notation": ["641.5"],
    "inScheme": ["http://dewey.info/edition/e23/"],
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

