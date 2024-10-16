import type { Contract, ContractTransaction } from "ethers"
import type { Abi } from "../abi"
import { ToTypeTuple } from "../type"

/**
 * This is a specialized contract type that provides type-safe methods
 * for interacting with a contract's functions based on its ABI. It extends the base
 * `Contract` from ethers.js and ensures that function inputs and outputs are correctly
 * typed according to the ABI.
 *
 * @template {Abi} TAbi - The ABI type representing the structure of the contract.
 *
 * Each function in the contract is dynamically typed based on its input and output
 * types as specified in the ABI. Functions with no outputs return a `ContractTransaction`,
 * while functions with one or more outputs return the appropriate types.
 *
 * @example
 * Usage
 * ```ts
 * import { TypedContract } from "typed-contracts/types/ethers6"
 * import { Contract } from "ethers"
 *
 * export type ERC20Contract = TypedContract<typeof ERC20_abi> & {}
 * export const ERC20_connect = (address: string, runner: ContractRunner) =>
 *   new Contract(address, ERC20_abi, runner) as ERC20Contract
 *
 * export const ERC20_abi = [
 *   // ABI definition goes here...
 * ] as const
 *
 * // Example of connecting to a contract:
 * const erc20 = ERC20_connect("0xYourContractAddress", runner);
 * const balance = await erc20.balanceOf("0xYourWalletAddress");
 * ```
 */
export type TypedContract<TAbi extends Abi> = Contract & ProcessAbi<TAbi>

type ProcessAbi<
	TAbi extends Abi,
	R extends {
		[key: string]: (...args: any[]) => any
	} = {},
> =
	TAbi extends readonly [infer Current extends Abi.Item, ...infer Tail extends readonly Abi.Item[]] ?
		Current extends { type: "function" } ?
			ProcessAbi<
				Tail,
				R & {
					[K in Current["name"]]: (...args: ToTypeTuple<Current["inputs"], "input">) => Promise<
						Current["outputs"]["length"] extends 0 ? ContractTransaction
						: Current["outputs"]["length"] extends 1 ? ToTypeTuple<Current["outputs"], "output">[0]
						: ToTypeTuple<Current["outputs"], "output">
					>
				}
			>
		:	ProcessAbi<Tail, R>
	:	R
