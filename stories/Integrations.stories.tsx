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
      check,
      turnColor,
      position,
      draggable,
      onResize,
      onMove,
      lastMoveSquares,
      validMoves,
      viewOnly,
      width,
    }) => (
      <Board
        clickable={true}
        allowMarkers={true}
        check={check}
        turnColor={turnColor}
        position={position}
        draggable={draggable}
        onResize={onResize}
        onMove={onMove}
        transitionDuration={10000}
        validMoves={validMoves}
        viewOnly={viewOnly}
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
