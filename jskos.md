# Introduction

**JSKOS** defines a JavaScript Object Notation (JSON) structure to encode
knowledge organization systems (KOS), such as classifications, thesauri, and
authority files. JSKOS supports encoding of [concepts], [concept schemes],
[concept occurrences], and [concept mappings] with their common properties.
See [object types] for an outline.

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

## Non-negative integer

A **non-negative integer** is a JSON number without preceding minus part, without fractional part, or exponent.

<div class="note">
Examples of valid JSON values which are *not* non-negative integers: `"42"`, `""`, `null`, `-1`, `6e-3`.
</div>

## percentage

A **percentage** is a JSON number with value between zero (0.0 = 0%) and one (1.0 = 100%).

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

A list MUST NOT contain the empty string except if part of a [language map].

## set

A **set** is a possibly empty array where all members

* are JSON objects of JSKOS [resources], except the last member optionally being `null`,
* and have distinct values in field `uri`, if this field is given
  (members MUST not be the [same resource]).

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

The following JSON values are not valid JSKOS sets:

* `[null,{"uri":"http://example.org/123"}]`{.json}\
  (`null` only allowed as last member)
* `[{"uri":"http://example.org/123"},{"uri":"http://example.org/123"}]`{.json}\
  (field `uri` must be unique)
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
set of [RFC 3066] language tags that start the string `x`. For instance language
range `en-` includes language tag `en`, `en-US`, and `en-GB` among others.  The
language range `-` refers to all possible language tags.

<div class="note">
A language range MUST conform to the following ABNF grammar ([RFC 5234]):

```abnf
language-range = [language-tag] "-"
language-tag   = 1*8alpha *("-" 1*8(alpha / DIGIT))
alpha          = %x61-7A  ; a-z
```

JSKOS language ranges can be mapped to and from basic language ranges as
defined in [RFC 4647]. The main difference of JSKOS language ranges is they can
be distinguished from [RFC 3066] based on their string value (always ending
with "`-`"). For instance "`en`" could be an [RFC 3066] language tag or a
[RFC 3647] language range but in JSKOS it is always a language tag only:

                                        JSKOS RFC 3066 RFC 4647
--------------------------------------- ----- -------- --------
language tag for English                `en`  `en`
languag range for all English variants  `en-`          `en`

</div>

## language map

A **language map** is a JSON object in which every fields is

* either a [RFC 3066] language tag in lowercase that SHOULD also conform to [RFC 5646],
* or a [language range],

and

* either all values are strings (**language map of strings**),
* or all values are [lists] (**language map of lists**).

and

* string values or list member values mapped to from language tags MUST NOT be the empty string
* string values or list member values mapped to from language ranges MUST BE the empty string

Applications MAY ignore or disallow language ranges in language maps. JSKOS
data providers SHOULD make clear whether their data can contain language ranges
or not.

If language ranges are allowed, language maps MUST be interpreted as following
to support [closed world statements]:

* Language maps without language range fields indicate that all values are given.
  In particular the language map `{}` denotes an empty language map.

* A language range field indicates the existence of additional, unknown
  values of unknown number.

<div class="example">
The following language maps make use of language ranges and placeholders:

* `{"-":""}`, `{"-":""}`, `{"-":[]}`, and `{"-":[""]}`
   all denote non-empty language maps with unknown language tags and values.

* `{"en":"bird","-":""}` denotes a language map with an English value
   and additional values in other language tags.

* `{"en":"bird"}` denotes a language map with an English value only.

* `{"en-":""}` denotes a language map that only
  contains values with language tags starting with `en`.
</div>

<div class="note">
JSON-LD disallows language map fields ending with `"-"` so all fields that are
language ranges MUST be removed before reading JSKOS as JSON-LD.
</div>

<div class="note">
The language tag "und" can be used to include strings of unknown or unspecified language.
</div>

## location

[location]: #location

A **location** is a JSON object conforming to the GeoJSON specification ([RFC
7946]) with GeoJSON type being one of `Point`, `MultiPoint`, `LineString`,
`MultiLineString`, `Polygon`, or `MultiPolygon`. Applications MAY restrict the
location data type to GeoJSON objects of GeoJSON type `Point`.

<div class="example">
Position of the RMS Titanic as point:

~~~json
{
  "type": "Point",
  "coordinates": [-49.946944, 41.7325, -3803]
}
~~~
</div>


# Object types

