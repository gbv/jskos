const glob = require("glob")
const fs = require("fs")
const assert = require("assert")

// load schemas
const ajv = new require("ajv")({ extendRefs: true })
const types = "resource item concept scheme mapping concordance registry distribution occurrence conceptBundle".split(" ")

let schemas = {}
let validate = {}
for (let type of types) {
  schemas[type] = JSON.parse(fs.readFileSync(`./schemas/${type}.schema.json`))
  ajv.addSchema(schemas[type])
}
for (let type of types) {
  validate[type] = ajv.compile(schemas[type])
}

// validate examples
describe("JSON Schema test cases", () => {
  for (let type of types) {
    describe(type, () => {
      for (let file of glob.sync('examples/*'+type+'.json')) {        
        it(file, () => {
          let objects = JSON.parse(fs.readFileSync(file))
          if (!Array.isArray(objects)) {
            objects = [objects]
          }
          for (let object of objects) {
            if (validate[type](object)) {
              assert.ok(true)
            } else {
              assert.fail(`${validate[type].errors.reduce((t, c) => `${t}- ${c.dataPath} ${c.message}\n`, "")}`)
            }
          }
        })
      }
    })
  }
})
