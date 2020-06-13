import React from "react";
import { Board } from "../src/components/Board";
import { startPosition } from "../src/constants/constants";
import { PieceDragStartEvent } from "../src/interfaces/PieceDragStartEvent";
import { PieceColor } from "../src/enums/PieceColor";
import { PieceCode } from "../src/enums/PieceCode";
import { PieceDropEvent } from "PieceDropEvent.ts";

export default {
  title: "Board",
};

export const SimpleBoard = () => <Board position={startPosition} />;

SimpleBoard.story = {
  parameters: {
    jest: ["Board"],
  },
};

export const FlippedBoard = () => (
  <Board position={startPosition} orientation={PieceColor.BLACK} />
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

  const onSquareRightClick = (coordinates: string) => {
    console.log("onSquareRightClick", coordinates);
  };

  const onDragStart = (event: PieceDragStartEvent) => {
    console.log("onDragStart", event);
  };

  const onDragEnterSquare = (coordinates: string) => {
    console.log("onDragEnterSquare", coordinates);
  };

  const onDrop = (event: PieceDropEvent) => {
    console.log("onDrop", event);
  };

  const onMouseEnterSquare = (coordinates: string) => {
    console.log("onMouseOverSquare", coordinates);
  };

  const onMouseLeaveSquare = (coordinates: string) => {
    console.log("onMouseOutSquare", coordinates);
  };

  return (
    <Board
      position={startPosition}
      draggable={true}
      onSquareClick={onSquareClick}
      onSquareRightClick={onSquareRightClick}
      onDragStart={onDragStart}
      onDragEnterSquare={onDragEnterSquare}
      onDrop={onDrop}
      onMouseEnterSquare={onMouseEnterSquare}
      onMouseLeaveSquare={onMouseLeaveSquare}
    />
  );
};

BoardWithEventHandlers.story = {
  parameters: {
    jest: ["Board"],
  },
};

export const SmallBoard = () => (
  <Board position={startPosition} draggable={true} width={240} />
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
      e8: PieceCode.BLACK_KING,
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
    occupationSquares={["g7", "d7"]}
    currentPremoveSquares={["e4", "e5"]}
  />
);

BoardWithHighlightedSquares.story = {
  parameters: {
    jest: ["Board"],
  },
};
