import { Action } from "redux-actions";
import { ChessInstance } from "chess.js";
import { Position } from "../../interfaces/Position";
import { Move } from "../../interfaces/Move";
import { convertFenToPositionObject, getValidMoves } from "../../utils/chess";
import { ValidMoves } from "../../types/ValidMoves";

export enum WithMoveValidationAction {
  SET_GAME = "SET_GAME",
  RESIZE = "RESIZE",
  CHANGE_POSITION = "CHANGE_POSITION",
  SHOW_PROMOTION_CHOICE = "SHOW_PROMOTION_CHOICE",
  HIDE_PROMOTION_CHOICE = "HIDE_PROMOTION_CHOICE",
}

export interface WithMoveValidationState {
  game: ChessInstance | null;
  validMoves: ValidMoves;
  position: Position;
  lastMoveSquares: string[];
  width: number;
  showPromotionChoice: boolean;
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
    lastMoveSquares: [],
    validMoves: {},
    showPromotionChoice: false,
  };
};

const setGame = (
  state: WithMoveValidationState,
  { payload }: Action<ChessInstance>
): WithMoveValidationState => {
  return {
    ...state,
    game: payload,
    validMoves: getValidMoves(payload),
  };
};

const changePosition = (
  state: WithMoveValidationState,
  { payload }: Action<ChangePositionData>
): WithMoveValidationState => {
  return {
    ...state,
    validMoves: getValidMoves(state.game as ChessInstance),
    position: payload.position,
    lastMoveSquares: [payload.lastMove.from, payload.lastMove.to],
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

const showPromotionChoice = (
  state: WithMoveValidationState
): WithMoveValidationState => {
  return {
    ...state,
    showPromotionChoice: true,
  };
};

const hidePromotionChoice = (
  state: WithMoveValidationState
): WithMoveValidationState => {
  return {
    ...state,
    showPromotionChoice: false,
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
  [WithMoveValidationAction.RESIZE]: resize,
  [WithMoveValidationAction.CHANGE_POSITION]: changePosition,
  [WithMoveValidationAction.SHOW_PROMOTION_CHOICE]: showPromotionChoice,
  [WithMoveValidationAction.HIDE_PROMOTION_CHOICE]: hidePromotionChoice,
};

export const withMoveValidationReducer = (
  state: WithMoveValidationState,
  action: Action<any>
) => {
  return reducersMap[action.type](state, action);
};
