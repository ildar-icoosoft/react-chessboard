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
      onResize,
      selectionSquares,
      lastMoveSquares,
      width,
    }) => (
      <Board
        allowMarkers={true}
        position={position}
        draggable={draggable}
        onDragStart={onDragStart}
        onDrop={onDrop}
        onSquareClick={onSquareClick}
        onResize={onResize}
        transitionDuration={10000}
        selectionSquares={selectionSquares}
        lastMoveSquares={lastMoveSquares}
        width={width}
      />
    )}
  </MoveWithoutValidation>
);

SimpleMoveStory.story = {
  parameters: {
    jest: ["MoveWithoutValidation"],
  },
};
