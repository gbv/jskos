const fs = require("fs")
const assert = require("assert")
const testExamples = require('./lib/test-examples.js')
const jsonld = require('jsonld')

const types = "resource item concept scheme mapping concordance registry distribution occurrence bundle".split(" ")

const context = JSON.parse(fs.readFileSync('./context.json'))
const frame = JSON.parse(fs.readFileSync('./frame.json'))
frame['@context'] = context

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

testExamples("JSON-LD examples", types, (objects, file, type) => {
  objects.forEach( doc => {      
    doc['@context'] = context
    cleanup(doc)
  })
  jsonld.toRDF(objects, {format: 'application/n-quads'}, (err, nquads) => {
    ntfile = file.replace(/\.json/,'.nt')
    nquads = nquads.split("\n").filter( l => l ).sort().join("\n")+"\n"
    if (fs.existsSync(ntfile)) {
      let expect = fs.readFileSync(ntfile).toString()
      assert.equal(nquads, expect)
    } else {
      console.log(nquads)
    }
  })

  objects.forEach( doc => {
    jsonld.toRDF(doc, {format: 'application/n-quads'}, (err, nquads) => {
      jsonld.fromRDF(nquads, {format: 'application/n-quads'}, (err, doc) => {
        let options = {
          expandContext: context,
          omitDefault: true
        }
        jsonld.frame(doc, frame, options, (err, doc) => {
          delete doc['@context']
          //if ( (doc['@graph'] || []).length === 1 ) {
          //  doc = doc['@graph'][0]
          //}
          console.log(doc)
        })
      })
    })
  })
})
