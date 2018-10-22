const fs = require("fs")
const assert = require("assert")
const testExamples = require('./lib/test-examples.js')

// load schemas
const ajv = new require("ajv")({ extendRefs: true })
const types = "resource item concept scheme mapping concordance registry distribution occurrence bundle".split(" ")

let schemas = {}
let validate = {}
for (let type of types) {
  schemas[type] = JSON.parse(fs.readFileSync(`./schemas/${type}.schema.json`))
  ajv.addSchema(schemas[type])
}
for (let type of types) {
  validate[type] = ajv.compile(schemas[type])
}


testExamples("JSON Schema examples", types, (objects, file, type) => {
  for (let object of objects) {
    if (validate[type](object)) {
      assert.ok(true)
    } else {
      assert.fail(`${validate[type].errors.reduce((t, c) => `${t}- ${c.dataPath} ${c.message}\n`, "")}`)
    }
  }
})
