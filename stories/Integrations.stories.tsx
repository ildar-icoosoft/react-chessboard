import React from "react";
import { Board } from "../src";
import { startPosition } from "../src/constants/constants";
import { WithMoveValidation } from "../src/components/integrations/WithMoveValidation";

export default {
  title: "Integrations",
};

export const WithMoveValidationStory = () => (
  <WithMoveValidation initialPosition={startPosition}>
    {({
      position,
      draggable,
      onDragStart,
      onDrop,
      onSquareClick,
      onResize,
      selectionSquares,
      destinationSquares,
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
        destinationSquares={destinationSquares}
        lastMoveSquares={lastMoveSquares}
        width={width}
      />
    )}
  </WithMoveValidation>
);

WithMoveValidationStory.story = {
  parameters: {
    jest: ["WithMoveValidation"],
  },
};
