# Typescript Minesweeper

This project implements a simple minesweeper game implemented using Typescript, React, and Redux. The purpose is to learn about how those three things fit together, as opposed to providing any sort of entertainment value.

## Getting the code

```shell
git clone https://github.com/james-howard/tssweeper
cd tssweeper
npm install # install dependencies
```

## Building the project

```shell
npm run build
```

The built product will be available in the `build` directory with index.html as the entry point. You should be able to just double click it, no web server needed.

## Running the debug server

```shell
npm run start
```

A debug web server will start running on localhost:3000 and your default browser will open to that address. Any code changes will be reflected live.

## Running the tests

```shell
npm test
```

## Architectural Notes

The core game logic is implemented in `Game.ts`. This models the state of the board as well as providing methods to mutate the board according to player actions.

A redux interface to the game logic is provided in `Store.ts`. To the extent possible within the redux API, type safety of actions is preserved via dedicated `GameEvent` subclasses which are used to dispatch all redux actions. Additionally, some metadata about the game (start time, duration until win or loss) is also maintained in the redux store.

All UI components are contained within the `UI/` directory. Each square on the minesweeper board is described by a `CellUI` component, a `BoardUI` component contains those cells in a grid layout, which is in turn contained within a `GameUI` component along with a `StatusUI` for showing the game state and a `BoardSizeUI` for choosing the game size / difficulty.
