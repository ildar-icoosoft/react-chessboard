<h1 align="center">react-chessboard</h1>

<p align="center">
    Renders a chess board using React
</p>

<p align="center">

![CI](https://github.com/ildar-icoosoft/react-chessboard/workflows/CI/badge.svg)
![Storybook](https://github.com/ildar-icoosoft/react-chessboard/workflows/Storybook/badge.svg)
![Semantic Release](https://github.com/ildar-icoosoft/react-chessboard/workflows/Semantic%20Release/badge.svg)
[![codecov](https://codecov.io/gh/ildar-icoosoft/react-chessboard/branch/develop/graph/badge.svg?token=9BKCLGTTFV)](https://codecov.io/gh/ildar-icoosoft/react-chessboard)
![npm](https://img.shields.io/npm/v/ii-react-chessboard)

</p>


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
