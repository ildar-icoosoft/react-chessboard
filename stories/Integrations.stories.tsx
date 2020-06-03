import React from "react";
import { Board } from "../src";
import { MoveWithoutValidation } from "../src/components/integrations/MoveWithoutValidation";
import { startPosition } from "../src/constants/constants";

export default {
  title: "Integrations",
};

export const SimpleMoveStory = () => (
  <MoveWithoutValidation initialPosition={startPosition}>
    {({ position, draggable, onDrop, onSquareClick, squareCssClasses }) => (
      <Board
        position={position}
        draggable={draggable}
        onDrop={onDrop}
        onSquareClick={onSquareClick}
        transitionDuration={300}
        squareCssClasses={squareCssClasses}
      />
    )}
  </MoveWithoutValidation>
);

SimpleMoveStory.story = {
  parameters: {
    jest: ["MoveWithoutValidation"],
  },
};
