# Introduction

**JSKOS** (**J**avaScript Object Notation for **S**imple **K**nowledge **O**rganization **S**ystems) defines a JavaScript Object Notation (JSON) structure to encode knowledge organization systems (KOS), such as classifications, thesauri, and authority files. JSKOS supports encoding of [concepts], [concept schemes], [concept occurrences], and [concept mappings] with their common properties.  It further defines application profiles for [registries], [distributions], and [annotations]. See [object types] for an outline.

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

An **URL** is a syntactically correct URL with HTTPS (RECOMMENDED) or HTTP scheme. Note that URLs can contain international characters allowed in IRIs.

## Non-negative integer

A **non-negative integer** is a JSON number without preceding minus part, without fractional part, or exponent.

::: {.callout-note}
Examples of valid JSON values which are *not* non-negative integers: `"42"`, `""`, `null`, `-1`, `6e-3`.
:::

## percentage

A **percentage** is a JSON number with value between zero (0.0 = 0%) and one (1.0 = 100%).

## date

A **date** is a date or date and time as defined with XML Schema datatype
[datetime](https://www.w3.org/TR/xmlschema-2/#dateTime)
(`-?YYYY-MM-DDThh:mm:ss(\.s+)?(Z|[+-]hh:mm)?`)
[date](https://www.w3.org/TR/xmlschema-2/#date) (`-?YYYY-MM-DD(Z|[+-]hh:mm)?`),
[gYearMonth](https://www.w3.org/TR/xmlschema-2/#gYearMonth) (`-?YYYY-MM`),
or [gYear](https://www.w3.org/TR/xmlschema-2/#gYear) (`-?YYYY`).

## extended date

An **extended date** is a date, date and time, or interval in [Extended Date/Time Format (EDTF)](https://www.loc.gov/standards/datetime/) Level 1. This includes:

- Intervals of dates (e.g. `1949-10/1990-10`, or `2021/..`)
- Seasons (e.g. `2001-21`)
- Years with more then four digits (e.g. `Y-50000`)
- Qualifiers for uncertain (`?`), approximate (`~`) or both (`%`)
- Unspecified digits marked with `X`

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

:::{#lst-ex-sets}
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
:::

::: {.callout-note}
It is not defined yet whether and when the order of elements is relevant or not.
:::

## language range

A **language range** is

* either the character "`-`"
* or a string that conforms to the syntax of [RFC 3066] language tags,
  limited to lowercase, followed by the character "`-`",

A language range "`x-`", where `x` is a possibly empty string, refers to the
set of [RFC 3066] language tags that start the string `x`. For instance language
range `en-` includes language tag `en`, `en-US`, and `en-GB` among others.  The
language range `-` refers to all possible language tags.

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

::: {#lst-language-maps}

The following language maps make use of language ranges and placeholders:

* ` {"-":""}`, ` {"-":""}`, ` {"-":[]}`, and ` {"-":[""]}`
   all denote non-empty language maps with unknown language tags and values.

* ` {"en":"bird","-":""}` denotes a language map with an English value
   and additional values in other language tags.

* ` {"en":"bird"}` denotes a language map with an English value only.

* ` {"en-":""}` denotes a language map that only
  contains values with language tags starting with `en`.

:::

::: {.callout-note}
JSON-LD disallows language map fields ending with `"-"` so all fields that are
language ranges MUST be removed before reading JSKOS as JSON-LD.
:::

::: {.callout-note}
The language tag "und" can be used to include strings of unknown or unspecified language.
:::

## location

[location]: #location

A **location** is a JSON object conforming to the GeoJSON specification ([RFC
7946]) with GeoJSON type being one of `Point`, `MultiPoint`, `LineString`,
`MultiLineString`, `Polygon`, `MultiPolygon`, or `GeometryCollection`.
Applications MAY restrict the location data type to GeoJSON objects of GeoJSON
type `Point`.


::: {#lst-titanic lst-cap="Position of the RMS Titanic as point"}
~~~json
{
  "type": "Point",
  "coordinates": [-49.946944, 41.7325, -3803]
}
~~~
:::

## address

An **address** is a JSON object with any of the following field, each mapped to a string:

field    description
-------- -----------
street   the street address
ext      the extended address (e.g., apartment or suite number)
pobox    the post office box
locality the locality (e.g., city)
region   the region (e.g., state or province)
code     the postal code
country  the country name

## checksum

A **checksum** is a JSON object with two fields:

field       type    description
----------- ------- -----------
algorithm   [URI]   checksum algorithm
value       string  lower case hexidecimal encoded digest value

The value of SHOULD be specified by a URI from SPDX vocabulary, e.g. <http://spdx.org/rdf/terms#checksumAlgorithm_sha256> for SHA-2 with 256 Bit (SHA-256).

## media

A **media** is a reference to digital content such as images or other
audiovisual data. The data model of JSKOS media follows the *manifest* resource
type of [IIIF Presentation API 3.0](https://iiif.io/api/presentation/3.0/).

A **media** is a JSON object with at least the following fields:

field   type    description
------- ------- ---------------------------
type    string  the value "Manifest"
items   array   list of IIIF Canvas objects

Additional properties MUST follow the IIIF Presentation API specification.  In
contrast to IIIF, the fields `label` and `id` are not required but RECOMMENDED
by JSKOS. JSKOS applications MAY limit the set of supported fields instead of
fully implementing all IIIF capabilities.

::: {#lst-thubnail lst-cap="Thumbnail image specified as media"}
~~~json
{
  "type": "Manifest",
  "items": [],
  "thumbnail": [
    {
      "type": "Image",
      "id": "http://example.org/1/thumbnail.jpg",
      "format": "image/jpeg"
    }
  ]
}
~~~
:::

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
* [annotations] to review and comment on individual resources

In addition there are [concept bundles] as part of mappings, occurrences, and composed [concepts].

## Resource

[resource]: #resource
[resources]: #resource

An **resource** is a JSON object with the following optional fields:

field       type                 description
----------- -------------------- ------------------------------------------------------------------
@context    [URI] or list of URI reference to a [JSON-LD context] document
uri         [URI]                primary globally unique identifier
identifier  [list]               additional identifiers
type        [list] of [URI]      URIs of types
created     [date]               date of creation of the resource
issued      [date]               date of publication of the resource
modified    [date]               date of last modification of the resource
creator     [set]                agent primarily responsible for creation of the resource
contributor [set]                agent responsible for making contributions to the resource
source      [set]                sources from which the described resource is derived
publisher   [set]                agent responsible for making the resource available
partOf      [set]                [resources] which this resource is part of (if no other field applies)

It is RECOMMENDED to always include the fields `uri`, `type`, and `@context`.
The value of field `@context` SHOULD be
`https://gbv.github.io/jskos/context.json`.

Resources can be [tested for sameness](#resource-sameness) based on field `uri`.

The fields `created`, `issued`, `modified`, `creator`, `contributor`, `source`,
and `publisher` do not refer to the entity referenced by the resource but to
the resource object. For instance a resource about the city of Rome might have
a recent date `created` while the founding date `-0753` would be stated in
[item] field `startDate`.

For use cases of field `partOf` see also [Concept Schemes].

## Item

[item]: #item
[items]: #item

An **item** is a [resource] with the following optional fields (in addition to
the optional fields `@context`, `contributor`, `created`, `creator`,
`identifier`, `issued`, `modified`, `partOf`, `publisher`, `source`, `type`, and `uri`):

field         type                      description
------------- ------------------------- ----------------------------------------------
url           [URL]                     URL of a page with information about the item
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
note          [language map] of [list]  see [SKOS Documentary Notes]
startDate     [extended date]           date of begin (birth, creation...) of the item
endDate       [extended date]           date of end (death, resolution...) of the item
relatedDate   [extended date]           other date somehow related to the item (deprecated)
relatedDates  array of [extended date]  other dates somehow related to the item
startPlace    [set]                     where an item started (e.g. place of birth)
endPlace      [set]                     where an item ended (e.g. place of death)
place         [set]                     other relevant place(s) of the item
location      [location]                geographic location of the item
address       [address]                 postal address of the item
replacedBy    [set] of [item]           related items that supplant, displace, or supersede this item
basedOn       [set] of [item]           related items that inspired or led to this item
subject       [set]                     what this item is about (e.g. topic)
subjectOf     [set]                     resources about this item (e.g. documentation)
depiction     [list] of [URL]           list of image URLs depicting the item
media         [list] of [media]         audiovisual or other digital content representing the item

Applications MAY limit the fields `notation` and/or `depiction` to lists of a single
element or ignore all preceding elements of these lists.

If `startDate` is given, the value of `endDate` SHOULD NOT be an interval with open start.
If `endDate` is given, the value of `startDate` SHOULD NOT be an interval with open end.

## Concept

[concept]: #concept
[concepts]: #concept

A **concept** is an [item] and [concept bundle] with the following optional
fields (in addition to the optional fields `@context`, `address`, `altLabel`,
`changeNote`, `contributor`, `created`, `creator`, `definition`, `depiction`,
`editorialNote`, `endDate`, `endPlace`, `example`, `hiddenLabel`,
`historyNote`, `identifier`, `issued`, `location`, `modified`, `notation`,
`note`, `partOf`, `place`, `prefLabel`, `publisher`, `scopeNote`, `source`,
`startDate`, `startPlace`, `subjectOf`, `subject`, `type`, `uri`, `url`,
`memberSet`, `memberList`, `memberChoice`, and `memberRoles`):

field        type                       description
------------ -------------------------- -------------------------------------------------------------------------------
narrower     [set]                      narrower concepts
broader      [set]                      broader concepts
related      [set]                      generally related concepts
previous     [set]                      related concepts ordered somehow before the concept
next         [set]                      related concepts ordered somehow after the concept
ancestors    [set]                      list of ancestors, possibly up to a top concept
inScheme     [set] of [concept schemes] concept schemes the concept belongs to
topConceptOf [set] of [concept schemes] concept schemes the concept is a top concept of
mappings     [set] of [mappings]        mappings from and/or to this concept
occurrences  [set] of [occurrences]     occurrences with this concept
deprecated   [boolean]                  mark a concept as deprecated (false by default)

The first element of field `type`, if given, MUST be the [item type] URI
<http://www.w3.org/2004/02/skos/core#Concept>. The type URI 
<http://schema.vocnet.org/NonIndexingConcept> should be used as second element
for concepts not meant to be used for indexing.

Applications MAY limit the `inScheme` and/or `topConceptOf` to sets of a single
element or ignore all but one element of these sets.

If both fields `broader` and `ancestors` are given, the set `broader` MUST
include [the same] concept as the first element of `ancestors`.

The [concept bundle] fields `memberSet`, `memberList`, `memberChoice`, and `memberRoles` can
be used to express the parts of a **composed concept** (also known as combined
or synthesized concepts) unsorted or sorted. The field `memberChoice` SHOULD
NOT be used without proper documentation because its meaning in this context is
unclear. A concept MUST NOT include more than one of concept bundle fields. A
concept SHOULD NOT reference itself as part of its concept bundle.

::: {.callout-note}
The "ancestors" field is useful in particular for monohierarchical classifications
but it's not forbidden to choose just one arbitrary path of concepts that are
connected by the broader relation.
:::

```{.json #lst-concept1 lst-cap="concept"}
{{< include examples/example.concept.json >}}
```

```{.json #lst-concept2 lst-cap="concept from GND"}
{{< include examples/gnd-7507432-1.concept.json >}}
```

```{.json #lst-concept3 lst-cap="concept from DDC"}
{{< include examples/ddc-305.40941109033.concept.json >}}
```


## Concept Schemes

[concept scheme]: #concept-schemes
[concept schemes]: #concept-schemes
[scheme]: #schemes

A **concept scheme** is an [item] with the following optional fields (in
addition to the optional fields `@context`, `address`, `altLabel`,
`changeNote`, `contributor`, `created`, `creator`, `definition`, `depiction`,
`editorialNote`, `endDate`, `endPlace`, `example`, `hiddenLabel`,
`historyNote`, `identifier`, `issued`, `location`, `modified`, `notation`,
`note`, `partOf`, `place`, `prefLabel`, `publisher`, `scopeNote`, `source`,
`startDate`, `startPlace`, `subjectOf`, `subject`, `type`, `uri`, and `url`):

field            type                       definition
---------------- -------------------------- --------------------------------------------------------------------------------------
topConcepts      [set] of [concepts]        top [concepts] of the scheme
versionOf        [set] of [concept schemes] [concept scheme] which this scheme is a version or edition of
namespace        [URI]                      URI namespace that all concepts URIs are expected to start with
uriPattern       string                     regular expression that all concept URIs are expected to match
notationPattern  string                     regular expression that all primary notations should follow
notationExamples [list] of string           list of some valid notations as examples
concepts         [set] of [concepts]        concepts in the scheme
types            [set] of [concepts]        [concept types] of concepts in this scheme
distributions    [set] of [distributions]   [Distributions] to access the content of the concept scheme
extent           string                     Size of the concept scheme
languages        [list] of language tags    Supported languages
license          [set]                      Licenses which the full scheme can be used under

The first element of field `type`, if given, MUST be the [item type] URI
<http://www.w3.org/2004/02/skos/core#ConceptScheme>.

The values of field `uriPattern` and `notationPattern` MUST conform to the
regular expression syntax used by XML Schema ([Appendix F](https://www.w3.org/TR/xmlschema-2/#regexs))
and SHOULD be anchored with `^` as first and `$` as last character. Applications MAY automatically
anchor unanchored regular expressions.

If `concepts` is a set, all its member concepts SHOULD contain a field
`inScheme` and all MUST contain [the same] concept scheme in field `inScheme`
if this field is given.

If `types` and `concepts` are sets, the `types` set SHOULD include all [concept types]
for each concept's `type` other than `http://www.w3.org/2004/02/skos/core#Concept`.

Resource field `partOf` at a concept scheme MUST be interpreted as following:

- if the linked resource is another [concept scheme], the concept scheme is *subset of* the other concept scheme
- if the linked resource is a [registry], the concept scheme is *listed in* in the registry

Item field `replacedBy` at a concept schemes SHOULD be used to connect successive editions or concept scheme that have been replaced or renamed.

Item field `basedOn` at a concept schemes SHOULD be used to connect translations, abridged versions, or concept schemes that have been inspired by another concept scheme.

## Concept Occurrences

[occurrences]: #concept-occurrences
[occurrence]: #concept-occurrences
[concept occurrence]: #concept-occurrence
[concept occurrences]: #concept-occurrences

An **occurrence** is a [resource] and [concept bundle] with the following
optional fields (in addition to the optional fields `@context`, `contributor`,
`created`, `creator`, `identifier`, `issued`, `modified`, `partOf`,
`publisher`, `source`, `type`, `uri`, `memberSet`, `memberList`, `memberChoice`, and `memberRoles`):

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

:::{#lst-ex2}
Two occurrences and their combined co-occurrence from GBV Union Catalogue (GVK) as of November 22th, 2017: [3657 records](https://gso.gbv.de/DB=2.1/CMD?ACT=SRCHA&IKT=1016&SRT=YOP&TRM=bkl+08.22) are indexed with class `08.22` (medieval philosophy) from Basisklassifikation, [144611](https://gso.gbv.de/DB=2.1/CMD?ACT=SRCHA&IKT=1016&SRT=YOP&TRM=ddc+610) with DDC notation `610` (Medicine & health) and [2 records](https://gso.gbv.de/DB=2.1/CMD?ACT=SRCHA&IKT=1016&SRT=YOP&TRM=bkl+08.22+ddc+610) with both.

```{.json}
{{< include examples/gvk-co.occurrence.json >}}
```
:::

:::{#lst-ex-wikidata}
The Wikidata [concept of an individual human](http://www.wikidata.org/entity/Q5) is linked to 206 Wikimedia sites (mostly Wikipedia language editions) and more than 3.7 million people (instances of <http://www.wikidata.org/entity/P31>) at November 15th, 2017.

```{.json}
{{< include examples/wikidata-occurrences.concept.json >}}
```
:::


## Registries

[registries]: #registries
[registry]: #registries

A **registry** is an [item] with the following optional fields (in addition to
the optional fields `@context`, `address`, `altLabel`, `changeNote`,
`contributor`, `created`, `creator`, `definition`, `depiction`,
`editorialNote`, `endDate`, `endPlace`, `example`, `hiddenLabel`,
`historyNote`, `identifier`, `issued`, `location`, `modified`, `notation`,
`note`, `partOf`, `place`, `prefLabel`, `publisher`, `scopeNote`, `source`,
`startDate`, `startPlace`, `subjectOf`, `subject`, `type`, `uri`, and `url`):

field        type                       definition
------------ -------------------------- --------------------------------------------------------------------------------------
concepts     [set] of [concepts]        [concepts] in this registry
schemes      [set] of [concept schemes] [concept schemes] in this registry
types        [set] of [concepts]        [concept types] in this registry
mappings     [set] of [mappings]        [mappings] in this registry
registries   [set] of [registries]      other registries in this registry
concordances [set] of [concordances]    [concordances] in this registry
occurrences  [set] of [occurrences]     [occurrences] in this registry
extent       string                     Size of the registry
languages    [list]                     Supported languages
license      [set]                      Licenses which the full registry content can be used under

The first element of field `type`, if given, MUST be the [item type] URI
<http://purl.org/cld/cdtype/CatalogueOrIndex>.

Registries are collection of [concepts], [concept schemes], [concept types],
[concept mappings], and/or other registries.

::: {.callout-note}
Registries are the top JSKOS entity, followed by
[concordances], [mappings] [concept schemes], and on the lowest level
[concepts] and [concept types]. See [Distributions] for an alternative.

Additional integrity rules for registries will be defined (TODO).
:::


## Distributions

[distribution]: #distributions
[distributions]: #distributions

A **distribution** is an [item] with the following fields (in addition to the
optional fields `@context`, `address`, `altLabel`, `changeNote`, `contributor`,
`created`, `creator`, `definition`, `depiction`, `editorialNote`, `endDate`,
`endPlace`, `example`, `hiddenLabel`, `historyNote`, `identifier`, `issued`,
`location`, `modified`, `notation`, `note`, `partOf`, `place`, `prefLabel`,
`publisher`, `scopeNote`, `source`, `startDate`, `startPlace`, `subjectOf`,
`subject`, `type`, `uri`, and `url`):

Distributions mostly cover the [class Distribution](https://www.w3.org/TR/vocab-dcat-3/#Class:Distribution) from [Data Catalog Vocabulary](https://www.w3.org/TR/vocab-dcat-3/).

field          type            definition
-------------- --------------- ------------------------------------------------------------------
download       [URL]           location of a file with distribution content in given format
accessURL      [URL]           URL of an API or landing page to retrieve the distribution content
format         [URI]           data format identifier of the distribution content
mimetype       [URI] or string Internet Media Type (also known as MIME type)
compressFormat [URI]           compression format of the distribution
packageFormat  [URI]           packaging format when multiple files are grouped together
license        [set]           license which the data can be used under
size           string          Size of a distribution in bytes or literal such as "1.5 MB"
checksum       [checksum]      Checksum of the download (algorithm and digest value)

The `format` field SHOULD reference a content format rather than its
serialization and possible wrapping. The URI of JSKOS is
<http://format.gbv.de/jskos>.

Fields `mimetype`, `compressFormat`, and `packageFormat` SHOULD be IANA media type URIs, if available.  Field `mimetype` MAY be a string for backwards-compatibility.

The first element of field `type`, if given, MUST be the [item type] URI
<http://www.w3.org/ns/dcat#Distribution>.

::: {.callout-note}
Access to [concept schemes] and [concordances] can also be specified with
fields `concepts`, `types`, and `mappings`, respectively. Distributions provide
an alternative and extensible method to express access methods.
:::

::: {#lst-ex}

Distribution of a newline-delimited JSKOS file:

```{.json}
{{< include examples/jskos.distribution.json >}}
```

Distribution of a RDF/XML with SKOS data:

```{.json}
{{< include examples/rdfxml.distribution.json >}}
```

Distribution of a gzip-compressed MARC/XML file in [MARC 21 Format for
Authority Data](https://www.loc.gov/marc/authority/):

```{.json}
{{< include examples/marc.distribution.json >}}
```

:::


## Concordances

[concordances]: #concordances
[concordance]: #concordances

A **concordance** is an [item] with the following fields (in addition to the
optional fields `@context`, `address`, `altLabel`, `changeNote`,
`contributor`, `created`, `creator`, `definition`, `depiction`,
`editorialNote`, `endDate`, `endPlace`, `example`, `hiddenLabel`, `historyNote`, `identifier`,
`issued`, `location`, `modified`, `notation`, `note`, `partOf`, `prefLabel`, `publisher`,
`scopeNote`, `source`, `startDate`, `startPlace`, `subjectOf`, `subject`, `type`, `uri`, and `url`). All fields except `fromScheme` and `toScheme` are optional.

field         type                      definition
------------- ------------------------- ------------------------------------------------------
mappings      [set] of [mappings]       [mappings] in this concordance
distributions [set] of [distributions]  [distributions] to access the concordance
fromScheme    [concept scheme]          Source concept scheme
toScheme      [concept scheme]          Target concept scheme
extent        string                    Size of the concordance
license       [set]                     License which the full concordance can be used under

The first element of field `type`, if given, MUST be the [item type] URI
<http://rdfs.org/ns/void#Linkset>.

Concordances are collections of [mappings] from one [concept scheme] to
another. If `mappings` is a set then

* all its members with field `fromScheme` MUST have [the same] value
  like concordance field `fromScheme`.

* all its members with field `toScheme` MUST have [the same] value
  like concordance field `toScheme`.

::: {.callout-note}
There is an additional integrity constraint refering to field `inScheme` if concepts in mappings in concordances.
:::

## Concept Mappings

[mappings]: #concept-mappings
[mapping]: #concept-mappings
[concept mapping]: #concept-mappings
[concept mappings]: #concept-mappings

A **mapping** is an [item] with the following fields (in addition to the
optional fields `@context`, `address`, `altLabel`, `changeNote`,
`contributor`, `created`, `creator`, `definition`, `depiction`,
`editorialNote`, `endDate`, `endPlace`, `example`, `hiddenLabel`, `historyNote`, `identifier`,
`issued`, `location`, `modified`, `notation`, `note`, `partOf`, `prefLabel`, `publisher`,
`scopeNote`, `source`, `startDate`, `startPlace`, `subjectOf`, `subject`, `type`, `uri`, and `url`). All fields except `from` and `to` are optional.

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

::: {.callout-note}
When mappings are dynamically created it can be useful to assign a non-HTTP URI
such as `urn:uuid:687b973c-38ab-48fb-b4ea-2b77abf557b7`.
:::

::: {.callout-note}
Applications MAY use concept mappings to derive simple statements with [SKOS Mapping Properties](https://www.w3.org/TR/skos-reference/#mapping)
but SKOS integrity rules for mappings do not apply automatically.
:::

## Concept Bundles

[concept bundles]: #concept-bundles
[concept bundle]: #concept-bundles
[collections]: #concept-bundles
[concept collections]: #concept-bundles

A **concept bundle** is a group of [concepts]. Concept bundles can be used for
[mappings], composed concepts, and [occurrences].

A concept bundle is a JSON object with at most one of the following fields:

field       type                        definition
----------- --------------------------- ----------------------------------------------------------------------
memberSet   [set] of [concepts]         [concepts] in this bundle (unordered)
memberList  ordered [set] of [concepts] [concepts] in this bundle (ordered)
memberChoice [set] of [concepts]        [concepts] in this bundle to choose from
memberRoles object                      Object mapping role URIs to [set]s of [concepts]

Keys of a `memberRoles` object MUST be URIs and their values MUST be of type [set].

```{.json #lst-member-roles lst-cap="..."}
{{< include examples/memberRoles.concept.json >}}
```

::: {.callout-note}

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
:::

## Annotations

[annotation]: #annotations

An **annotation** links a JSKOS [resource] or another annotation with a review,
comment or similar document. An annotation is a JSON object that conforms to
the [Web Annotation Data Model] and further contains the following fields as
defined:

field       type                              definition
----------- --------------------------------- ----------------------------------------------------------------------
@context    [URL]                             the value `http://www.w3.org/ns/anno.jsonld`
type        string                            the value `Annotation`
id          [URI]                             globally unique identifier of the annotation
target      [URI], [Resource] or [Annotation] object being annotated, or its URI

[Web Annotation Data Model]: https://www.w3.org/TR/annotation-model/

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
    "identifier": [
      "http://purl.org/spar/fabio/VocabularyMapping",
      "http://rdf-vocabulary.ddialliance.org/xkos#Correspondence"
    ],
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

:::{#lst-sameness}
The following resources are same:

~~~{.json}
{ "uri": "http://example.org/123", "created": "2007" }
{ "uri": "http://example.org/123", "created": "2015" }
~~~
:::


## Closed world statements

[closed world statements]: #closed-world-statements

By default, a JSKOS document should be interpreted as possibly incomplete: a
missing field does not imply that no value exists for this field: this
assumption is also known as open-world assumption. Applications SHOULD support
closed world statements to explicitly disable the open world assumption for
selected properties and explicitly state the known absence or existence of
unknown values:

data type      open world closed world explicit negation explicit existence
-------------- ---------- ------------ ----------------- ----------------------------
[list]         no field   `[...]`      `[]`              `[null]` or `[..., null]`
[set]          no field   `[...]`      `[]`              `[null]` or `[..., null]`
[language map] no field   ` {...}`      no language tag   ` {"-":""}` or ` {"-":[""]}`
[resource]     no field   ` {...}`      -                 ` {}`
[URI]/[URL]    no field   `"..."`      -                 -
[date]         no field   `"..."`      -                 -

::: {#lst-closed-world}
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
:::


## Inference rules and integrity constraints

### Inference rules

JSKOS records can automatically be expanded with the following inference rules:

- Object types of set elements can be derived from fields the set is used in. For instance members of a set referenced by field `inScheme` can be assumed to be [concept schemes] (SKOS integritry rule S4) and members of a set referenced by field `topConcepts` can be assumed to be [concepts] (SKOS integritry rule S6).
- If a concept scheme *S* is in set `topConceptOf` of a concept *C* then *S* can be assumed to also be in the set `inScheme` of *C* (SKOS integrity rule S7)
- If a concept *C* is in set `topConcept` of a concept scheme *S* then *C* can be assumed to be in the set `topConceptOf` of *S* and vice versa (SKOS integrity rule S8)

<!--
TODO: skos:changeNote, skos:definition, skos:editorialNote, skos:example, skos:historyNote and skos:scopeNote are each sub-properties of skos:note (SKOS integrity rule S8)

TODO: ancestors => broaderTransitive (S22)

TODO: related (S23)

TODO: broader/narrower (S26)

TODO: Mappings (S38-S46)
-->

### Integritry constraints

Integrity constraints of SKOS SHOULD be respected. Applications MAY reject JSKOS data violating the constraints.

- [concepts], [concept schemes], [registries], [distributions], [concordances], [concept mappings] are pairwise disjoint (SKOS integrity rule S9)
- 

<!-- TODO: skos:related is disjoint with the property skos:broaderTransitive (S27) -->

*this list is not complete yet*

<!--

# Converting JSKOS to SKOS and vice versa

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
MUST start with and underscore (`_`) or consist of uppercase letters and digits 
only (A-Z, 0-1).  The fields SHOULD be ignored by generic JSKOS applications. 

::: {#lst-custom-fields}
The fields `PARTS` and `_id` in the following example can be ignored:

```json
{
  "_id": "e5fa44f2b31c1fb553b6021e7360d07d5d91ff5e",
  "uri": "http://www.wikidata.org/entity/Q34095",
  "prefLabel": { "en": "bronze" },
  "PARTS": ["copper", "tin"]
}
```
:::


# References {.unnumbered}

## Normative references {.unnumbered}

* M. Appleby et al: *IIIF Presentation API 3.0*.
  June 202.
  <https://iiif.io/api/presentation/3.0/>

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

* IANA: *Media Types*.
  <https://www.iana.org/assignments/media-types/>

* ISO: *Date and time — Representations for information interchangePart 2: Extensions*.
  ISO 8601-2:2019. (summary available at <https://www.loc.gov/standards/datetime/>)

* A. Phillips, M. Davis: *Tags for Identifying Languages*.
  RFC 3066, September 2006. <https://tools.ietf.org/html/rfc3066>

* R. Sanderson, P. Ciccarese, B. Young: *Web Annotation Data Model*.
  W3C Recommendation, February 2017. <https://www.w3.org/TR/annotation-model/>

* SPDX: *SPDX 2.3*. <http://spdx.org/rdf/terms#>

[RFC 2119]: https://tools.ietf.org/html/rfc2119
[RFC 4627]: https://tools.ietf.org/html/rfc4627
[RFC 3987]: https://tools.ietf.org/html/rfc3987
[RFC 3066]: https://tools.ietf.org/html/rfc3066
[RFC 7946]: https://tools.ietf.org/html/rfc7946

## Informative references {.unnumbered}

* R. Albertoni, D. Browning, S. Cox, A. Gonzalez Beltran, A. Perego, P. Winstanley:
  *Data Catalog Vocabulary (DCAT) - Version 3*.
  May 2022.
  <https://www.w3.org/TR/vocab-dcat-3/>.

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

* F. Cotton (editor): *XKOS: An SKOS extension for representing statistical classifications*.
  DDI Alliance, May 2019.
  <https://rdf-vocabulary.ddialliance.org/xkos.html>

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

* M. Zeng, M. Žumer: *NKOS Dublin Core Application Profile (NKOS AP)*.
  Version 0.2, October 2015.
  <https://nkos.dublincore.org/nkos-ap.html>

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

## JSON-LD context {.unnumbered}

The following [JSON-LD context document] can be used to map JSKOS
without [closed world statements] to RDF triples.

[JSON-LD context document]: http://www.w3.org/TR/json-ld/#the-context

```{.json}
{{< include context.json >}}
```

JSKOS with closed world statements can be mapped to RDF by ignoring all boolean
values and/or by mapping selected boolean values to RDF triples with blank
nodes.

Applications should further add implicit RDF triples, such as `$someConcept
rdf:type skos:Concept`, if such information can be derived from JSKOS by other
means.

## JSON Schemas and validation {.unnumbered}

Experimental JSON Schemas exist but don't cover all aspects of JSKOS: 

* [Resource](resource.schema.json)
* [Item](item.schema.json)
* [Concept](concept.schema.json)
* [Scheme](scheme.schema.json)
* [Mapping](mapping.schema.json)
* [Bundle](bundle.schema.json)
* [Registry](bundle.schema.json)
* [Concordance](concordance.schema.json)
* [Distribution](distribution.schema.json)
* [Occurrence](occurrence.schema.json)

See NodeJS library [jskos-validate] for an implementation.

Public services to validate JSKOS data are included in instances of
[jskos-server] and at https://format.gbv.de/validate/.

[jskos-validate]: https://www.npmjs.com/package/jskos-validate
[jskos-server]: https://www.npmjs.com/package/jskos-server

## Changelog {.unnumbered}

### next

- Add extended dates for `startDate`, `endDate`, and `relatedDate`.
- Add `relatedDates` to replace `relatedDate`
- Clarify semantics of resource fields
- Change item field `replacedBy` to be set (breaking change!)
- Add item field `basedOn`

### 0.5.4 (2024-09-27) {.unnumbered}

- Change JSON-LD context for spatial fields (`location`, `place`, `startPlace`, `endPlace`)
- Add Concept field `deprecated`
- Add Item field `replacedBy`
- Clarify anchoring of regular expressions
- Mention non-indexing concepts

### 0.5.3 (2024-09-18) {.unnumbered}

- Allow `@context` to hold an array

### 0.5.2 (2024-08-30) {.unnumbered}

- Allow location of type `GeometryCollection`
- Fix schema.org namespace in JSON-LD context document

### 0.5.1 (2023-07-03) {.unnumbered}

- More precise type of `inScheme`, `topConceptOf`, `mappings`, `occurrences`
- Add some inference rules and integrity constraints
- Fix JSON Schema files to allow negative dates and strict annotation dates
- Add item fields `place` and `media`

### 0.5.0 (2022-08-29) {.unnumbered}

* Make clear concordance field name distributions (plural)
* Add license, compressFormat, packageFormat, size, checksum, accessURL to distribution
* Remove fields for undefined JSKOS-API URLs

### 0.4.9 (2022-01-18) {.unnumbered}

* Change format of URI in JSON Schema from URI to IRI
* Change base format of URL in JSON Schema from URI to IRI

### 0.4.8 (2021-02-18) {.unnumbered}

* Add concept scheme field notationExamples

### 0.4.7 (2021-02-10) {.unnumbered}

* Add resource field source
* Add item field address 
* Move startPlace/endPlace to Item and map them to schema:location

### 0.4.6 (2019-12-02) {.unnumbered}

* Add memberRoles

### 0.4.5 (2019-04-08) {.unnumbered}

* Add annotations (basic support)

### 0.4.4 (2018-11-02) {.unnumbered}

* Add concept scheme fields notationPattern and uriPattern
* Add concept fields startPlace and endPlace

### 0.4.2 (2018-08-22) {.unnumbered}

* Move identifier field from item to resource
* Add SKOS documentation field note to item
* Add optional JSON Schemas

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

# Examples  {.unnumbered}

:::{#lst-gnd-concept-scheme lst-cap="Integrated Authority File (GND)"}

The Integrated Authority File (German: *Gemeinsame Normdatei*) is an authority
file managed by the German National Library. This example encodes GND as JSKOS
concept scheme with explicit knowledge about existence of more identifiers,
definitions, and preferred labels:

```{.json}
{{< include examples/gnd.scheme.json >}}
```
:::

:::{#lst-gnd-concept lst-cap="GND Concept"}

```{.json}
{{< include examples/gnd-4130604-1.concept.json >}}
```
:::

:::{#lst-ex-ddc-1 lst-cap="DDC Concept"}

A concept from the Dewey Decimal Classification, German edition 22:

```{.json}
{{< include examples/ddc-612.112.concept.json >}}
```
:::

:::{#lst-ex-ddc-2 lst-cap="DDC Concept"}

A concept from the abbridget Dewey Decimal Classification, edition 23, in three languages:

```{.json}
{{< include examples/ddc-641.5.concept.json >}}
```
:::

:::{#lst-ex-ddc-decomposed lst-cap="DDC Concept"}
A decomposed DDC number for medieval cooking:

```{.json}
{{< include examples/ddc-641.50902.concept.json >}}
```
:::


:::{#lst-ex-mappings lst-cap="Mappings"}
Multiple mappings from one concept (612.112 in DDC) to GND.

```{.json}
{{< include examples/ddc-gnd-1.mapping.json >}}
```

```{.json}
{{< include examples/ddc-gnd-2.mapping.json >}}
```
:::
