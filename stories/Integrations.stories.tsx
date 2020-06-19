import React from "react";
import { Board } from "../src";
import { WithMoveValidation } from "../src/components/integrations/WithMoveValidation";
import { INITIAL_BOARD_FEN } from "../src/constants/constants";

export default {
  title: "Integrations",
};

export const WithMoveValidationStory = () => (
  <WithMoveValidation initialFen={INITIAL_BOARD_FEN}>
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
