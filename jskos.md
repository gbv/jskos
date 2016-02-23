# Introduction

**JSKOS** defines a JavaScript Object Notation (JSON) structure to encode
knowledge organization systems (KOS), such as classifications, thesauri, and
authority files. The current draft of JSKOS supports encoding of [concepts] and
[concept schemes] with their corresponding properties. Support of [concept
mappings] and [concept collections] is experimental.

The main part of JSKOS is compatible with Simple Knowledge Organisation System
(SKOS) and JavaScript Object Notation for Linked Data (JSON-LD) but JSKOS can
be used without having to be experienced in any of these technologies. A simple
JSKOS document can be mapped to SKOS expressed in the Resource Description
Framework (RDF), and vice versa. JSKOS further supports [closed world
statements] to express incomplete information about knowledge organization
systems to facilitate use in dynamic web applications.

## Status of this document

JSKOS is currently being developed as part of project [coli-conc].  The JSKOS
specification is hosted at <http://gbv.github.io/jskos/> in the public GitHub
repository <https://github.com/gbv/jskos>. Feedback is appreciated!  See
<https://github.com/gbv/jskos/issues> for a list of open issues.

[coli-conc]: https://coli-conc.gbv.de/

## Conformance requirements

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be
interpreted as described in [RFC 2119].

# Data types

[string]: #data-types
[boolean]: #data-types

JSKOS is based on JSON which consists of *objects* with pairs of *fields* and
*values*, *arrays* with *members*, *strings*, *numbers*, and the special values
`true`, `false`, and `null`.  All strings and fields of a JSKOS document MUST
be normalized to Unicode Normalization Form C (NFC). Applications processing
JSON MAY accept JSON documents not normalized in NFC by performing NFC
normalization.  JSKOS further restricts JSON with reference to the following
data types:

## URI

An **URI** is a syntactically correct IRI ([RFC 3987]).

## URL

An **URL** is a syntactically correct URL with HTTPS (RECOMMENDED) or HTTP scheme.

## date

