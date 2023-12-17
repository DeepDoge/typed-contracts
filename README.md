# Typed Contracts

Typed Contracts is a TypeScript Type library, to generete Typed Contracts from ABI files without any file generation.

Supports: ethers6

## Install

[Install Instructions](https://github.com/DeepDoge/typed-contracts/releases)

## Usage

```ts
import { TypedContract } from "typed-contracts/types/ethers6"
import { Contract } from "ethers"

export type ERC20Contract = TypedContract<typeof ERC20_abi> & {}
export const ERC20_connect = (address: string, runner: ContractRunner) =>
	new Contract(address, ERC20_abi, runner) as ERC20Contract

export const ERC20_abi = [
	// ...
] as const
```
