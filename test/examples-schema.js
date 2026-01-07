import fs from "fs"
import assert from "assert"
import testExamples from "./lib/test-examples.js"

// Set up Ajv JSON schema validator
import Ajv2020 from "ajv/dist/2020.js"
import ajvFormats from "ajv-formats"
import ajvFormats2019 from "ajv-formats-draft2019"

const ajv = new Ajv2020()
ajvFormats(ajv)
ajvFormats2019(ajv)

// load schemas
const types = "resource dataset item concept scheme mapping concordance registry distribution service occurrence bundle annotation".split(" ")

const schemas = {}
for (let type of types) {
  schemas[type] = JSON.parse(fs.readFileSync(`./schemas/${type}.schema.json`))
  ajv.addSchema(schemas[type])
}

var validate = Object.fromEntries(types.map(type => [type, ajv.compile(schemas[type])]))
const testValid = () => testExamples("Valid against JSON Schema", "examples", types, (objects, file, type) => {
  for (let object of objects) {
    if (validate[type](object)) {
      assert.ok(true)
    } else {
      assert.fail(`${validate[type].errors.reduce((t, c) => `${t}- ${c.dataPath} ${c.message}\n`, "")}`)
    }
  }
})

testValid()

testExamples("Invalid against JSON Schema", "examples/invalid", types, (objects, file, type) => {
  for (let object of objects) {
    if (validate[type](object)) {
      assert.fail(`${file} should have been detected as invalid JSKOS ${type}`)
    } else {
      assert.ok(true)
    }
  }
})

describe("Strict checking (no unknown fields)", () => {
  const ajv = new Ajv2020()
  ajvFormats(ajv)
  ajvFormats2019(ajv)

  const strict = "occurrence mapping concept scheme registry concordance service distribution".split(" ")
  strict.forEach(type => schemas[type].unevaluatedProperties = false)
   
  types.forEach(type => ajv.addSchema(schemas[type]))

  validate = Object.fromEntries(types.map(type => [type, ajv.compile(schemas[type])]))
  
  strict.forEach(type => it(type, () => {
    const valid = ajv.compile(schemas[type])
    const example = type === "mapping" ? { from: {memberSet:[]}, to: {memberSet:[]} } : {}
    example.unknown = []
    assert.equal(valid(example), false)
  }))

  testValid()
})