A **date** is a date or datetime as defined with XML Schema datatype
[datetime](https://www.w3.org/TR/xmlschema-2/#dateTime)
(`-?YYYY-MM-DDThh:mm:ss(\.s+)?(Z|[+-]hh:mm)?`)
[date](https://www.w3.org/TR/xmlschema-2/#date) (`-?YYYY-MM-DD(Z|[+-]hh:mm)?`),
[gYearMonth](https://www.w3.org/TR/xmlschema-2/#gYearMonth) (`-?YYYY-MM`),
or [gYear](https://www.w3.org/TR/xmlschema-2/#gYear) (`-?YYYY`).

## list

[lists]: #list

A **list** is a possibly empty array of strings and an optional last member
`null`.  Applications MAY ignore or disallow the value `null` in lists. If
`null` is allowed, lists MUST be interpreted as following to support [closed
world statements]:

* the list `[]` denotes an empty list.
* the list `[null]` denotes a non-empty list with unknown members.
* a list `[..., null]` denotes a list with some known and additional unknown members.
* any other list `[...]` denotes a list with all members known.

## set

A **set** is a possibly empty array where all members

* are [objects], except the last member optionally being `null`,
* and have distinct values in field `uri`, if this field is given 
  (members MUST not be the [same object]).

Member objects SHOULD have a field `uri`. Applications MAY restrict sets to
require the field `uri` for all non-null members.  Applications MAY ignore or
disallow the value `null` in sets. If `null` is allowed, sets MUST be
interpreted as following to support [closed world statements]:

* the set `[]` denotes an empty set.
* the set `[null]` denotes a non-empty set with unknown members.
* a set `[..., null]` denotes a set with some known and additional unknown members.
* any other set `[...]` denotes a set with all members known.

<div class="example">
The following JSON values are JSKOS sets:

* `[]`{.json}
* `[null]`{.json}
* `[{"uri":"http://example.org/123"}]`{.json}
* `[{"uri":"http://example.org/123"},null]`{.json}
* `[{"uri":"http://example.org/123"},{"uri":"http://example.org/456"}]`{.json}
* `[{"uri":"http://example.org/123"},{"notation":["xyz"]}]`{.json}

The following JSON values are no valid JSKOS sets:

* `[null,{"uri":"http://example.org/123"}]`{.json}\
  (`null` must be last member)
* `[{"uri":"http://example.org/123"},{"uri":"http://example.org/123"}]`{.json}\
  (field `uri` not unique)
</div>

<div class="note">
It is not defined yet whether and when the order of elements is relevant or not.
</div>

## language range

A **language range** is 

* either the character "`-`"
* or a string that conforms to the syntax of [RFC 3066] language tags,
  limited to lowercase, followed by the character "`-`",

A language range "`x-`", where `x` is a possibly empty string, refers to the
set of [RFC 3066] language tags that start with the `x`. For instance language
range `en-` includes language tag `en`, `en-US`, and `en-GB` among others.  The
language range `-` refers to all possible language tags.

<div class="note">
A language range MUST conform to the following ABNF grammar ([RFC 5234]):

```abnf
language-range = [language-tag] "-"
language-tag   = 1*8alpha *("-" 1*8(alpha / DIGIT))
alpha          = %x61-7A  ; a-z
```

Language ranges are defined similar to basic language ranges in [RFC 4647].
Both can be mapped to each other but they serve slightly different purposes.
</div>

## language map

A **language map** is a JSON object in which every fields is

* either a [RFC 3066] language tag in lowercase that SHOULD also conform to [RFC 4646],
* or a [language range],

and 

* either all values are strings (**language map of strings**),
* or all values are [lists] (**language map of lists**).

Applications MAY ignore or disallow language ranges in language maps. If
language ranges are allowed, language maps MUST be interpreted as following to
support [closed world statements]:

* Language maps without language range fields indicate that all values are given.
  In particular the language map `{}` denotes an empty language map.

* A language range fields indicates the existence of additional, unknown
  values. The actual value mapped to from a language range field (either a
  string or an array) MUST be interpreted as placeholder for any number of
  additional entries in the language map.

Applications SHOULD use the string `"?"` or the array `["?"]` as placeholder.

<div class="example">
The following language maps make use of language ranges and placeholders:

* `{"-":"?"}`, `{"-":"..."}`, `{"-":[]}`, and `{"-":["?"]}`
   all denote non-empty language maps with unknown language tags and values.

* `{"en":"bird","-":"?"}` denotes a language map with an English value 
   and additional values in other language tags.

* `{"en":"bird"}` denotes a language map with an English value only.

* `{"en-":"?"}` denotes a language map that only 
  contains values with language tags starting with `en`.
</div>

<div class="note">
JSON-LD disallows language map fields ending with `"-"` so all fields that are 
language ranges MUST be removed before reading JSKOS as JSON-LD.
</div>


# Object types

## Object

[object]: #object
[objects]: #object

An **object** is a JSON object with the following optional fields:

field        type             description
----------- ----------------- ------------------------------------------------------------------
uri         [URI]             primary globally unique identifier
type        [list] of [URI]s  URIs of types
@context    [URI]             reference to a [JSON-LD context] document
created     [date]            date of creation
issued      [date]            date of publication
modified    [date]            date of last modification
creator     [set]             agent primarily responsible for creation of object
contributor [set]             agent responsible for making contributions to the object
publisher   [set]             agent responsible for making the object available
partOf      [set]             resources which this object is part of (if no other field applies)

It is RECOMMENDED to always include the fields `uri`, `type`, and `@context`.
The value of field `@context` SHOULD be
`https://gbv.github.io/jskos/context.json`.

### Object sameness {.unnumbered}

[same object]: #object-sameness
[the same]: #object-sameness

Two objects are *same* if they both contain field `uri` with the same value.


## Item

[item]: #item
[items]: #item

An **item** is an [object] with the following optional fields in addition:

field         type                      description
------------- ------------------------- ----------------------------------------------
url           string                    URL of a page with information about the item
identifier    [list]                    additional identifiers
notation      [list]                    list of notations
prefLabel     [language map] of strings preferred labels, index by language
altLabel      [language map] of [list]  alternative labels, indexed by language
hiddenLabel   [language map] of [list]  hidden labels, indexed by language
scopeNote     [language map] of [list]  see [SKOS Documentary Notes]
definition    [language map] of [list]  see [SKOS Documentary Notes]
example       [language map] of [list]  see [SKOS Documentary Notes]
historyNote   [language map] of [list]  see [SKOS Documentary Notes]
editorialNote [language map] of [list]  see [SKOS Documentary Notes]
changeNote    [language map] of [list]  see [SKOS Documentary Notes]
subject       [set]                     what this item is about (e.g. topic)
subjectOf     [set]                     resources about this item (e.g. documentation)
depiction     [list] of [URL]           list of image URLs depicting the item

Applications MAY limit the fields `notation` and/or `depiction` to lists of a single
element or ignore all preceding elements of these lists.


## Concept

[concept]: #concept
[concepts]: #concept

A **concept** is an [item] with the following optional fields in addition:

field        type   description
------------ ------ -------------------------------------------------------------------------------
narrower     [set]  narrower concepts
broader      [set]  broader concepts
related      [set]  generally related concepts
previous     [set]  related concepts ordered somehow before the concept
next         [set]  related concepts ordered somehow after the concept
startDate    [date] date of birth, creation, or estabishment of what the concept is about
endDate      [date] date death or resolution of what the concept is about
relatedDate  [date] other date somehow related to what the concept is about
ancestors    [set]  list of ancestors, possibly up to a top concept
inScheme     [set]  [concept schemes] or URI of the concept schemes
topConceptOf [set]  [concept schemes] or URI of the concept schemes

The first element of field `type`, if given, MUST be the URI
<http://www.w3.org/2004/02/skos/core#Concept> refering to the general [concept
type] "Concept".

Applications MAY limit the `inScheme` and/or `topConceptOf` to sets of a single
element or ignore all but one element of these sets.

If both fields `broader` and `ancestors` are given, the set `broader` MUST
include [the same] concept as the first element of `ancestors`.

<div class="note">
The "ancestors" field is useful in particular for monohierarchical classifications
but it's not forbidden to choose just one arbitrary path of concepts that are
connected by the broader relation.
</div>

<div class="example">
`examples/example.concept.json`{.include .codeblock .json}
</div>


## Concept types

[concept type]: #concept-types
[concept types]: #concept-types

A **concept type** is an [item] that represents a specific type of [concept]. 

<div class="note">
Each concept MUST belong to at least the general concept type "Concept", 
identified by the URI <http://www.w3.org/2004/02/skos/core#Concept>:

~~~json
{
  "uri": "http://www.w3.org/2004/02/skos/core#Concept",
  "prefLabel": { "en": "Concept" }
}
~~~

Concepts schemes MAY use additional concept types to organize concepts.
</div>


## Concept Schemes

[concept scheme]: #concept-schemes
[concept schemes]: #concept-schemes
[scheme]: #schemes

A **concept scheme** is an [item] with the following optional fields in addition:

property    type                       definition
----------- -------------------------- --------------------------------------------------------------------------------------
topConcepts [set] of [concepts]        top [concepts] of the scheme
versionOf   [set] of [concept schemes] [concept scheme] which this scheme is a version or edition of
concepts    [URL] or [set]             JSKOS API concepts endpoint returning all concepts in this scheme
types       [URL] or [set]             JSKOS API types endpoint returning all concept types in this scheme
languages   [list] of language tags    Supported languages
license     [URI]                      License which the full scheme is published under

The first element of field `type`, if given, MUST be
<http://www.w3.org/2004/02/skos/core#ConceptScheme>.

If `concepts` is a set, all its member concepts SHOULD contain a field
`inScheme` and all MUST contain [the same] concept scheme in field `inScheme`
if this field is given.

If `types` and `concepts` are sets, the `types` set SHOULD include a [concept type] 
for each concept's `type` other than `http://www.w3.org/2004/02/skos/core#Concept`.


## Registries

[registries]: #registries
[registry]: #registries

A **registry** is an [item] with the following optional fields in addition:

property     type           definition
------------ -------------- --------------------------------------------------------------------------------------
concepts     [URL] or [set] JSKOS API endpoint with [concepts] in this registry
schemes      [URL] or [set] JSKOS API endpoint with [concept types] in this registry
types        [URL] or [set] JSKOS API endpoint with [concept schemes] in this registry
mappings     [URL] or [set] JSKOS API endpoint with [mappings] in this registry
registries   [URL] or [set] JSKOS API endpoint with other registries in this registry
concordances [URL] or [set] JSKOS API endpoint with [concordances] in this registry
languages    [list]         Supported languages
license      [URI]          License which the full registry content is published under

Registries are collection of [concepts], [concept schemes], [concept types],
[concept mappings], and/or other registries.  

<div class="note">
Registries are the top JSKOS entity, followed by [concordances], [mappings]
[concept schemes], and on the lowest level [concepts] and [concept types].

Additional integrity rules for registries will be defined.
</div>


## Concordances

[concordances]: #concordances
[concordance]: #concordances

A **concordance** is an [item] with the following fields in addition. All
fields except `fromScheme` and `toScheme` are optional.

property     type             definition
------------ ---------------- ------------------------------------------------------
mappings     [URL] or [set]   JSKOS API endpoint with [mappings] in this concordance
fromScheme   [concept scheme] Source concept scheme
toScheme     [concept scheme] Target concept scheme
license      [URI]            License which the full concordance is published under

Concordances are collections of [mappings] from one [concept scheme] to
another. If `mappings` is a set then

* all its members with field `fromScheme` MUST have [the same] value 
  like concordance field `fromScheme`.

* all its members with field `toScheme` MUST have [the same] value 
  like concordance field `toScheme`.

<div class="note">
There is an additional integrity constraint refering to field `inScheme` if concepts
in mappings in concordances.
</div>


## Concept Mappings

[mappings]: #concept-mappings
[mapping]: #concept-mappings
[concept mapping]: #concept-mappings
[concept mappings]: #concept-mappings

A **mapping** is an [item] with the following fields in addition. All fields
except `from` and `to` are optional.

field            type             definition
---------------- ---------------- ----------------------------------------------
from             [concept bundle] concepts mapped from
to               [concept bundle] concepts mapped to
fromScheme       [concept scheme] source concept scheme
toScheme         [concept scheme] target concept scheme
mappingRelevance number           numerical value between 0 and 1 (experimental)

A **mapping** represents a mapping between [concepts] of two [concept schemes].
It consists two [concept bundles] with additional metadata not fully defined
yet.

The first element of field `type`, if
given, MUST be one of the values

* `http://www.w3.org/2004/02/skos/core#mappingRelation`,
* `http://www.w3.org/2004/02/skos/core#closeMatch`,
* `http://www.w3.org/2004/02/skos/core#exactMatch`,
* `http://www.w3.org/2004/02/skos/core#broadMatch`,
* `http://www.w3.org/2004/02/skos/core#narrowMatch`, and
* `http://www.w3.org/2004/02/skos/core#relatedMatch`

from [SKOS mapping properties](http://www.w3.org/TR/skos-reference/#mapping) as
first element. The field `type` MUST NOT contain multiple of these values.

<div class="note">
When mappings are dynamically created it can be useful to assign a non-HTTP URI
such as `urn:uuid:687b973c-38ab-48fb-b4ea-2b77abf557b7`.
</div>


## Concept Bundles

[concept bundles]: #concept-bundles
[concept bundle]: #concept-bundles
[collections]: #concept-bundles
[concept collections]: #concept-bundles

A **concept bundle** is a group of [concepts]. Some concept bundles represent
[SKOS concept collections](http://www.w3.org/TR/skos-reference/#collections) but
bundles may serve other purposes as well.

A concept bundle is a JSON object with the following fields. Field `members`
MUST be given, the other fields are OPTIONAL.

field       type      definition
----------- --------- ----------------------------------------------------------------------
members     [set]     [concepts] in this bundle
ordered     [boolean] whether the concepts in this bundle are ordered (list) or not (set) 
disjunction [boolean] whether the concepts in this bundle are combined by OR instead of AND

<div class="note">

* Concept collections are experimental, see
  <https://github.com/gbv/jskos/issues/7> for discussion.

* Concepts from a bundle may also come from different concept schemes!

* A concept bundle may be empty, for instance to indicate that no appropriate
  concepts exists for a given concept scheme:

    ```json
    {
      ...
      "to": { "members": null },
      "toScheme": {"uri": "http://dewey.info/scheme/ddc/"}
    }
    ```
</div>


# Additional rules

## Closed world statements

[closed world statements]: #closed-world-statements

By default, an JSKOS document should be interpreted as possibly incomplete: a
missing property does not imply that no value exists for this property: this
assumption is also known as open-world assumption. Applications SHOULD support
closed world statements to explicitly disable the open world assumption for
selected properties and explicitly state the known absence or existence of
unknown values:

data type      open world closed world explicit negation explicit existence
-------------- ---------- ------------ ----------------- ----------------------------
[list]         no field   `[...]`      `[]`              `[null]` or `[..., null]`
[set]          no field   `[...]`      `[]`              `[null]` or `[..., null]`
[language map] no field   `{...}`      no language tag   `{"-":"?"}` or `{"-":["?"]}`
[object]       no field   `{...}`      -                 `{}`
[URI]/[URL]    no field   `"..."`      -                 -
[date]         no field   `"..."`      -                 -

<div class="example">
The following concept has preferred labels and narrower concepts.  but no
alternative labels nor notations. Nothing is known about broader concepts,
related concepts, and other possible concept properties:

```json
{
  "type": ["http://www.w3.org/2004/02/skos/core#Concept"],
  "prefLabel": { "-": "..." },
  "altLabel": { },
  "notation": [],
  "narrower": [ null ]
}
```
</div>


## Integrity rules

Integrity rules of SKOS should be respected. A later version of this
specification may list these rules in more detail and also explain converting
between SKOS and JSKOS.

<!--

# Converting JSKOS to SKOS and vice versa

Notation and label properties do not imply a domain, so they can be used for both, concepts and concept schemes.

Concept types in RDF correspond to subclasses of [SKOS Concept].

A Concept represents a [SKOS Concept].

[SKOS Concept]: http://www.w3.org/TR/skos-primer/#secconcept

A Concept Scheme represents a [SKOS Concept Scheme].  

-->

[RDF/SKOS]: http://www.w3.org/2004/02/skos/
[SKOS Concept Scheme]: http://www.w3.org/TR/skos-primer/#secscheme
[JSKOS-LD context]: #json-ld-context
[SKOS Documentary Notes]: http://www.w3.org/TR/skos-primer/#secdocumentation


## Extension with custom fields

A JSKOS record MAY contain additional fields for custom usage. These fields
MUST start with an uppercase letter (A-Z) and SHOULD be ignored by JSKOS
applications. Fields starting with lowercase letters MUST NOT be used unless
they are explicitly defined in this specification.

<div class="example">
The field `Parts` in the following example does not belong to JSKOS:

```json
{
  "uri": "http://www.wikidata.org/entity/Q34095",
  "prefLabel": { "en": "bronze" },
  "Parts": ["copper", "tin"]
}
```
</div>


# References {.unnumbered}

## Normative references {.unnumbered}

* P. Biron, A. Malhotra: *XML Schema Part 2: Datatypes Second Edition*.
  W3C Recommendation, October 2005.
  <https://www.w3.org/TR/xmlschema-2/>

* S. Bradner: *Key words for use in RFCs to Indicate Requirement Levels*.
  RFC 2119, March 1997. <https://tools.ietf.org/html/rfc2119>

* D. Crockford: *The application/json Media Type for JavaScript Object Notation (JSON)*.
  RFC 4627, July 2006. <https://tools.ietf.org/html/rfc4627>

* M. Davis, K. Whistler: *Unicode Normalization Forms*.
  Unicode Standard Annex #15.
  <http://www.unicode.org/reports/tr15/>

* M. Dürst, M. Suignard: *Internationalized Resource Identifiers (IRIs)*.
  RFC 3987, January 2005. <https://tools.ietf.org/html/rfc3987>

* A. Phillips, M. Davis: *Tags for Identifying Languages*.
  RFC 3066, September 2006. <https://tools.ietf.org/html/rfc3066>

[RFC 2119]: https://tools.ietf.org/html/rfc2119
[RFC 4627]: https://tools.ietf.org/html/rfc4627
[RFC 3987]: https://tools.ietf.org/html/rfc3987
[RFC 3066]: https://tools.ietf.org/html/rfc3066

## Informative references {.unnumbered}

* DCMI Usage Board: *DCMI Metadata Terms*.
  June 2012.
  <http://dublincore.org/documents/dcmi-terms/>

* D. Crocker, P. Overell: *Augmented BNF for Syntax Specifications: ABNF*.
  RFC 5234, January 2008.
  <http://tools.ietf.org/html/rfc5234>

* A. Miles, S. Bechhofer: *SKOS Reference*.
  W3C Recommendation, 18 August 2009.
  <http://www.w3.org/TR/skos-reference>

* A. Phillips, M. Davis: *Tags for Identifying Languages*.
  RFC 4646, October 2005.
  <http://tools.ietf.org/html/rfc4646>

* A. Phillips, M. Davis: *Matching of Language Tags*.
  RFC 4647, September 2006.
  <http://tools.ietf.org/html/rfc4647>

* M. Sporny, D. Longley, G. Kellogg, M. Lanthaler, N. Lindström: *JSON-LD 1.0*.
  W3C Recommendation, January 2014.
  <http://www.w3.org/TR/json-ld/>

* J. Voß, M. Horn: *ng-skos 0.0.9*. AngularJS module.
  <https://github.com/gbv/ng-skos>.

[RFC 4646]: http://tools.ietf.org/html/rfc4646
[RFC 4647]: http://tools.ietf.org/html/rfc4647
[RFC 5234]: http://tools.ietf.org/html/rfc5234
[ng-skos]: http://gbv.github.io/ng-skos/

# Appendices {.unnumbered}

The following appendices are *non-normative*.

## Glossary {.unnumbered}

JSON
  : JavaScript Object Notation

JSON-LD
  : JavaScript Object Notation for Linked Data

KOS
  : Knowledge Organization System

RDF
  : Resource Description Framework

## SKOS features not supported in JSKOS {.unnumbered}

JSKOS is aligned with SKOS but all references to SKOS are informative only.
The following features of SKOS are not supported in JSKOS (yet):

maybe supported later
  : [concept collections], see <https://github.com/gbv/jskos/issues/7>

will not be supported
  : 
    * datatypes of notations (of little use in practice)

    * labels and notes without language tag (rarely used in practice)
    * skos:semanticRelation (can be derived)
    * skos:narrowerTransitive (can be derived)

[documentation properties]: http://www.w3.org/TR/2009/REC-skos-reference-20090818/#notes
[mapping properties]: http://www.w3.org/TR/2009/REC-skos-reference-20090818/#mapping

## JSKOS features not supported in SKOS {.unnumbered}

The following features of JSKOS have no corresponce in SKOS:

* [closed world statements]
* order of broaderTransitive statements (can be derived)
* order of multiple notations
* order of multiple inScheme statements

## JSON-LD context {.unnumbered}

The following [JSON-LD context document] can be used to map JSKOS to map JSKOS
without [closed world statements] to RDF triples.

[JSON-LD context document]: http://www.w3.org/TR/json-ld/#the-context

`context.json`{.include .codeblock .json}

JSKOS with closed world statements can be mapped to RDF by ignoring all boolean
values and/or by mapping selected boolean values to RDF triples with blank
nodes.

Applications should further add implicit RDF triples, such as `$someConcept
rdf:type skos:Concept`, if such information can be derived from JSKOS by other
means.

# Examples  {.unnumbered}

## Integrated Authority File (GND) {.unnumbered}

The Integrated Authority File (German: *Gemeinsame Normdatei*) is an authority
file managed by the German National Library.

<div class="example">
GND as as JSKOS concept scheme. This example includes explicit knowledge about
existence of more identifiers, definitions, and preferred labels:

`jskos-data/gnd/jskos-scheme.json`{.include .codeblock .json}
</div>

<div class="example">
A concept from GND:

`examples/gnd-4130604-1.concept.json`{.include .codeblock .json}
</div>

## Dewey Decimal Classification (DDC)  {.unnumbered}

<div class="example">
A concept from the Dewey Decimal Classification, German edition 22:

`examples/ddc-612.112.concept.json`{.include .codeblock .json}
</div>

<div class="example">
A concept from the abbbridget Dewey Decimal Classification, edition 23, in three languages:

`examples/ddc-641.5.concept.json`{.include .codeblock .json}
</div>

## Mappings {.unnumbered}

<div class="example">
Multiple mappings from one concept (612.112 in DDC) to GND.

`examples/ddc-gnd-1.mapping.json`{.include .codeblock .json}

`examples/ddc-gnd-2.mapping.json`{.include .codeblock .json}
</div>

----

This version: <http://gbv.github.io/jskos/{CURRENT_VERSION}.html> ({CURRENT_TIMESTAMP})\
Latest version: <http://gbv.github.io/jskos/>

Created with [makespec](http://jakobib.github.io/makespec/)

