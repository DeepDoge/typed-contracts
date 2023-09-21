# Typify Contracts

Compile your Solidity code, and generate types for it, with the minimal file generation needed.

## Install

[Install Instructions](https://github.com/DeepDoge/typify-contracts/releases)

## Usage (Node)

Let's first install per dependencies:
```bash
npm i -D tsx ethers solc
```


Then just run the thing:
```bash
typify-contracts --src ./path/to/contracts/dir
```
or:
```bash
npx typify-contracts --src ./path/to/contracts/dir
```

## Usage (Bun)

Current `bun` workaround.

Let's first install per dependencies:
```bash
bun add -d ethers solc
```


Then just run the thing:
```bash
bun ./node_modules/typify-contracts/library/cli.ts --src ./path/to/contracts/dir
```
