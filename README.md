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
It's compatible with touch as well as standard HTML5 drag and drop.

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

```
npm install ii-react-chessboard
```

### Example

```JSX
import { Board } from "ii-react-chessboard";

function App() {
  return (
    <Board position="startpos" />
  );
}
```

The code above will render chessboard with starting position:

<img src="./src/images/screenshot3.png" alt="Chessboard with starting position" width="256">

For more examples please visit our [Storybook](https://ildar-icoosoft.github.io/react-chessboard/) page

## API

### Board

| Name | Type | Default | Description |
| --- | --- | --- | ---|
| position | Position | {} | The position to display on the board. It might be "startpos" string or Position object |
| orientation | PieceColor| "white" | Orientation of the board |
| draggable | boolean| false | If false, the pieces will not be draggable |
| width | number | 480 | The width in pixels |
| allowDrag | (pieceCode: PieceCode, coordinates: string) => boolean | undefined | A function to call when a piece drag is initiated. Returns true if the piece is draggable, false if not |
| showNotation | boolean | true | If false, notation will not be shown on the board |
| squareCssClasses | SquareCssClasses |  | An object containing CSS classes for squares. For example {'e4': "highlight", 'd4': "red"} |
| transitionDuration | number | 300 | The time it takes for a piece to slide to the target square |
| dragStartCssClass | string[] \| string|  | The class for the square which has a dragged piece |
| dragEnterSquareCssClass| string[] \| string|  | The class for the square which a piece is dragged over |
| onSquareClick | (coordinates: string) => void |  | A function to call when a square is clicked |
| onSquareRightClick| (coordinates: string) => void |  | A function to call when a square is right clicked |
| onDragStart | (event: PieceDragStartEvent) => void |  | A function to call when a piece is started to drag |
| onDragEnterSquare | (coordinates: string) => void |  | A function to call when a piece is dragged over a specific square |
| onDrop | (event: BoardDropEvent) => void |  | The logic to be performed on piece drop |
| onMouseEnterSquare | (coordinates: string) => void |  | A function to call when the mouse is enter a square |
| onMouseLeaveSquare | (coordinates: string) => void |  | A function to call when the mouse has left the square |

