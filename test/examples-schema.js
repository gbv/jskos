import fs from "fs"
import assert from "assert"
import testExamples from "./lib/test-examples.js"

// Set up Ajv JSON schema validator
import Ajv2019 from "ajv/dist/2019.js"
import ajvFormats from "ajv-formats"
import ajvFormats2019 from "ajv-formats-draft2019"

const ajv = new Ajv2019()
ajvFormats(ajv)
ajvFormats2019(ajv)

// load schemas
const types = "resource item concept scheme mapping concordance registry distribution occurrence bundle annotation".split(" ")

let schemas = {}
let validate = {}
for (let type of types) {
  schemas[type] = JSON.parse(fs.readFileSync(`./schemas/${type}.schema.json`))
  ajv.addSchema(schemas[type])
}
for (let type of types) {
  validate[type] = ajv.compile(schemas[type])
}

// validate examples against schemas
testExamples("JSON Schema examples", types, (objects, file, type) => {
  for (let object of objects) {
    if (validate[type](object)) {
      assert.ok(true)
    } else {
      assert.fail(`${validate[type].errors.reduce((t, c) => `${t}- ${c.dataPath} ${c.message}\n`, "")}`)
    }
  }
})
