import { Abi } from "./abi"

declare const LABEL: unique symbol
type _<Label extends string, T> = { [LABEL]?: Label } & T

type TupleItem = Abi.FunctionItem.Input | Abi.FunctionItem.Output

export type PrimativeTypeMapBase = Record<string, { input: unknown; output: unknown }>

export type ToTypeTuple<
	TMap extends PrimativeTypeMapBase,
	TypeStrings extends readonly TupleItem[],
	Mode extends "input" | "output",
	R extends readonly any[] = readonly [],
> =
	TypeStrings extends readonly [infer Current extends TupleItem, ...infer Tail extends readonly TupleItem[]] ?
		ToTypeTuple<TMap, Tail, Mode, readonly [...R, _<Current["name"], ToType<TMap, Current["type"], Mode>>]>
	:	R

export type ToType<TMap extends PrimativeTypeMapBase, T extends string, Mode extends "input" | "output"> =
	T extends keyof TMap ? TMap[T][Mode]
	: T extends `${infer T}[]` ? ToType<TMap, T, Mode>[]
	: never
