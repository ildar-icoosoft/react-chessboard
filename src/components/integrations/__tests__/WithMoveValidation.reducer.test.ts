import {
  WithMoveValidationAction,
  withMoveValidationReducer,
  WithMoveValidationState,
} from "../WithMoveValidation.reducer";
import { Position } from "../../../interfaces/Position";
import { PieceCode } from "../../../enums/PieceCode";
import { Chess } from "chess.js";

const initialFen: string = "8/4p3/8/5k2/8/3p4/4PP2/4K3 w KQkq - 0 1";
const initialPosition: Position = {
  e2: PieceCode.WHITE_PAWN,
  f2: PieceCode.WHITE_PAWN,
  e1: PieceCode.WHITE_KING,
  f5: PieceCode.BLACK_KING,
  e7: PieceCode.BLACK_PAWN,
  d3: PieceCode.BLACK_PAWN,
};

const defaultState: WithMoveValidationState = {
  game: null,
  validMoves: {},
  width: 480,
  position: initialPosition,
  lastMoveSquares: [],
  showPromotionChoice: false,
};

describe("WithMoveValidation.reducer", () => {
  it("SET_GAME action", () => {
    const game = new Chess(initialFen);

    const state = withMoveValidationReducer(defaultState, {
      type: WithMoveValidationAction.SET_GAME,
      payload: game,
    });

    expect(state).toEqual({
      game,
      validMoves: {
        e1: ["d2", "f1", "d1", "g1", "c1"],
        e2: ["e3", "e4", "d3"],
        f2: ["f3", "f4"],
      },
      width: 480,
      position: initialPosition,
      lastMoveSquares: [],
      showPromotionChoice: false,
    });
  });

  it("RESIZE action", () => {
    const state = withMoveValidationReducer(defaultState, {
      type: WithMoveValidationAction.RESIZE,
      payload: 240,
    });

    expect(state).toEqual({
      game: null,
      validMoves: {},
      width: 240,
      position: initialPosition,
      lastMoveSquares: [],
      showPromotionChoice: false,
    });
  });

  it("CHANGE_POSITION", () => {
    const game = new Chess(initialFen);

    game.move({
      from: "e2",
      to: "e4",
    });

    const state = withMoveValidationReducer(
      {
        ...defaultState,
        game,
      },
      {
        type: WithMoveValidationAction.CHANGE_POSITION,
        payload: {
          lastMove: {
            from: "e2",
            to: "e4",
          },
          position: {
            e4: PieceCode.WHITE_PAWN,
            f2: PieceCode.WHITE_PAWN,
            e1: PieceCode.WHITE_KING,
            f5: PieceCode.BLACK_KING,
            e7: PieceCode.BLACK_PAWN,
            d3: PieceCode.BLACK_PAWN,
          },
        },
      }
    );

    expect(state).toEqual({
      game: game,
      validMoves: {
        f5: ["e6", "f6", "g6", "g5", "g4", "f4", "e4", "e5"],
      },
      width: 480,
      position: {
        e4: PieceCode.WHITE_PAWN,
        f2: PieceCode.WHITE_PAWN,
        e1: PieceCode.WHITE_KING,
        f5: PieceCode.BLACK_KING,
        e7: PieceCode.BLACK_PAWN,
        d3: PieceCode.BLACK_PAWN,
      },
      lastMoveSquares: ["e2", "e4"],
      showPromotionChoice: false,
    });
  });
});
