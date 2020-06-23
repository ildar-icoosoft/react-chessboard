import { Action } from "redux-actions";
import { ChessInstance } from "chess.js";
import { Position } from "../../interfaces/Position";
import { Move } from "../../interfaces/Move";
import { convertFenToPositionObject } from "../../utils/chess";

export enum WithMoveValidationAction {
  SET_GAME = "SET_GAME",
  SELECT_SQUARE = "SELECT_SQUARE",
  CLEAR_SELECTION = "CLEAR_SELECTION",
  RESIZE = "RESIZE",
  CHANGE_POSITION = "CHANGE_POSITION",
}

export interface WithMoveValidationState {
  game: ChessInstance | null;
  position: Position;
  selectionSquares: string[];
  occupationSquares: string[];
  destinationSquares: string[];
  lastMoveSquares: string[];
  width: number;
}

export interface SelectedSquareData {
  selectionSquare: string;
  destinationSquares: string[];
}

export interface ChangePositionData {
  lastMove: Move;
  position: Position;
}

export const getWithMoveValidationInitialState = (
  initialFen: string,
  width: number
): WithMoveValidationState => {
  return {
    game: null,
    width,
    position: convertFenToPositionObject(initialFen),
    selectionSquares: [],
    occupationSquares: [],
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

const changePosition = (
  state: WithMoveValidationState,
  { payload }: Action<ChangePositionData>
): WithMoveValidationState => {
  return {
    ...state,
    position: payload.position,
    selectionSquares: [],
    destinationSquares: [],
    occupationSquares: [],
    lastMoveSquares: [payload.lastMove.from, payload.lastMove.to],
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
    occupationSquares: payload.destinationSquares.filter(
      (item) => state.position[item]
    ),
  };
};

const clearSelection = (
  state: WithMoveValidationState
): WithMoveValidationState => {
  return {
    ...state,
    selectionSquares: [],
    destinationSquares: [],
    occupationSquares: [],
  };
};

const resize = (
  state: WithMoveValidationState,
  { payload }: Action<number>
): WithMoveValidationState => {
  return {
    ...state,
    width: payload,
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
  [WithMoveValidationAction.SELECT_SQUARE]: selectSquare,
  [WithMoveValidationAction.CLEAR_SELECTION]: clearSelection,
  [WithMoveValidationAction.RESIZE]: resize,
  [WithMoveValidationAction.CHANGE_POSITION]: changePosition,
};

export const withMoveValidationReducer = (
  state: WithMoveValidationState,
  action: Action<any>
) => {
  return reducersMap[action.type](state, action);
};
