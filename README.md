# react-chessboard ![CI](https://github.com/ildar-icoosoft/react-chessboard/workflows/CI/badge.svg) ![Storybook](https://github.com/ildar-icoosoft/react-chessboard/workflows/Storybook/badge.svg)

Renders a chess board using React

## Installation

```
npm install --save @ildar-icoosoft/react-chessboard
```

## Demo

- [Storybook](https://ildar-icoosoft.github.io/react-chessboard/)

## Documentation

You can find the React documentation [on the website](https://reactjs.org/docs).

### Example

```jsx
import { Board, PieceCode } from "@ildar-icoosoft/react-chessboard";

ReactDOM.render(
  <Board position={{ e2: PieceCode.WHITE_PAWN, e7: PieceCode.BLACK_PAWN }} />,
  document.getElementById("container")
);
```
