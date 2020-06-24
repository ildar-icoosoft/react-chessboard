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
      allowMoveFrom,
      check,
      turnColor,
      position,
      draggable,
      onDragStart,
      onDrop,
      onResize,
      onMove,
      destinationSquares,
      occupationSquares,
      lastMoveSquares,
      validMoves,
      width,
    }) => (
      <Board
        clickable={true}
        allowMoveFrom={allowMoveFrom}
        allowMarkers={true}
        check={check}
        turnColor={turnColor}
        position={position}
        draggable={draggable}
        onDragStart={onDragStart}
        onDrop={onDrop}
        onResize={onResize}
        onMove={onMove}
        transitionDuration={10000}
        validMoves={validMoves}
        destinationSquares={destinationSquares}
        occupationSquares={occupationSquares}
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
