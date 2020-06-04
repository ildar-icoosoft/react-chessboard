import React from "react";
import { Board } from "../src/components/Board";
import { startPosition } from "../src/constants/constants";
import { PieceDropEvent } from "../src/interfaces/PieceDropEvent";
import { PieceDragStartEvent } from "../src/interfaces/PieceDragStartEvent";
import { PieceColor } from "../src/enums/PieceColor";

export default {
  title: "Board",
};

export const SimpleBoard = () => <Board position={{}} />;

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
