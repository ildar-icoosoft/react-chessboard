<h1 align="center">react-chessboard</h1>

<div align="center">

Renders a chess board using React

![CI](https://github.com/ildar-icoosoft/react-chessboard/workflows/CI/badge.svg)
![Storybook](https://github.com/ildar-icoosoft/react-chessboard/workflows/Storybook/badge.svg)
[![codecov][codecov-image]][codecov-url]

[codecov-image]: https://img.shields.io/codecov/c/github/ildar-icoosoft/react-chessboard/develop.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/ildar-icoosoft/react-chessboard/branch/develop

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