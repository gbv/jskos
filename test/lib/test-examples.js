import fs from "fs"
import * as glob from "glob"

export default (name, base, types, test) => {
  describe(name, () => {
    for (let type of types) {
      describe(type, () => {
        for (let file of glob.sync(`${base}/*${type}.json`)) {    
          it(file, async () => {
            let objects = JSON.parse(fs.readFileSync(file))
            if (!Array.isArray(objects)) {
              objects = [objects]
            }
            return test(objects, file, type)
          })
        }
      })
    }
  })
}
