import type {
	AddressLike,
	BytesLike,
	Contract,
	ContractTransaction,
} from "ethers"
import type { Abi } from "../abi"

type ToType_Base<
	TypeString extends string,
	Mode extends "input" | "output"
> = TypeString extends `${"u" | ""}int${number | ""}` | `${"u" | ""}fixed`
	? bigint
	: TypeString extends `bytes${number | ""}`
	? Mode extends "output"
		? `0x${string}`
		: BytesLike
	: TypeString extends "string"
	? string
	: TypeString extends "bool"
	? boolean
	: TypeString extends "address"
	? Mode extends "output"
		? `0x${string}`
		: AddressLike
	: unknown

type ToType<
	TypeString extends string,
	Mode extends "input" | "output"
> = TypeString extends `${infer BaseTypeString}[]`
	? ToType<BaseTypeString, Mode>[]
	: ToType_Base<TypeString, Mode>

declare const LABEL: unique symbol
type _<Label extends string, T> = { [LABEL]?: Label } & T

type TupleItem = Abi.FunctionItem.Input | Abi.FunctionItem.Output

type ToTypeTuple<
	TypeStrings extends readonly TupleItem[],
	Mode extends "input" | "output",
	R extends readonly any[] = readonly []
> = TypeStrings extends readonly [
	infer Current extends TupleItem,
	...infer Tail extends readonly TupleItem[]
]
	? ToTypeTuple<
			Tail,
			Mode,
			readonly [...R, _<Current["name"], ToType<Current["type"], Mode>>]
	  >
	: R

type ProcessAbi<
	TAbi extends Abi,
	R extends {
		[key: string]: (...args: any[]) => any
	} = {}
> = TAbi extends readonly [
	infer Current extends Abi.Item,
	...infer Tail extends readonly Abi.Item[]
]
	? Current extends { type: "function" }
		? ProcessAbi<
				Tail,
				R & {
					[K in Current["name"]]: (
						...args: ToTypeTuple<Current["inputs"], "input">
					) => Promise<
						Current["outputs"]["length"] extends 0
							? ContractTransaction
							: Current["outputs"]["length"] extends 1
							? ToTypeTuple<Current["outputs"], "output">[0]
							: ToTypeTuple<Current["outputs"], "output">
					>
				}
		  >
		: ProcessAbi<Tail, R>
	: R

export type TypedContract<TAbi extends Abi> = Contract & ProcessAbi<TAbi>
