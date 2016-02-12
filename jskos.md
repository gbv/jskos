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
repository <https://github.com/gbv/jskos>. Feedback is appreciated!

[coli-conc]: https://coli-conc.gbv.de/

## Conformance requirements

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be
interpreted as described in [RFC 2119].

# Data types

JSKOS is based on JSON which consists of *objects* with pairs of *fields* and
*values*, *arrays* with *members*, *strings*, *numbers*, and the special values
`true`, `false`, and `null`.  All strings and fields of a JSKOS document MUST
be normalized to Unicode Normalization Form C (NFC). Applications processing
JSON MAY accept JSON documents not normalized in NFC by performing NFC
normalization.  JSKOS further restricts JSON with reference to the following
data types:

### URI {.unnumbered}

A syntactically correct IRI.

### URL {.unnumbered}

A syntactically correct URL with HTTPS (RECOMMENDED) or HTTP scheme.

### date {.unnumbered}

A date or datetime as defined with XML Schema datatype
[datetime](https://www.w3.org/TR/xmlschema-2/#dateTime)
(`-?YYYY-MM-DDThh:mm:ss(\.s+)?(Z|[+-]hh:mm)?`)
[date](https://www.w3.org/TR/xmlschema-2/#date) (`-?YYYY-MM-DD(Z|[+-]hh:mm)?`),
[gYearMonth](https://www.w3.org/TR/xmlschema-2/#gYearMonth) (`-?YYYY-MM`), 
or [gYear](https://www.w3.org/TR/xmlschema-2/#gYear) (`-?YYYY`).

### list {.unnumbered}

A non-empty array of strings.

### set {.unnumbered}

A **set** is 

* either the value `null`
* or an array with `null` as only member
* or a non-empty array with distinct URI strings as members,
  optionally followed by `null` as last member
* or a non-empty array with objects as members,
  optionally followed by `null` as last member.
  All object members MUST have a field `uri` with unique value
  in their set.

<div class="example">
The following JSON values are JSKOS sets:

* `null`{.json}
* `[null]`{.json}
* `["http://example.org/123"]`{.json}
* `["http://example.org/123",null]`{.json}
* `["http://example.org/123","http://example.org/456"]`{.json}
* `["http://example.org/123","http://example.org/456",null]`{.json}
* `[{"uri":"http://example.org/123"}]`{.json}
* `[{"uri":"http://example.org/123"},null]`{.json}
* `[{"uri":"http://example.org/123"},{"uri":"http://example.org/456"}]`{.json}

The following JSON values are no valid JSKOS sets:

* `[]`{.json}\
  (set must not be empty)
* `[null,"http://example.org/123"]`{.json}\
  (`null` must be last member)
* `["http://example.org/456",{"uri":"http://example.org/123"}]`{.json}\
  (either URIs as strings or objects with field `uri`)
* `["http://example.org/123","http://example.org/123"]`{.json}\
  (field `uri` not unique)
</div>

### language maps {.unnumbered}
[language map]: #language-maps

A **language map** is a JSON object in which every fields is 

* either a language tag as defined by [RFC 3066], normalized to lowercase
  and RECOMMENDED to also conform to [RFC 4646],
* or a language range defined as follows, 

and every value is

* either a string,
* or `null`,
* or an array with only member `null`,
* or an array of strings, optionally followed by last member `null`.

In addition, in one language map all values except `null` MUST either be
strings (**language map of strings**) or arrays (**language map of arrays**)
but not both.

A **language range** is 

* either a string that has conforms to the syntax of [RFC 3066] language tags,
  limited to lowercase, followed by the character "`-`",
* or the character "`-`".


<div class="note">
In formal ABNF grammar ([RFC 5234]), a language map is defined as follows.

```abnf
language-map   = language-tag / language-range
language-tag   = 1*8alpha *("-" 1*8(alpha / DIGIT)) 
language-range = [language-tag] "-" 
alpha          = %x61-7A  ; a-z
```
</div>
<div class="note">
Language ranges in JSKOS are defined similar to basic language ranges in [RFC 4647]. Both can be mapped to each other although they serve slightly different purposes.
</div>
<div class="note">
JSON-LD disallows language map fields ending with `"-"` so all language range fields MUST be removed before reading JSKOS as JSON-LD.
</div>

# JSKOS Objects

[object]: #jskos-objects
[JSKOS objects]: #jskos-objects

A JSKOS **object** is a JSON object that expresses a [concept], [concept
scheme], [concept type], [registry], [concordance], or [concept mapping]. Each
JSKOS object can have at least the following fields:

field     type             description
--------- ---------------- -----------------------------------------
uri       [URI]            primary globally unique identifier
type      [list] of [URI]s URIs of types
@context  [URI]            reference to a [JSON-LD context] document 
created   [date]           date of creation 
modified  [date]           date of last modification

It is RECOMMENDED to always include the fields `uri`, `type`, and `@context`.
The value of field `@context` SHOULD be
`https://gbv.github.io/jskos/context.json`.


## Items

[JSKOS items]: #jskos-items

A JSKOS **item** is a JSKOS object that expresses a [concept], [concept
scheme], [concept type], [registry] or [concordance]. Each JSKOS item can have
at least the following fields in addition to fields of all [JSKOS objects]:

field         type                      description
------------- ------------------------- ----------------------------------------------------------------------------------
url           string                    URL of a page with information about the [concept]/[concept scheme]/[concept type]
identifier    [list]                    additional identifiers
notation      [list]                    list of notations
prefLabel     [language map] of strings preferred labels, index by language
altLabel      [language map] of [list]s alternative labels, indexed by language
hiddenLabel   [language map] of [list]s hidden labels, indexed by language
scopeNote     [language map] of [list]s see [SKOS Documentary Notes]
definition    [language map] of [list]s see [SKOS Documentary Notes]
example       [language map] of [list]s see [SKOS Documentary Notes]
historyNote   [language map] of [list]s see [SKOS Documentary Notes]
editorialNote [language map] of [list]s see [SKOS Documentary Notes]
changeNote    [language map] of [list]s see [SKOS Documentary Notes]
subject       [set]                     subject indexing of this resource
depiction     [list] of [URL]s          list of image URLs depicting the concept [concept]/[concept scheme]/[concept type]

## Concepts

[concept]: #concepts
[concepts]: #concepts

[SKOS Concept]: http://www.w3.org/TR/skos-primer/#secconcept

A **concept** represents a [SKOS Concept]. Each concept can have at least the
following fields in addition to fields of all [JSKOS items]:

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
subjectOf    [set]  resources being indexed with this concept

The first element of field `type`, if given, MUST be
<http://www.w3.org/2004/02/skos/core#Concept>.

Only the `uri` field is mandatory. Additional properties, not included in this
list, SHOULD be ignored.

Applications MAY use only the first element of property `notation` and/or property
`inScheme` for simplification.

<div class="note">
The "ancestors" field only makes sense monohierarchical classifications but
it's not forbidden to choose just one arbitrary path of concepts that are
connected by the narrower relation.
</div>

<div class="example">
`examples/example.concept.json`{.include .codeblock .json}
</div>

The order of alternative labels with same language and the order of narrower,
broader, or related concepts is irrelevant, but this may be changed (see
<https://github.com/gbv/jskos/issues/11>).


## Concept types
[concept type]: #concept-types
[concept types]: #concept-types

A **concept type** represents a more specific type of concept. Each [concept]
MUST belong to at least the general concept type "Concept", identified by the
URI <http://www.w3.org/2004/02/skos/core#Concept>.

Concepts schemes MAY use additional concept types to organize concepts. 

A concept type in JSKOS is a [JSKOS item].

<div class="note">
Concept types in RDF correspond to subclasses of [SKOS Concept].
</div>


## Concept Schemes
[concept scheme]: #concept-schemes
[concept schemes]: #concept-schemes
[scheme]: #schemes

A **concept scheme** represents a [SKOS Concept Scheme].  Each concept scheme
can have at least the following fields in addition to fields of all [JSKOS
items]:

property    type  definition
----------- ----- --------------------------------------------------------------------------------------
topConcepts [set] top [concepts] of the scheme
versionOf   [set] [concept scheme] which this scheme is a version or edition of
concepts    [URL] JSKOS API concepts endpoint returning all concepts in this scheme
types       [URL] JSKOS API types endpoint returning all concept types in this scheme

The first element of field `type`, if given, MUST be
<http://www.w3.org/2004/02/skos/core#ConceptScheme>.

Only the field `uri` is mandatory. Additional properties, not included in this
list, SHOULD be ignored.

<div section="note">
Notation and label properties do not imply a domain, so they can be used for both, concepts and concept schemes.
</div>



## Registries
[registries]: #registries
[registry]: #registries

A **registry** is a collection of [concepts], [concept schemes], [concept
types], [concept mappings], and/or other registries.  Each registry can have at
least the following fields in addition to fields of all [JSKOS items]:

property     type           definition
------------ -------------- --------------------------------------------------------------------------------------
concepts     [URL] or [set] JSKOS API endpoint with [concepts] in this registry
schemes      [URL] or [set] JSKOS API endpoint with [concept types] in this registry
types        [URL] or [set] JSKOS API endpoint with [concept schemes] in this registry
mappings     [URL] or [set] JSKOS API endpoint with [mappings] in this registry
registries   [URL] or [set] JSKOS API endpoint with other registries in this registry
concordances [URL] or [set] JSKOS API endpoint with [concordances] in this registry

<div class="note">
Registries are the top JSKOS entity, followed by [concordances], [mappings]
[concept schemes], and on the lowest level [concepts] and [concept types].
</div>


## Concordances
[concordances]: #concordances
[concordance]: #concordances

A **concordance** is a collection of [mappings] from one [concept scheme] to
another.  A concordances is expressed as JSON object with the following fields,
in addition to [common fields]:

property     type                      definition
------------ ------------------------- --------------------------------------------------------------------------------------
mappings     [URL] or [set]            JSKOS API endpoint with [mappings] in this concordance
schemes      [URL] or [set]            JSKOS API endpoint with [mappings] in this concordance
fromScheme   [URI] or [concept scheme]
toScheme     [URI] or [concept scheme]


## Concept mappings
[mappings]: #concept-mappings
[mapping]: #concept-mappings
[concept mapping]: #concept-mappings
[concept mappings]: #concept-mappings

<div class="note">
This section is highly experimental. Support of encoding mappings in JSKOS, based on 
[SKOS mapping properties](http://www.w3.org/TR/skos-reference/#mapping)
is planned. See <https://github.com/gbv/jskos/issues/8> for discussion.
</div>

A **mapping** represents a mapping between [concepts] of two [concept schemes].
It consists two [concept bundles] with additional metadata.  Each mapping can
have at least the following fields in addition to fields of all [JSKOS items]:


field            | type             | definition
-----------------|------------------|------------------------------------------------------------------------------------------------------
mappingRelevance | string           | numerical value between 0 and 1
from             | [concept bundle] | ...
to               | [concept bundle] | ...
fromScheme       | URI              | ...
toScheme         | URI              | ...

The fields `from` and `to` are mandatory. The first element of field `type`, if
given, MUST be one of the values
`http://www.w3.org/2004/02/skos/core#mappingRelation`,
`http://www.w3.org/2004/02/skos/core#closeMatch`,
`http://www.w3.org/2004/02/skos/core#exactMatch`,
`http://www.w3.org/2004/02/skos/core#broadMatch`,
`http://www.w3.org/2004/02/skos/core#narrowMatch`, and
`http://www.w3.org/2004/02/skos/core#relatedMatch` from [SKOS mapping
properties](http://www.w3.org/TR/skos-reference/#mapping) as first element. The
field `type` MUST NOT NOT contain multiple of these values.

<div class="note">
Additional DCMI Metadata Terms are yet to be defined, for instance:

field         | type       | definition 
--------------|------------|-------------------------------------------------------------
creator       | ?          | agent primarily responsible for creation of the mapping
contributor   | ?          | agent responsible for making contributions to the mapping
publisher     | ?          | agent responsible for making the resource available
source        | URI        | ?
dateAccepted  | date       | ?
dateSubmitted | date       | ?
issued        | date       | date of publication
valid         | date range | range of date of validity of the mapping (?)
version       | string     | ?
provenance    | ?          | ?
accrualMethod | ?          | ?
accrualPolicy | ?          | ?
</div>

<div class="note">
When mapping are dynamically created it can be useful to assign a non-HTTP URI
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

<div class="note">
Concept bundles are highly experimental. 
See <https://github.com/gbv/jskos/issues/7> for discussion.
</div>

A concept bundle is a JSON object with the following fields. All fields
are optional except one of `conceptSet` or `conceptList` but not both must be
given. 

field        | type    | definition
-------------|---------|-----------------------------------------------------
conceptSet   | set     | set of [concepts] or URIs of concepts
conceptList  | set     | list of [concepts] or URIs of concepts
coordination | string  | the value `AND` or the value `OR`

<div class="note">

* More possible coordination values may be added for support of more advanced
structured indexing (ways to relate concepts to one another).

* Concepts from a bundle may also come from different concept schemes!

* A concept bundle may be empty, for instance to indicate that no appropriate
  concepts exists for a given concept scheme:

    ```json
    {
      ...
      "to": { "conceptSet": null },
      "toScheme": [ "http://dewey.info/scheme/ddc/" ]
    }
    ```
</div>

# Extension with custom fields

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


# Closed world statements
[closed world statements]: #closed-world-statements

By default, an JSKOS document should be interpreted as possible incomplete: a
missing property does not imply that no value exists for this property: this
assumption is also known as open-world assumption. A JSKOS document may include
special closed world statements to explicitly disable the open world assumption
for selected properties.

Applications may use `null` values to explicitly state the known absence or
existence of unknown values:

property  | explicit negation | explicit existence
----------|-------------------|-------------------
notation  | `null`            | `[ null ]`
prefLabel | `null`            | `{ "-": "..." }`
altLabel  | `null`            | `{ "-": "..." }`
narrower  | `null`            | `[ null ]`
broader   | `null`            | `[ null ]`
ancestors | `null`            | `[ null ]`
related   | `null`            | `[ null ]`

<div class="example">
The following concept has at least one preferred label and at least one
narrower concepts but no alternative
labels nor notations. Nothing is known about broader
concepts, related concepts, and other possible concept properties:

```json
{
  "type": ["http://www.w3.org/2004/02/skos/core#Concept"],
  "prefLabel": { "-": "..." },
  "altLabel": null,
  "notation": null,
  "narrower": [ null ]
}
```
</div>

# Integrity rules

Integrity rules of SKOS should be respected. A later version of this specification
may list these rules in more detail.

[RDF/SKOS]: http://www.w3.org/2004/02/skos/
[SKOS Concept Scheme]: http://www.w3.org/TR/skos-primer/#secscheme 
[JSKOS-LD context]: #json-ld-context
[SKOS Documentary Notes]: http://www.w3.org/TR/skos-primer/#secdocumentation

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

will be supported
  : * [mapping properties], see <https://github.com/gbv/jskos/issues/8>
maybe supported later
  : * [concept collections], see <https://github.com/gbv/jskos/issues/7>
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

