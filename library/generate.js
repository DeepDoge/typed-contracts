import fs from "fs"
import path from "path"
import typescript from "typescript"

// vite.config.TS doesn't support TS file imports, so we have to do this thing.
const filename = path.join("node_modules", "typify-contracts", "library", "generate.ts")
const ts = fs.readFileSync(filename, "utf8")
const js = typescript.transpile(ts, { module: "commonjs" }, filename)
new Function("", `const exports = {}; ${js}; return exports`)()
