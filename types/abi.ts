/**
 * @module
 *
 * This module defines the structure of an EVM contract's Application Binary Interface (ABI),
 * which describes the functions, events, and errors that can be interacted with in the contract.
 * It provides type definitions and ensures type safety when working with contract interactions.
 */

export type Abi = readonly Abi.Item[]

/**
 * This type represents the structure of an EVM contract's Application Binary Interface (ABI),
 * which defines the functions, events, and errors that can be interacted with in the contract.
 * It is a readonly array of items, which can represent functions, events, or errors.
 *
 * @example
 * Example ABI structure:
 * ```ts
 * const exampleAbi = [
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
 * ] as const satisfies Abi;
 * ```
 */
export namespace Abi {
	/**
	 * This type represents a single item in an ABI, which can be either a function, event, or error.
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
	 * This type defines a function in a contract's ABI, including its name, inputs, outputs,
	 * and state mutability.
	 */
	export namespace FunctionItem {
		/**
		 * This type represents an argument passed to a function in the contract's ABI.
		 * It includes the argument's type, name, and internal type used by Solidity.
		 */
		export type Input = Argument & {}

		/**
		 * This type represents a return value from a function in the contract's ABI.
		 * It includes the output's type, name, and internal type used by Solidity.
		 */
		export type Output = Argument & {}

		/**
		 * This type defines the mutability of a function, which can be:
		 * - `pure`: does not read or modify the blockchain state.
		 * - `view`: reads but does not modify the blockchain state.
		 * - `constant`: synonym for `view` (legacy usage).
		 * - `nonpayable`: does not accept Ether but may modify the state.
		 * - `payable`: accepts Ether and may modify the state.
		 */
		export type StateMutability = "pure" | "view" | "constant" | "nonpayable" | "payable"
	}

	export type EventItem = {
		type: "event"
		name: string
		inputs: readonly EventItem.Input[]
		anonymous: boolean
	}

	/**
	 * This type defines an event in the contract's ABI, which can be emitted by the contract.
	 * Each event has a name, inputs, and an `anonymous` flag indicating whether the event is anonymous.
	 */
	export namespace EventItem {
		/**
		 * This type represents an argument to an event, with an additional `indexed` flag
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
	 * This type defines an error in the contract's ABI, which can be used for custom error handling.
	 */
	export namespace ErrorItem {
		/**
		 * This type represents an argument to an error.
		 */
		export type Input = Argument & {}
	}

	/**
	 * This type represents a single argument in a function, event, or error.
	 * It includes the argument's `type`, `name`, and `internalType` used by Solidity.
	 */
	export type Argument = {
		type: string
		name: string
		internalType: string
	}
}
