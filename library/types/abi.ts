export type Abi = readonly Abi.Item[]
export namespace Abi {
	export type Item = FunctionItem | EventItem | ErrorItem

	type Argument = {
		type: string
		name: string
		internalType: string
	}

	export type FunctionItem = {
		type: "function"
		name: string
		inputs: readonly FunctionItem.Input[]
		outputs: readonly FunctionItem.Output[]
		stateMutability: FunctionItem.StateMutability
	} | {
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
		type: "event"
		name: string
		inputs: readonly EventItem.Input[]
		anonymous: boolean
	}
	export namespace EventItem {
		export type Type = EventItem["type"]
		export type Input = Argument & { indexed: boolean }
	}

	export type ErrorItem = {
		type: "error"
		name: string
		inputs: readonly ErrorItem.Input[]
	}
	export namespace ErrorItem {
		export type Type = ErrorItem["type"]
		export type Input = Argument & {}
	}
}
