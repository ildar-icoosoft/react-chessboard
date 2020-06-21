import { Action } from "redux-actions";
import { ChessInstance } from "chess.js";
import { Position } from "../../interfaces/Position";
import { Move } from "../../interfaces/Move";
import { PieceCode } from "../../enums/PieceCode";
import { omit as _omit } from "lodash";
import { convertFenToPositionObject } from "../../utils/chess";

export enum WithMoveValidationAction {
  SET_GAME = "SET_GAME",
  MOVE = "MOVE",
  SELECT_SQUARE = "SELECT_SQUARE",
  CLEAR_SELECTION = "CLEAR_SELECTION",
}

export interface WithMoveValidationState {
  game: ChessInstance | null;
  position: Position;
  selectionSquares: string[];
  destinationSquares: string[];
  lastMoveSquares: string[];
}

export interface SelectedSquareData {
  selectionSquare: string;
  destinationSquares: string[];
}

export const getWithMoveValidationInitialState = (
  initialFen: string
): WithMoveValidationState => {
  return {
    game: null,
    position: convertFenToPositionObject(initialFen),
    selectionSquares: [],
    destinationSquares: [],
    lastMoveSquares: [],
  };
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

const move = (
  state: WithMoveValidationState,
  { payload }: Action<Move>
): WithMoveValidationState => {
  const pieceCode: PieceCode = state.position[payload.from];

  const newPosition: Position = _omit(state.position, [payload.from]);

  newPosition[payload.to] = payload.promotion ? payload.promotion : pieceCode;

  return {
    ...state,
    position: newPosition,
    selectionSquares: [],
    destinationSquares: [],
    lastMoveSquares: [payload.from, payload.to],
  };
};

const selectSquare = (
  state: WithMoveValidationState,
  { payload }: Action<SelectedSquareData>
): WithMoveValidationState => {
  return {
    ...state,
    selectionSquares: [payload.selectionSquare],
    destinationSquares: payload.destinationSquares,
  };
};

const clearSelection = (
  state: WithMoveValidationState
): WithMoveValidationState => {
  return {
    ...state,
    selectionSquares: [],
    destinationSquares: [],
  };
};

const reducersMap: Record<
  string,
  (
    state: WithMoveValidationState,
    action: Action<any>
  ) => WithMoveValidationState
> = {
  [WithMoveValidationAction.SET_GAME]: setGame,
  [WithMoveValidationAction.MOVE]: move,
  [WithMoveValidationAction.SELECT_SQUARE]: selectSquare,
  [WithMoveValidationAction.CLEAR_SELECTION]: clearSelection,
};

export const withMoveValidationReducer = (
  state: WithMoveValidationState,
  action: Action<any>
) => {
  return reducersMap[action.type](state, action);
};
