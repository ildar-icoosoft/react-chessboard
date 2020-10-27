import React from "react";
import { Board } from "../src";
import { INITIAL_BOARD_POSITION } from "../src/constants/constants";

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
  <Board position={INITIAL_BOARD_POSITION} orientation="black" />
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
