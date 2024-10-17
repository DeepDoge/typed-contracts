import { AddressLike, BytesLike } from "ethers"
import { Abi } from "./abi"

declare const LABEL: unique symbol
type _<Label extends string, T> = { [LABEL]?: Label } & T

export type TupleItem = Abi.FunctionItem.Input | Abi.FunctionItem.Output

export type ToTypeTuple<
	TypeStrings extends readonly TupleItem[],
	Mode extends "input" | "output",
	R extends readonly any[] = readonly []
> = TypeStrings extends readonly [infer Current extends TupleItem, ...infer Tail extends readonly TupleItem[]]
	? ToTypeTuple<Tail, Mode, readonly [...R, _<Current["name"], ToType<Current["type"], Mode>>]>
	: R

export type ToType<T extends string, Mode extends "input" | "output"> = T extends keyof PrimativeTypeMap
	? PrimativeTypeMap[T][Mode]
	: T extends `${infer T}[]`
	? ToType<T, Mode>[]
	: never

export type PrimativeTypeMap = {
	[K in `${"u" | ""}int${number | ""}` | `${"u" | ""}fixed`]: {
		input: bigint
		output: bigint
	}
} & {
	[K in `bytes${number | ""}`]: {
		input: BytesLike
		output: `0x${string}`
	}
} & {
	string: {
		input: string
		output: string
	}
	bool: {
		input: boolean
		output: boolean
	}
	address: {
		input: AddressLike
		output: `0x${string}`
	}
}