JSKOS defines the following types of JSON objects:

* [resources] for all kinds of entities
    * [items] for named entities
        * [concepts] for entities from a knowledge organization system
        * [concept schemes] for compiled collections of concepts (knowledge organization systems)
        * [mappings] for mappings between concepts of two concept schemes
        * [concordances] for curated collections of mappings
        * [registries] for collections of items (concepts, concept schemes...)
        * [distributions] for available forms to access the content of an item
    * [occurrences] for counts of concept uses

In addition there are [concept bundles] as part of mappings, occurrences, and composed [concepts].


## Resource

[resource]: #resource
[resources]: #resource

An **resource** is a JSON object with the following optional fields:

field        type             description
----------- ----------------- ------------------------------------------------------------------
uri         [URI]             primary globally unique identifier
type        [list] of [URI]s  URIs of types
@context    [URI]             reference to a [JSON-LD context] document
created     [date]            date of creation
issued      [date]            date of publication
modified    [date]            date of last modification
creator     [set]             agent primarily responsible for creation of resource
contributor [set]             agent responsible for making contributions to the resource
publisher   [set]             agent responsible for making the resource available
partOf      [set]             [resources] which this resource is part of (if no other field applies)

It is RECOMMENDED to always include the fields `uri`, `type`, and `@context`.
The value of field `@context` SHOULD be
`https://gbv.github.io/jskos/context.json`.

