import { Action, handleActions } from "redux-actions";
import { ChessInstance } from "chess.js";

export enum WithMoveValidationAction {
  SET_GAME = "SET_GAME",
}

export interface WithMoveValidationState {
  game: ChessInstance | null;
  selection: string[];
  destination: string[];
  lastMove: string[];
}

export const withMoveValidationInitialState: WithMoveValidationState = {
  game: null,
  selection: [],
  destination: [],
  lastMove: [],
};

const setGame = (
  state: WithMoveValidationState,
  { payload }: Action<ChessInstance>
): WithMoveValidationState => {
  return {
    ...state,
    game: payload,
  };
};

export const withMoveValidationReducer = handleActions(
  {
    [WithMoveValidationAction.SET_GAME]: setGame,
  },
  withMoveValidationInitialState
);
