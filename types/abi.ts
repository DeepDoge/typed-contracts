export type Abi = readonly Abi.Item[]
export namespace Abi {
	export type Item = FunctionItem | EventItem

	type Argument = {
		type: string
		name: string
		internalType: string
	}

	export type FunctionItem =
		| {
				type: "function"
				name: string
				inputs: readonly FunctionItem.Input[]
				outputs: readonly FunctionItem.Output[]
				stateMutability: FunctionItem.StateMutability
		  }
		| {
				type: "constructor"
				inputs: readonly FunctionItem.Input[]
				stateMutability: "nonpayable"
		  }
	export namespace FunctionItem {
		export type Type = FunctionItem["type"]
		export type Input = Argument & {}
		export type Output = Argument & {}
		export type StateMutability = "pure" | "view" | "constant" | "nonpayable" | "payable"
	}

	export type EventItem = {
		type: EventItem.Type
		name: string
		inputs: readonly EventItem.Input[]
		anonymous: boolean
	}
	export namespace EventItem {
		export type Type = "event"
		export type Input = Argument & { indexed: boolean }
	}
}
