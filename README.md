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

<div align="center" markdown="1">

<img src="./src/images/screenshot1.png" alt="Big board" width="500">
<img src="./src/images/screenshot2.png" alt="Small board" width="261">

</div>

## Installation

```
npm install --save @ildar-icoosoft/react-chessboard
```

## Demo

- [Storybook](https://ildar-icoosoft.github.io/react-chessboard/)

## Documentation

Check out our [WIKI](https://github.com/ildar-icoosoft/react-chessboard/wiki/API)

### Example

```jsx
import { Board, PieceCode } from "ii-react-chessboard";

ReactDOM.render(
  <Board position={{ e2: PieceCode.WHITE_PAWN, e7: PieceCode.BLACK_PAWN }} />,
  document.getElementById("container")
);
```
