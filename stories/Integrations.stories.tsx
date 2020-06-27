import React from "react";
import { Board } from "../src";
import { WithMoveValidation } from "../src/components/integrations/WithMoveValidation";
import { INITIAL_BOARD_FEN } from "../src/constants/constants";

export default {
  title: "Integrations",
};

export const PlayerVsPlayer = () => (
  <WithMoveValidation initialFen={INITIAL_BOARD_FEN}>
    {({
      clickable,
      allowMarkers,
      movableColor,
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
        clickable={clickable}
        allowMarkers={allowMarkers}
        movableColor={movableColor}
        check={check}
        turnColor={turnColor}
        position={position}
        draggable={draggable}
        onResize={onResize}
        onMove={onMove}
        transitionDuration={300}
        validMoves={validMoves}
        viewOnly={viewOnly}
        lastMoveSquares={lastMoveSquares}
        width={width}
      />
    )}
  </WithMoveValidation>
);

PlayerVsPlayer.story = {
  parameters: {
    jest: ["WithMoveValidation"],
  },
};

const prePromotionFen: string =
  "rnbqkbn1/pppppppP/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const PlayerVsComputer = () => (
  <WithMoveValidation initialFen={prePromotionFen} playerVsCompMode={true}>
    {({
      clickable,
      allowMarkers,
      movableColor,
      check,
      turnColor,
      position,
      draggable,
      onResize,
      onMove,
      onSetPremove,
      onUnsetPremove,
      lastMoveSquares,
      validMoves,
      viewOnly,
      width,
    }) => (
      <Board
        clickable={clickable}
        allowMarkers={allowMarkers}
        movableColor={movableColor}
        check={check}
        turnColor={turnColor}
        position={position}
        draggable={draggable}
        onResize={onResize}
        onMove={onMove}
        onSetPremove={onSetPremove}
        onUnsetPremove={onUnsetPremove}
        transitionDuration={300}
        validMoves={validMoves}
        viewOnly={viewOnly}
        lastMoveSquares={lastMoveSquares}
        width={width}
        premovable={true}
      />
    )}
  </WithMoveValidation>
);

PlayerVsComputer.story = {
  parameters: {
    jest: ["WithMoveValidation"],
  },
};
