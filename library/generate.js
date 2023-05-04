import { compileAndSave } from "@ethereum-waffle/compiler"
import fs from "fs"
import path from "path"
import typescript from "typescript"

const filename = path.join("node_modules", "typify-contracts", "library", "cli.ts")
const ts = fs.readFileSync(filename, "utf8")
const js = typescript.transpile(ts, { module: "commonjs" }, filename)
const { generate } = new Function("fs", "path", "compileAndSave", `const exports = {}; ${js}; return exports`)(fs, path, compileAndSave)
export { generate }