Resources can be [tested for sameness](#resource-sameness) based on field `uri`.

## Item

[item]: #item
[items]: #item

An **item** is a [resource] with the following optional fields (in addition to
the optional fields `@context`, `contributor`, `created`, `creator`, `issued`,
`modified`, `partOf`, `publisher`, `type`, and `uri`):

field         type                      description
------------- ------------------------- ----------------------------------------------
url           [URL]                     URL of a page with information about the item
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
startDate     [date]                    date of birth, creation, or estabishment of the item
endDate       [date]                    date death or resolution of the item
relatedDate   [date]                    other date somehow related to the item
location      [location]                geographic location(s) of the item
subject       [set]                     what this item is about (e.g. topic)
subjectOf     [set]                     resources about this item (e.g. documentation)
depiction     [list] of [URL]           list of image URLs depicting the item

Applications MAY limit the fields `notation` and/or `depiction` to lists of a single
element or ignore all preceding elements of these lists.


## Concept

[concept]: #concept
[concepts]: #concept

A **concept** is an [item] and [concept bundle] with the following optional
fields (in addition to the optional fields `@context`, `altLabel`,
`changeNote`, `contributor`, `created`, `creator`, `definition`, `depiction`,
`editorialNote`, `example`, `hiddenLabel`, `historyNote`, `identifier`,
`issued`, `modified`, `notation`, `partOf`, `prefLabel`, `publisher`,
`scopeNote`, `subjectOf`, `subject`, `type`, `uri`, `url`, `memberSet`,
`memberList`, and `memberChoice`):

field        type       description
------------ ---------- -------------------------------------------------------------------------------
narrower     [set]      narrower concepts
broader      [set]      broader concepts
related      [set]      generally related concepts
previous     [set]      related concepts ordered somehow before the concept
next         [set]      related concepts ordered somehow after the concept
ancestors    [set]      list of ancestors, possibly up to a top concept
inScheme     [set]      [concept schemes] or URI of the concept schemes
topConceptOf [set]      [concept schemes] or URI of the concept schemes
mappings     [set]      [mappings] from and/or to this concept
occurrences  [set]      [occurrences] with this concept

The first element of field `type`, if given, MUST be the [item type] URI
<http://www.w3.org/2004/02/skos/core#Concept>.

Applications MAY limit the `inScheme` and/or `topConceptOf` to sets of a single
element or ignore all but one element of these sets.

If both fields `broader` and `ancestors` are given, the set `broader` MUST
include [the same] concept as the first element of `ancestors`.

The [concept bundle] fields `memberSet`, `memberList`, and `memberChoice` can
be used to express the parts of a **composed concept** (also known as combined
or synthesized concepts) unsorted or sorted. The field `memberChoice` SHOULD
NOT be used without proper documentation because its meaning in this context is
unclear. A concept MUST NOT include more than one of concept bundle fields. A
concept SHOULD NOT reference itself as part of its concept bundle.

<div class="note">
The "ancestors" field is useful in particular for monohierarchical classifications
but it's not forbidden to choose just one arbitrary path of concepts that are
connected by the broader relation.
</div>

<div class="example">
`examples/example.concept.json`{.include .codeblock .json}
</div>

<div class="example">
`examples/gnd-7507432-1.concept.json`{.include .codeblock .json}
</div>

<div class="example">
`examples/ddc-305.40941109033.concept.json`{.include .codeblock .json}
</div>



## Concept Schemes

[concept scheme]: #concept-schemes
[concept schemes]: #concept-schemes
[scheme]: #schemes

A **concept scheme** is an [item] with the following optional fields (in
addition to the optional fields `@context`, `altLabel`, `changeNote`,
`contributor`, `created`, `creator`, `definition`, `depiction`,
`editorialNote`, `example`, `hiddenLabel`, `historyNote`, `identifier`,
`issued`, `modified`, `notation`, `partOf`, `prefLabel`, `publisher`,
`scopeNote`, `subjectOf`, `subject`, `type`, `uri`, and `url`):

property      type                       definition
------------- -------------------------- --------------------------------------------------------------------------------------
topConcepts   [set] of [concepts]        top [concepts] of the scheme
versionOf     [set] of [concept schemes] [concept scheme] which this scheme is a version or edition of
namespace     [URI]                      URI namespace that all concepts URIs are expected to start with
concepts      [URL] or [set]             JSKOS API concepts endpoint returning all concepts in this scheme
types         [URL] or [set]             JSKOS API types endpoint returning all [concept types] in this scheme
distributions [set]                      [Distributions] to access the content of the concept scheme
extent        string                     Size of the concept scheme
languages     [list] of language tags    Supported languages
license       [set]                      Licenses which the full scheme can be used under

The first element of field `type`, if given, MUST be the [item type] URI
<http://www.w3.org/2004/02/skos/core#ConceptScheme>.

If `concepts` is a set, all its member concepts SHOULD contain a field
`inScheme` and all MUST contain [the same] concept scheme in field `inScheme`
if this field is given.

If `types` and `concepts` are sets, the `types` set SHOULD include all [concept types]
for each concept's `type` other than `http://www.w3.org/2004/02/skos/core#Concept`.


## Concept Occurrences

[occurrences]: #concept-occurrences
[occurrence]: #concept-occurrences
[concept occurrence]: #concept-occurrence
[concept occurrences]: #concept-occurrences

An **occurrence** is a [resource] and [concept bundle] with the following
optional fields (in addition to the optional fields `@context`, `contributor`,
`created`, `creator`, `issued`, `modified`, `partOf`m `publisher`, `type`, `uri`,
`memberSet`, `memberChoice`, and `memberList`):

field        type                   definition
------------ ---------------------- ----------------------------------------------
count        [non-negative integer] number of times the concepts are used
database     [item]                 database in which the concepts are used
frequency    [percentage]           count divided by total number of possible uses
relation     [URI]                  type of relation between concepts and entities
url          [URL]                  URL of a page with information about the occurrence

An occurrence gives the number of a times a concept ("occurrence") or
combination of concepts ("co-occurrence") is used in a specific relation to
entities from a particular database. For instance the occurrence could give the
number of documents indexed with some term in a catalog. The field `url`
typically includes a deep link into the database. 

If both `count` and `frequency` are given, the total size of the database can
derived by multiplication. In this case either both or none of the two fields
MUST be zero.

A timestamp, if given, should be stored in field `modified`.

The actual concept or concepts MAY be given implictly, for instance if the
occurrence is part of a [concept] in field `occurrences`.

<!-- TODO: specify explicit inference rules for implicitly given concepts? -->

<div class="example">
Two occurrences and their combined co-occurrence from GBV Union Catalogue (GVK) as of November 22th, 2017: [3657 records](https://gso.gbv.de/DB=2.1/CMD?ACT=SRCHA&IKT=1016&SRT=YOP&TRM=bkl+08.22) are indexed with class `08.22` (medieval philosophy) from Basisklassifikation, [144611](https://gso.gbv.de/DB=2.1/CMD?ACT=SRCHA&IKT=1016&SRT=YOP&TRM=ddc+610) with DDC notation `610` (Medicine & health) and [2 records](https://gso.gbv.de/DB=2.1/CMD?ACT=SRCHA&IKT=1016&SRT=YOP&TRM=bkl+08.22+ddc+610) with both.

`examples/co-occurrence-gvk.json`{.include .codeblock .json}
</div>

<div class="example">
The Wikidata [concept of an individual human](http://www.wikidata.org/entity/Q5) is linked to 206 Wikimedia sites (mostly Wikipedia language editions) and more than 3.7 million people (instances of <http://www.wikidata.org/entity/P31>) at November 15th, 2017.

`examples/wikidata-occurrence.json`{.include .codeblock .json}
</div>


## Registries

[registries]: #registries
[registry]: #registries

A **registry** is an [item] with the following optional fields (in addition to
the optional fields `@context`, `altLabel`, `changeNote`, `contributor`,
`created`, `creator`, `definition`, `depiction`, `editorialNote`, `example`,
`hiddenLabel`, `historyNote`, `identifier`, `issued`, `modified`, `notation`,
`partOf`, `prefLabel`, `publisher`, `scopeNote`, `subjectOf`, `subject`, `type`,
`uri`, and `url`):

field        type           definition
------------ -------------- --------------------------------------------------------------------------------------
concepts     [URL] or [set] JSKOS API endpoint with [concepts] in this registry
schemes      [URL] or [set] JSKOS API endpoint with [concept schemes] in this registry
types        [URL] or [set] JSKOS API endpoint with [concept types] in this registry
mappings     [URL] or [set] JSKOS API endpoint with [mappings] in this registry
registries   [URL] or [set] JSKOS API endpoint with other registries in this registry
concordances [URL] or [set] JSKOS API endpoint with [concordances] in this registry
occurrences  [URL] or [set] JSKOS API endpoint with [occurrences] in this registry
extent       string         Size of the registry
languages    [list]         Supported languages
license      [set]          Licenses which the full registry content can be used under

The first element of field `type`, if given, MUST be the [item type] URI
<http://purl.org/cld/cdtype/CatalogueOrIndex>.

Registries are collection of [concepts], [concept schemes], [concept types],
[concept mappings], and/or other registries.

<div class="note"> Registries are the top JSKOS entity, followed by
[concordances], [mappings] [concept schemes], and on the lowest level
[concepts] and [concept types]. See [Distributions] for an alternative.

Additional integrity rules for registries will be defined.
</div>


## Distributions

[distribution]: #distributions
[distributions]: #distributions

A **distribution** is an [item] with the following fields (in addition to the
optional fields `@context`, `altLabel`, `changeNote`, `contributor`, `created`,
`creator`, `definition`, `depiction`, `editorialNote`, `example`,
`hiddenLabel`, `historyNote`, `identifier`, `issued`, `modified`, `notation`,
`partOf`, `prefLabel`, `publisher`, `scopeNote`, `subjectOf`, `subject`, `type`,
`uri`, and `url`):

property     type           definition
------------ -------------- ---------------------------------------------
download     [URL]          location of a file in given format
mimetype     string         Internet Media Type (also known as MIME type)
format       [URI]          data format identifier of the file

Field `download` is mandatory but this requirement will be dropped in a later
version of this specification.

The `format` field SHOULD reference a content format rather than its
serialization and possible wrapping. The URI of JSKOS is
<http://format.gbv.de/jskos>.

The first element of field `type`, if given, MUST be the [item type] URI
<http://www.w3.org/ns/dcat#Distribution>.

<div class="note">
Access to [concept schemes] and [concordances] can also be specified with
fields `concepts`, `types`, and `mappings`, respectively. Distributions provide
an alternative and extensible method to express access methods.
</div>

<div class="example">

Distribution of a newline-delimited JSKOS file:

~~~json
{
  "download": "http://example.org/data/dump.ndjson",
  "mimetype": "application/x-ndjson",
  "format": "http://format.gbv.de/jskos"
}
~~~

Distribution of a RDF/XML with SKOS data:

~~~json
{
  "download": "http://example.org/data/dump.rdf",
  "mimetype": "application/rdf+xml"
  "format": "http://www.w3.org/2004/02/skos/core"
}
~~~

Distribution of a gzip-compressed MARC/XML file in [MARC 21 Format for
Authority Data](https://www.loc.gov/marc/authority/):

~~~json
{
  "download": "http://example.org/data/dump.xml.gz",
  "mimetype": "application/xml+gzip",
  "format": "http://format.gbv.de/marc/authority"
}
~~~

</div>


## Concordances

[concordances]: #concordances
[concordance]: #concordances

A **concordance** is an [item] with the following fields (in addition to the
optional fields `@context`, `altLabel`, `changeNote`, `contributor`, `created`,
`creator`, `definition`, `depiction`, `editorialNote`, `example`,
`hiddenLabel`, `historyNote`, `identifier`, `issued`, `modified`, `notation`,
`partOf`, `prefLabel`, `publisher`, `scopeNote`, `subjectOf`, `subject`, `type`,
`uri`, and `url`). All fields except `fromScheme` and `toScheme` are optional.

property     type             definition
------------ ---------------- ------------------------------------------------------
mappings     [URL] or [set]   JSKOS API endpoint with [mappings] in this concordance
distribution [set]            [Distributions] to access the concordance
fromScheme   [concept scheme] Source concept scheme
toScheme     [concept scheme] Target concept scheme
extent       string           Size of the concordance
license      [set]            License which the full concordance can be used under

The first element of field `type`, if given, MUST be the [item type] URI
<http://rdfs.org/ns/void#Linkset>.

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

A **mapping** is an [item] with the following fields (in addition to the
optional fields `@context`, `altLabel`, `changeNote`, `contributor`, `created`,
`creator`, `definition`, `depiction`, `editorialNote`, `example`,
`hiddenLabel`, `historyNote`, `identifier`, `issued`, `modified`, `notation`,
`partOf`, `prefLabel`, `publisher`, `scopeNote`, `subjectOf`, `subject`, `type`,
`uri`, and `url`). All fields except `from` and `to` are optional.

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

The first element of field `type`, if given, MUST be one of the [item types]

* `http://www.w3.org/2004/02/skos/core#mappingRelation`,
* `http://www.w3.org/2004/02/skos/core#closeMatch`,
* `http://www.w3.org/2004/02/skos/core#exactMatch`,
* `http://www.w3.org/2004/02/skos/core#broadMatch`,
* `http://www.w3.org/2004/02/skos/core#narrowMatch`, and
* `http://www.w3.org/2004/02/skos/core#relatedMatch`

from [SKOS mapping properties](http://www.w3.org/TR/skos-reference/#mapping).
The field `type` MAY contain additional values but MUST NOT contain multiple of
these values.

<div class="note">
When mappings are dynamically created it can be useful to assign a non-HTTP URI
such as `urn:uuid:687b973c-38ab-48fb-b4ea-2b77abf557b7`.
</div>


## Concept Bundles

[concept bundles]: #concept-bundles
[concept bundle]: #concept-bundles
[collections]: #concept-bundles
[concept collections]: #concept-bundles

A **concept bundle** is a group of [concepts]. Concept bundles can be used for
[mappings], composed concepts, and [occurrences].

A concept bundle is a JSON object with at most one of the following fields:

field       type          definition
----------- ------------- ----------------------------------------------------------------------
memberSet   [set]         [concepts] in this bundle (unordered)
memberList  ordered [set] [concepts] in this bundle (ordered)
memberChoice [set]        [concepts] in this bundle to choose from


<div class="note">

* Concept bundles could also be used for
  [SKOS concept collections](http://www.w3.org/TR/skos-reference/#collections),
  see <https://github.com/gbv/jskos/issues/7> for discussion.

* Concepts from a bundle may also come from different concept schemes!

* A concept bundle may be empty, for instance to indicate that no appropriate
  concepts exists for a given concept scheme:

    ```json
    {
      ...
      "to": { "memberSet": [] },
      "toScheme": {"uri": "http://dewey.info/scheme/ddc/"}
    }
    ```

  Normalization rules may be added to prefer one kind of expressing an empty concept bundle.

</div>

# Item and concept types

[item type]: #item-and-concept-types
[item types]: #item-and-concept-types
[concept type]: #item-and-concept-types
[concept types]: #item-and-concept-types

An **item type** is an URI used to distinguish the different kinds of JSKOS [items]:

item                item type
------------------- -----------------------------------------------------
[concept]           <http://www.w3.org/2004/02/skos/core#Concept>
[concept scheme]    <http://www.w3.org/2004/02/skos/core#ConceptScheme>
[registry]          <http://purl.org/cld/cdtype/CatalogueOrIndex>
[distribution]      <http://www.w3.org/ns/dcat#Distribution>
[concordance]       <http://rdfs.org/ns/void#Linkset>
[mapping]           <http://www.w3.org/2004/02/skos/core#mappingRelation> and sup-properties
------------------- ------------------------------------------------------------------------

A concept type is [concept] used to distinguish different kinds of [concepts]
or other [resources]. Concept types are referred to by their URI in field `type`
of a [resource].

Item types MAY be expressed with the following [concept types]:

~~~json
[
  {
    "uri": "http://www.w3.org/2004/02/skos/core#Concept",
    "prefLabel": { "en": "concept" }
  },
  {
    "uri": "http://www.w3.org/2004/02/skos/core#ConceptScheme",
    "prefLabel": { "en": "concept scheme" }
  },
  {
    "uri": "http://purl.org/cld/cdtype/CatalogueOrIndex",
    "prefLabel": { "en": "registry" },
    "altLabel": { "en": [ "catalog", "Catalogue or Index" ] }
  },
  {
    "uri": "http://www.w3.org/ns/dcat#Distribution",
    "prefLabel": { "en": "distribution" }
  },
  {
    "uri": "http://rdfs.org/ns/void#Linkset",
    "identifier": [ "http://purl.org/spar/fabio/VocabularyMapping" ],
    "prefLabel": { "en": "concordance" },
    "altLabel": { "en": [ "linkset" ] }
  },
  {
    "uri": "http://www.w3.org/2004/02/skos/core#mappingRelation",
    "prefLabel": { "en": "is in mapping relation with" }
  },
  {
    "uri": "http://www.w3.org/2004/02/skos/core#closeMatch",
    "prefLabel": { "en": "has close match" },
    "broader": [ { "uri": "http://www.w3.org/2004/02/skos/core#mappingRelation" } ]
  },
  {
    "uri": "http://www.w3.org/2004/02/skos/core#exactMatch",
    "prefLabel": { "en": "has exact match" },
    "broader": [ { "uri": "http://www.w3.org/2004/02/skos/core#closeMatch" } ]
  },
  {
    "uri": "http://www.w3.org/2004/02/skos/core#broadMatch",
    "prefLabel": { "en": "has broader match" },
    "broader": [ { "uri": "http://www.w3.org/2004/02/skos/core#mappingRelation" } ],
    "related": [ { "uri": "http://www.w3.org/2004/02/skos/core#narrowMatch" } ]
  },
  {
    "uri": "http://www.w3.org/2004/02/skos/core#narrowMatch",
    "prefLabel": { "en": "has narrower match" },
    "broader": [ { "uri": "http://www.w3.org/2004/02/skos/core#mappingRelation" } ],
    "related": [ { "uri": "http://www.w3.org/2004/02/skos/core#broadMatch" } ]
  },
  {
    "uri": "http://www.w3.org/2004/02/skos/core#relatedMatch",
    "prefLabel": { "en": "has related match" },
    "broader": [ { "uri": "http://www.w3.org/2004/02/skos/core#mappingRelation" } ]
  }
]
~~~


# Additional rules

## Resource sameness

[same resource]: #resource-sameness
[the same]: #resource-sameness

Two [resources] are *same* if and only if they both contain field `uri` with
the same value. A resource without field `uri` is not same to any other
resource.

<div class="example">
The following resources are same:

~~~{.json}
{ "uri": "http://example.org/123", "created": "2007" }
{ "uri": "http://example.org/123", "created": "2015" }
~~~
</div>


## Closed world statements

[closed world statements]: #closed-world-statements

By default, a JSKOS document should be interpreted as possibly incomplete: a
missing property does not imply that no value exists for this property: this
assumption is also known as open-world assumption. Applications SHOULD support
closed world statements to explicitly disable the open world assumption for
selected properties and explicitly state the known absence or existence of
unknown values:

data type      open world closed world explicit negation explicit existence
-------------- ---------- ------------ ----------------- ----------------------------
[list]         no field   `[...]`      `[]`              `[null]` or `[..., null]`
[set]          no field   `[...]`      `[]`              `[null]` or `[..., null]`
[language map] no field   `{...}`      no language tag   `{"-":""}` or `{"-":[""]}`
[resource]     no field   `{...}`      -                 `{}`
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

<div class="note">
The following rule may be changed in the final version of JSKOS specification!
</div>

A JSKOS record MAY contain additional fields for custom usage. These fields
MUST start with and underscore (`_`) or consist of uppercase letters and digits 
only (A-Z, 0-1).  The fields SHOULD be ignored by JSKOS applications. 

<div class="example">
The fields `PARTS` and `_id` in the following example does not belong to JSKOS:

```json
{
  "_id": "e5fa44f2b31c1fb553b6021e7360d07d5d91ff5e",
  "uri": "http://www.wikidata.org/entity/Q34095",
  "prefLabel": { "en": "bronze" },
  "PARTS": ["copper", "tin"]
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

* H. Butler, M. Daly, S. Gillies, S. Hagen, T. Schaub: *The GeoJSON Format*.
  RFC 7946, August 2016. <https://tools.ietf.org/html/rfc7946>

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
[RFC 7946]: https://tools.ietf.org/html/rfc7946

## Informative references {.unnumbered}

* K. Alexander, R. Cyganiak, M. Hausenblas, Zhao, J.:
  *Describing Linked Datasets with the VoID Vocabulary*.
  March 2011.
  <http://www.w3.org/TR/void/>

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
  RFC 5646, September 2009.
  <http://tools.ietf.org/html/rfc5646>

* A. Phillips, M. Davis: *Matching of Language Tags*.
  RFC 4647, September 2006.
  <http://tools.ietf.org/html/rfc4647>

* M. Sporny, D. Longley, G. Kellogg, M. Lanthaler, N. Lindström: *JSON-LD 1.0*.
  W3C Recommendation, January 2014.
  <http://www.w3.org/TR/json-ld/>

* J. Voß, M. Horn: *ng-skos 0.0.9*. AngularJS module.
  <https://github.com/gbv/ng-skos>.

[RFC 5646]: http://tools.ietf.org/html/rfc5646
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

## Changelog {.unnumbered}

### 0.4.1 (2018-06-26) {.unnumbered}

* Rename distribution field to distributions
* Allow digits in custom fields

### 0.4.0 (2018-06-22) {.unnumbered}

* Add Registry field occurrences
* Add Distribution object type
* Change rule for custom fields

### 0.3.2 (2018-05-29) {.unnumbered}

* Add Concept Scheme field namespace

### 0.3.1 (2017-11-22) {.unnumbered}

* Extend ocurrences to co-occurrences

### 0.3.0 (2017-11-15) {.unnumbered}

* Add occurrences

### 0.2.2 (2017-11-06) {.unnumbered}

* Add mappings field to Concept 

### 0.2.1 (2017-09-27) {.unnumbered}

* Disallow empty strings except as mandatory placeholder with language ranges
* Support composed concepts with `memberSet` and `memberList`

### 0.2.0 (2017-09-21) {.unnumbered}

* Rename object to resource
* Move startDate, endDate, relatedDate, and location from Concept to Item
* Add item types
* Update JSON-LD context document

### 0.1.4 (2016-12-02) {.unnumbered}

* Update JSON-LD context document
* Change definition of concept bundles to use fields memberSet/List/Choice
  instead of members

### 0.1.3 (2016-10-03) {.unnumbered}

* Change definition of "location" field to subset of GeoJSON (RFC 7946)

### 0.1.2 (2016-06-13) {.unnumbered}

* Add "location" field for geographic coordinates

### 0.1.1 (2016-05-20) {.unnumbered}

* Make field "license" a set instead of a single URI
* Add field "extent"
* Update reference to [RFC 5646] instead of obsoleted RFC 4646

## SKOS features not supported in JSKOS {.unnumbered}

JSKOS is aligned with SKOS but all references to SKOS are informative only.
The following features of SKOS are not supported in JSKOS:

* SKOS notations can have datatypes. JSKOS notations are plain strings.

* SKOS notations, labels, and values of [documentation properties] can be
  empty string. In JSKOS empty string values are disallowed.

* SKOS labels and values of [documentation properties] do not need to
  have a language tag. In JSKOS language tags are mandatory for label
  and documentation properties.

* JSKOS does not include the SKOS properties `skos:broaderTransitive`,
  `skos:narrowerTransitive`, and `skos:semanticRelation`.


[documentation properties]: http://www.w3.org/TR/2009/REC-skos-reference-20090818/#notes
[mapping properties]: http://www.w3.org/TR/2009/REC-skos-reference-20090818/#mapping

## JSKOS features not supported in SKOS {.unnumbered}

The following features of JSKOS have no corresponce in SKOS:

* [concept occurrences], [registries], [concordances], [concept mappings] as first-class objects,
  and composed [concepts]
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
GND as JSKOS concept scheme. This example includes explicit knowledge about
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

