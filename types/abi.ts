export type Abi = readonly Abi.Item[]

/**
 * `Abi` represents the structure of an Ethereum contract's Application Binary Interface (ABI),
 * which defines the functions, events, and errors that can be interacted with in the contract.
 * It is a readonly array of `Abi.Item`, which can represent functions, events, or errors.
 *
 * @example
 * Example ABI structure:
 * ```ts
 * const exampleAbi: Abi = [
 *   {
 *     type: "function",
 *     name: "transfer",
 *     inputs: [
 *       { name: "to", type: "address", internalType: "address" },
 *       { name: "value", type: "uint256", internalType: "uint256" },
 *     ],
 *     outputs: [],
 *     stateMutability: "nonpayable",
 *   },
 *   {
 *     type: "event",
 *     name: "Transfer",
 *     inputs: [
 *       { name: "from", type: "address", internalType: "address", indexed: true },
 *       { name: "to", type: "address", internalType: "address", indexed: true },
 *       { name: "value", type: "uint256", internalType: "uint256", indexed: false },
 *     ],
 *     anonymous: false,
 *   },
 * ];
 * ```
 */
export namespace Abi {
	/**
	 * `Abi.Item` represents a single item in an ABI, which can be either a function, event, or error.
	 */
	export type Item = FunctionItem | EventItem | ErrorItem

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

	/**
	 * `Abi.FunctionItem` defines a function in a contract's ABI, including its name, inputs, outputs,
	 * and state mutability.
	 */
	export namespace FunctionItem {
		export type Input = Argument & {}
		export type Output = Argument & {}

		/**
		 * `Abi.FunctionItem.StateMutability` defines the mutability of a function, which can be:
		 * - `pure`: does not read or modify the blockchain state.
		 * - `view`: reads but does not modify the blockchain state.
		 * - `constant`: synonym for `view` (legacy usage).
		 * - `nonpayable`: does not accept Ether but may modify the state.
		 * - `payable`: accepts Ether and may modify the state.
		 */
		export type StateMutability =
			| "pure"
			| "view"
			| "constant"
			| "nonpayable"
			| "payable"
	}

	export type EventItem = {
		type: "event"
		name: string
		inputs: readonly EventItem.Input[]
		anonymous: boolean
	}

	/**
	 * `Abi.EventItem` defines an event in the contract's ABI, which can be emitted by the contract.
	 * Each event has a name, inputs, and an `anonymous` flag indicating whether the event is anonymous.
	 */
	export namespace EventItem {
		/**
		 * `Abi.EventItem.Input` represents an argument to an event, with an additional `indexed` flag
		 * indicating whether the argument can be used to filter event logs.
		 */
		export type Input = Argument & { indexed: boolean }
	}

	export type ErrorItem = {
		type: "error"
		name: string
		inputs: readonly ErrorItem.Input[]
	}

	/**
	 * `Abi.ErrorItem` defines an error in the contract's ABI, which can be used for custom error handling.
	 */
	export namespace ErrorItem {
		/**
		 * `Abi.ErrorItem.Input` represents an argument to an error.
		 */
		export type Input = Argument & {}
	}

	/**
	 * `Abi.Argument` represents a single argument in a function, event, or error.
	 * It includes the argument's `type`, `name`, and `internalType` used by Solidity.
	 */
	type Argument = {
		type: string
		name: string
		internalType: string
	}
}
