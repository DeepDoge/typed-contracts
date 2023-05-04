#!/usr/bin/env ts-node-script

import { generate } from "./generate"

const contractsDirPath = process.argv.slice(1)[0]
if (!contractsDirPath) throw new Error("You didn't provide a path for contracts directory.")
generate(contractsDirPath)
