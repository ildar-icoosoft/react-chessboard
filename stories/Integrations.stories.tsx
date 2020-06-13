import React from "react";
import { Board } from "../src";
import { MoveWithoutValidation } from "../src/components/integrations/MoveWithoutValidation";
import { startPosition } from "../src/constants/constants";

export default {
  title: "Integrations",
};

export const SimpleMoveStory = () => (
  <MoveWithoutValidation initialPosition={startPosition}>
    {({
      position,
      draggable,
      onDragStart,
      onDrop,
      onSquareClick,
      selectionSquares,
      lastMoveSquares,
    }) => (
      <Board
        allowMarkers={true}
        position={position}
        draggable={draggable}
        onDragStart={onDragStart}
        onDrop={onDrop}
        onSquareClick={onSquareClick}
        transitionDuration={10000}
        selectionSquares={selectionSquares}
        lastMoveSquares={lastMoveSquares}
      />
    )}
  </MoveWithoutValidation>
);

SimpleMoveStory.story = {
  parameters: {
    jest: ["MoveWithoutValidation"],
  },
};
