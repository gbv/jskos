import fs from "fs"
import assert from "assert"
import testExamples from "./lib/test-examples.js"

import jsonld from "jsonld"

const types = "resource item concept scheme mapping concordance registry distribution occurrence bundle".split(" ")

const context = JSON.parse(fs.readFileSync('./context.json'))

// TODO: move to jskos-tools
// or fix https://github.com/digitalbazaar/jsonld.js/issues/271
function cleanup(data) {
  if ( Array.isArray(data) ) {
    data.forEach(cleanup)
  } else if (typeof data === 'object') {
    for (let key in data) {
      if (key.match(/-$/)) { // remove language ranges
        delete data[key]
      } else {
        cleanup(data[key])
      }
    }
  }
}

testExamples("JSON-LD examples", types, async (objects, file, type) => {
  objects.forEach( doc => {      
    doc['@context'] = context
    cleanup(doc)
  })
  const ntfile = file.replace(/\.json/,'.nt')
  const nquads = await jsonld.toRDF(objects, {format: 'application/n-quads'})
      .then(quads => quads.split("\n").filter( l => l ).sort().join("\n")+"\n")
  if (fs.existsSync(ntfile)) {
    let expect = fs.readFileSync(ntfile).toString()
    assert.equal(expect, nquads, 'ntfile')
    // console.log(ntfile)
  } else {
    // console.log(nquads)
  }
})
