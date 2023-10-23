import args from "command-line-args"
import { generate } from "./library/generate"

const contractsDirPath = args([{ name: "src", type: String }])["src"] as string | undefined
if (!contractsDirPath) throw new Error("You didn't provide a path for contracts directory.")
generate(contractsDirPath)
