<h1 align="center">ii-react-chessboard</h1>

<h3 align="center">

Customizable React chessboard component

</h3>

<p align="center">
    <img alt="CI" src="https://github.com/ildar-icoosoft/react-chessboard/workflows/CI/badge.svg">
    <a href="https://ildar-icoosoft.github.io/react-chessboard/">
        <img src="https://github.com/ildar-icoosoft/react-chessboard/workflows/Storybook/badge.svg" alt="Storybook">
    </a>
    <a href="https://codecov.io/gh/ildar-icoosoft/react-chessboard">
        <img alt="codecov" src="https://codecov.io/gh/ildar-icoosoft/react-chessboard/branch/master/graph/badge.svg?token=9BKCLGTTFV">
    </a>
    <a href="https://github.com/semantic-release/semantic-release">
        <img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg">
    </a>
    <a href="https://www.npmjs.com/package/ii-react-chessboard">
        <img alt="semantic-release" src="https://img.shields.io/npm/v/ii-react-chessboard">
    </a>
</p>

ii-react-chessboard is a React component with a flexible "just a board" API. 
It's compatible with touch as well as standard HTML5 drag and drop. [Live Demo](https://ildar-icoosoft.github.io/react-chessboard/)

<div align="center">

<img src="./src/images/screenshot1.png" alt="Big board" width="500">
<img src="./src/images/screenshot2.png" alt="Small board" width="261">

</div>

- Usage
  - [Installation](#installation)
  - [Example](#example)
- API
  - [useCombinedRefs](#usecombinedrefs)
  - [usePrevious](#useprevious)
  - [usePreviousDifferent](#usepreviousdifferent)
  - [useShallowEqualSelector](#useshallowequalselector)
  - [useDeepEqualSelector](#usedeepequalselector)

## Usage

### Installation

```bash
npm install ii-react-chessboard # or yarn add ii-react-chessboard
```

### Example

```JSX
import { Board } from "ii-react-chessboard";

function App() {
  return (
    <Board position="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" />
  );
}
```

The code above will render chessboard with starting position:

<img src="./src/images/screenshot3.png" alt="Chessboard with starting position" width="256">

For more examples please visit our [Storybook](https://ildar-icoosoft.github.io/react-chessboard/) page

## API

### Board

```javascript
import { Board } from "ii-react-chessboard";
```

| Name | Type | Default | Description |
| --- | --- | --- | ---|
| allowMarkers | boolean | false | allow round markers with right click |
| check | boolean|false| true if current position contains check |
| clickable | boolean | false | allow click-click moves |
| draggable | boolean | false | allow moves & premoves to use drag'n drop |
| lastMoveSquares | string[] | [] | squares part of the last move ["c3", "c4"] |
| turnColor | "white" \| "black" | "white" | turn to play |
| maxWidth | number | Infinity | Max width in pixels |
| minWidth | number | 160 | Min width in pixels |
| movableColor | "white" \| "black" \| "both" | "both" | color that can move |
| onMove | (move: [Move])(#move) => void | | called after move |
| onResize | (width: number) => void| | | called after resize |
| onSetPremove | (move: Move, playPremove: () => void, cancelPremove: () => void): void | | called after the premove has been set |
| onUnsetPremove | () => void | | called after the premove has been unset |
| orientation | "white" \| "black" | "white" | board orientation |
| position | [Position](#positionobject) \| string | {} | FEN string or Position object |
| premovable | boolean | false | allow premoves for color that can not move |
| resizable | boolean | false | allow resize |
| showCoordinates| boolean | true | include coords attributes |
| transitionDuration | number | 300 | The time in seconds it takes for a piece to slide to the target square |
| validMoves | [ValidMoves](#validmoves) | {} | valid moves. {"a2" ["a3" "a4"] "b1" ["a3" "c3"]} |
| viewOnly | boolean | false | don't bind events: the user will never be able to move pieces around |
| width | number | 480 | board width in pixels |

### Position Object

```javascript
import { Position } from "ii-react-chessboard";
```

You can use a JavaScript object to represent a board position.

The object property names must be algebraic squares (ie: e4, b2, c6, etc) and the values must be valid piece codes (ie: wP, bK, wQ, etc).

### FEN String

You can use [Forsyth-Edwards Notation (FEN)](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) to represent a board position.

Note that FEN notation captures more information than ii-react-chessboard requires, like who's move it is and whether or not castling is allowed. This information will be ignored; only the position information is used.

### Move

```javascript
import { Move } from "ii-react-chessboard";
```

Source code:

```typescript
export interface Move {
  /**
   * The location the piece is moving from.
   * Must be in san format, e.g "h8"
   */
  from: string;

  /**
   * The location the piece is moving to.
   * Must be in san format, e.g "a1"
   */
  to: string;
}
```

### ValidMoves

```javascript
import { ValidMoves } from "ii-react-chessboard";
```

Source code:

```typescript
export type ValidMoves = Record<string, string[]>;
```