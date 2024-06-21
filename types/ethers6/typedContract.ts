import type { BytesLike, Contract, ContractTransaction, Overrides } from "ethers"
import type { Booleans, Call, ComposeLeft, Fn, Match, Objects, Pipe, Tuples, _ } from "hotscript"
import type { Abi } from "../abi"

export type TypedContract<TAbi extends Abi> = Contract &
	Pipe<TAbi, [Tuples.Filter<Booleans.Extends<{ type: "function" }>>, Tuples.Map<ToFunction>, Tuples.ToUnion, Objects.FromEntries]>

type PromiseOrValue<T> = T | Promise<T>

interface ToPromise extends Fn {
	return: Promise<this["arg0"]>
}

interface ToType extends Fn {
	$type: this["arg0"]
	return: this['$type'] extends `${infer T}[]` ? Call<ToType, T>[] : Call<ToPrimitiveType, this['$type']>
}

interface ToPrimitiveType extends Fn {
	$type: this["arg0"]
	return: Pipe<
		this["$type"],
		[
			Match<
				[
					Match.With<`${"u" | ""}int${number | ""}` | `${"u" | ""}fixed`, bigint>,
					Match.With<`bytes${number | ""}`, PromiseOrValue<BytesLike>>,
					Match.With<"string", string>,
					Match.With<"bool", boolean>,
					Match.With<"address", string>,
					Match.With<_, unknown>
				]
			>
		]
	>
}

interface ToFunction extends Fn {
	$name: this["arg0"]["name"]
	$inputs: this["arg0"]["inputs"]
	$outputs: this["arg0"]["outputs"]

	$inputsAsArgs: Pipe<this["$inputs"], [Tuples.Map<ComposeLeft<[Objects.Get<"type">, ToType]>>]>
	$outputsAsTuple: Pipe<this["$outputs"], [Tuples.Map<ComposeLeft<[Objects.Get<"type">, ToType]>>]>

	return: [
		this["$name"],
		(
			...args: Pipe<[overrides?: Overrides], [Tuples.Concat<this["$inputsAsArgs"]>]>
		) => Pipe<
			this["$outputsAsTuple"]["length"],
			[
				Match<
					[
						Match.With<0, ContractTransaction>,
						Match.With<1, Pipe<this["$outputsAsTuple"], [Tuples.Head]>>,
						Match.With<_, this["$outputsAsTuple"]>
					]
				>,
				ToPromise
			]
		>
	]
}
