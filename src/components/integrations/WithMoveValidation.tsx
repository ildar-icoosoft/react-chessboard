import { FC, ReactElement, useEffect, useReducer, useRef } from "react";
import { Position } from "../../interfaces/Position";
import {
  DEFAULT_BOARD_WIDTH,
  INITIAL_BOARD_FEN,
} from "../../constants/constants";
import { convertFenToPositionObject, getTurnColor } from "../../utils/chess";
import { PieceColor } from "../../enums/PieceColor";
import { Chess, Move as ChessJsMove } from "chess.js";
import {
  getWithMoveValidationInitialState,
  WithMoveValidationAction,
  withMoveValidationReducer,
} from "./WithMoveValidation.reducer";
import { Move } from "../../interfaces/Move";
import { ValidMoves } from "../../types/ValidMoves";

export interface WithMoveValidationCallbackProps {
  allowMarkers: boolean;
  clickable: boolean;
  check: boolean;
  position: Position;
  draggable: boolean;
  width: number;
  lastMoveSquares: string[];
  turnColor: PieceColor;
  validMoves: ValidMoves;
  viewOnly: boolean;
  movableColor: PieceColor | "both";

  onResize(width: number): void;

  onMove(move: Move): void;
  onSetPremove(move: Move, playPremove: () => void): void;
}

export interface WithMoveValidationProps {
  initialFen?: string;
  playerVsCompMode?: boolean;

  children(
    callbackProps: WithMoveValidationCallbackProps
  ): ReactElement<any, any> | null;
}

export const WithMoveValidation: FC<WithMoveValidationProps> = ({
  children,
  initialFen = INITIAL_BOARD_FEN,
  playerVsCompMode = false,
}) => {
  const [state, dispatch] = useReducer(
    withMoveValidationReducer,
    getWithMoveValidationInitialState(initialFen, DEFAULT_BOARD_WIDTH)
  );

  const premove = useRef<[Move, () => void] | null>(null);

  const { game, position, lastMoveSquares, width, validMoves } = state;

  const computerMove = () => {
    const moves = game!.moves({ verbose: true });
    const move = moves[Math.floor(Math.random() * moves.length)];
    if (moves.length > 0) {
      game!.move(move.san);

      dispatch({
        type: WithMoveValidationAction.CHANGE_POSITION,
        payload: {
          lastMove: {
            from: move.from,
            to: move.to,
          },
          position: convertFenToPositionObject(game!.fen()),
        },
      });

      if (premove.current) {
        premove.current[1]();
      }
    }
  };

  useEffect(() => {
    dispatch({
      type: WithMoveValidationAction.SET_GAME,
      payload: new Chess(initialFen),
    });
  }, []);

  return children({
    check: game ? game.in_check() : false,
    position,
    width,
    allowMarkers: true,
    clickable: true,
    draggable: true,
    movableColor: playerVsCompMode ? PieceColor.WHITE : "both",
    onResize(width: number) {
      dispatch({
        type: WithMoveValidationAction.RESIZE,
        payload: width,
      });
    },
    lastMoveSquares,
    turnColor: getTurnColor(game),
    onMove(move: Move) {
      const chessJsMove: ChessJsMove | null = game!.move(move as ChessJsMove);
      if (!chessJsMove) {
        return;
      }

      dispatch({
        type: WithMoveValidationAction.CHANGE_POSITION,
        payload: {
          lastMove: {
            from: move.from,
            to: move.to,
          },
          position: convertFenToPositionObject(game!.fen()),
        },
      });

      if (playerVsCompMode) {
        setTimeout(computerMove, 3000);
      }
    },
    validMoves,
    viewOnly: game ? game.game_over() : false,
    onSetPremove(move: Move, playPremove: () => void) {
      premove.current = [move, playPremove];
    },
  });
};
