import React from "react";
import { Board } from "../src";
import { INITIAL_BOARD_POSITION } from "../src/constants/constants";
import { PieceDragStartEvent } from "../src/interfaces/PieceDragStartEvent";
import { PieceColor } from "../src/enums/PieceColor";
import { PieceCode } from "../src/enums/PieceCode";
import { PieceDropEvent } from "../src/interfaces/PieceDropEvent";

export default {
  title: "Board",
};

export const SimpleBoard = () => <Board position={INITIAL_BOARD_POSITION} />;

SimpleBoard.story = {
  parameters: {
    jest: ["Board"],
  },
};

export const FlippedBoard = () => (
  <Board position={INITIAL_BOARD_POSITION} orientation={PieceColor.BLACK} />
);

FlippedBoard.story = {
  parameters: {
    jest: ["Board"],
  },
};

export const BoardWithEventHandlers = () => {
  const onSquareClick = (coordinates: string) => {
    console.log("onSquareClick", coordinates);
  };

  const onDragStart = (event: PieceDragStartEvent) => {
    console.log("onDragStart", event);
  };

  const onDrop = (event: PieceDropEvent) => {
    console.log("onDrop", event);
  };

  return (
    <Board
      position={INITIAL_BOARD_POSITION}
      draggable={true}
      onSquareClick={onSquareClick}
      onDragStart={onDragStart}
      onDrop={onDrop}
    />
  );
};

BoardWithEventHandlers.story = {
  parameters: {
    jest: ["Board"],
  },
};

export const SmallBoard = () => (
  <Board position={INITIAL_BOARD_POSITION} draggable={true} width={240} />
);

SmallBoard.story = {
  parameters: {
    jest: ["Board"],
  },
};

export const BoardWithHighlightedSquares = () => (
  <Board
    position={{
      e1: PieceCode.WHITE_KING,
      g4: PieceCode.WHITE_QUEEN,
      c3: PieceCode.WHITE_KNIGHT,
      e4: PieceCode.WHITE_PAWN,
      d7: PieceCode.BLACK_PAWN,
      g7: PieceCode.BLACK_PAWN,
      h5: PieceCode.BLACK_KING,
    }}
    draggable={true}
    selectionSquares={["g4"]}
    destinationSquares={[
      "f4",
      "h4",
      "f5",
      "e6",
      "d7",
      "g5",
      "g6",
      "g7",
      "h5",
      "g3",
      "g2",
      "g1",
      "h3",
      "f3",
      "e2",
      "d1",
    ]}
    lastMoveSquares={["b1", "c3"]}
    occupationSquares={["g7", "d7", "h5"]}
    currentPremoveSquares={["e4", "e5"]}
    checkSquares={["h5"]}
  />
);

BoardWithHighlightedSquares.story = {
  parameters: {
    jest: ["Board"],
  },
};
