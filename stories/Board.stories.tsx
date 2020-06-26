import React from "react";
import { Board } from "../src";
import { INITIAL_BOARD_POSITION } from "../src/constants/constants";
import { PieceColor } from "../src/enums/PieceColor";

export default {
  title: "Board",
};

export const SimpleBoard = () => <Board position={INITIAL_BOARD_POSITION} />;

SimpleBoard.story = {
  parameters: {
    jest: ["Board"],
  },
};

export const FlippedBoard = () => (
  <Board position={INITIAL_BOARD_POSITION} orientation={PieceColor.BLACK} />
);

FlippedBoard.story = {
  parameters: {
    jest: ["Board"],
  },
};

export const SmallBoard = () => (
  <Board position={INITIAL_BOARD_POSITION} draggable={true} width={240} />
);

SmallBoard.story = {
  parameters: {
    jest: ["Board"],
  },
};
