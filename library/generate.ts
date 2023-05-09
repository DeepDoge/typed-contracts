import fs from "fs"
import { compileAndSave } from "waffle-compiler/library"
import path from "path"
import type { Abi } from "./types/abi"

export async function generate(contractsDirpath: string) {
	const artifactsDirpath = path.join(contractsDirpath, "artifacts")

	console.log("Generating abi files...")
	await compileAndSave({
		sourceDirectory: contractsDirpath,
		outputDirectory: artifactsDirpath,
	})
	console.log("Generated abi files ")
	console.log()

	const dirents = fs.readdirSync(artifactsDirpath, { recursive: true, encoding: "utf-8", withFileTypes: true })
	for (const dirent of dirents) {
		if (!dirent.isFile()) continue
		if (!dirent.name.endsWith(".json")) continue

		const fullpath = path.join(artifactsDirpath, dirent.name)

		let abi: Abi
		try {
			const jsonData = JSON.parse(fs.readFileSync(fullpath).toString()) as unknown
			if (!(jsonData && typeof jsonData === "object" && "abi" in jsonData && Array.isArray(jsonData.abi)))
				throw new Error("Json file is doesn't contain abi.")
			abi = jsonData.abi
		} catch (error) {
			console.warn("Error while parsing", fullpath, error)
			continue
		}

		const name = path.basename(fullpath, ".json")
		const dirname = path.dirname(fullpath)
		const tsFilename = `${name}.ts`
		console.log(`Generating ${tsFilename}...`)

		const type = [
			`import type { TypifyContract } from "typify-contracts/library/types/typify"`,
			`import { Contract, type ContractRunner } from "ethers"`,
			`export type ${name}_Contract = TypifyContract<typeof abi> & {}`,
			`export const connect_${name} = (address: string, runner: ContractRunner) => new Contract(address, abi, runner) as ${name}_Contract`,
			`const abi = ${JSON.stringify(abi, null, "\t")} as const`,
		].join("\n")
		fs.writeFileSync(path.join(dirname, tsFilename), type)

		console.log(`Generated ${tsFilename}`)
	}

	console.log()
	console.log("Done")
}
