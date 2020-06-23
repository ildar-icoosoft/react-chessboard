import { FC, ReactElement, useEffect, useReducer } from "react";
import { Position } from "../../interfaces/Position";
import { PieceDropEvent } from "../../interfaces/PieceDropEvent";
import { PieceDragStartEvent } from "../../interfaces/PieceDragStartEvent";
import {
  DEFAULT_BOARD_WIDTH,
  INITIAL_BOARD_FEN,
} from "../../constants/constants";
import {
  convertFenToPositionObject,
  getColorFromPieceCode,
} from "../../utils/chess";
import { PieceCode } from "../../enums/PieceCode";
import { PieceColor } from "../../enums/PieceColor";
import { Chess, ChessInstance, Move, Square } from "chess.js";
import {
  getWithMoveValidationInitialState,
  WithMoveValidationAction,
  withMoveValidationReducer,
} from "./WithMoveValidation.reducer";

export interface WithMoveValidationCallbackProps {
  allowMoveFrom: (pieceCode: PieceCode, coordinates: string) => boolean;
  check: boolean;
  position: Position;
  draggable: boolean;
  width: number;
  selectionSquares: string[];
  destinationSquares: string[];
  lastMoveSquares: string[];
  occupationSquares: string[];
  turnColor: PieceColor;

  onDragStart(event: PieceDragStartEvent): void;

  onDrop(event: PieceDropEvent): void;

  onSquareClick(coordinates: string): void;

  onResize(width: number): void;
}

export interface WithMoveValidationProps {
  initialFen?: string;

  children(
    callbackProps: WithMoveValidationCallbackProps
  ): ReactElement<any, any> | null;
}

const isTurnToMove = (pieceCode: PieceCode, game: ChessInstance): boolean => {
  const pieceColor: PieceColor = getColorFromPieceCode(pieceCode);

  return (
    (pieceColor === PieceColor.WHITE && game.turn() === "w") ||
    (pieceColor === PieceColor.BLACK && game.turn() === "b")
  );
};

const canSelectSquare = (
  coordinates: string,
  position: Position,
  game: ChessInstance
): boolean => {
  return (
    position[coordinates] &&
    isTurnToMove(position[coordinates], game) &&
    !game.game_over()
  );
};

const getDestinationSquares = (
  game: ChessInstance,
  coordinates: string
): string[] => {
  return game
    .moves({ square: coordinates, verbose: true })
    .map((item) => item.to);
};

const getTurnColor = (game: ChessInstance | null): PieceColor => {
  if (game) {
    if (game.turn() === "w") {
      return PieceColor.WHITE;
    }
    return PieceColor.BLACK;
  }
  return PieceColor.WHITE;
};

export const WithMoveValidation: FC<WithMoveValidationProps> = ({
  children,
  initialFen = INITIAL_BOARD_FEN,
}) => {
  const [state, dispatch] = useReducer(
    withMoveValidationReducer,
    getWithMoveValidationInitialState(initialFen, DEFAULT_BOARD_WIDTH)
  );

  const {
    game,
    position,
    selectionSquares,
    occupationSquares,
    destinationSquares,
    lastMoveSquares,
    width,
  } = state;

  useEffect(() => {
    dispatch({
      type: WithMoveValidationAction.SET_GAME,
      payload: new Chess(initialFen),
    });
  }, []);

  return children({
    allowMoveFrom(pieceCode) {
      return isTurnToMove(pieceCode, game!) && !game!.game_over();
    },
    check: game ? game.in_check() : false,
    position,
    width,
    draggable: true,
    onDragStart(event: PieceDragStartEvent) {
      dispatch({
        type: WithMoveValidationAction.SELECT_SQUARE,
        payload: {
          selectionSquare: event.coordinates,
          destinationSquares: getDestinationSquares(game!, event.coordinates),
        },
      });
    },
    onDrop(event) {
      const move: Move | null = game!.move({
        from: event.sourceCoordinates as Square,
        to: event.targetCoordinates as Square,
      });
      if (!move) {
        // invalid move
        event.cancelMove();

        dispatch({
          type: WithMoveValidationAction.CLEAR_SELECTION,
          payload: null,
        });
        return;
      }

      dispatch({
        type: WithMoveValidationAction.CHANGE_POSITION,
        payload: {
          lastMove: {
            from: event.sourceCoordinates,
            to: event.targetCoordinates,
          },
          position: convertFenToPositionObject(game!.fen()),
        },
      });
    },
    onSquareClick(coordinates: string) {
      if (selectionSquares.length) {
        // second click

        // double click on the same square
        if (selectionSquares[0] === coordinates) {
          dispatch({
            type: WithMoveValidationAction.CLEAR_SELECTION,
            payload: null,
          });
          return;
        }

        // click on another piece with the same color
        if (canSelectSquare(coordinates, position, game!)) {
          dispatch({
            type: WithMoveValidationAction.SELECT_SQUARE,
            payload: {
              selectionSquare: coordinates,
              destinationSquares: getDestinationSquares(game!, coordinates),
            },
          });
          return;
        }

        const move: Move | null = game!.move({
          from: selectionSquares[0] as Square,
          to: coordinates as Square,
        });
        if (!move) {
          // invalid move
          dispatch({
            type: WithMoveValidationAction.CLEAR_SELECTION,
            payload: null,
          });
          return;
        }

        dispatch({
          type: WithMoveValidationAction.CHANGE_POSITION,
          payload: {
            lastMove: {
              from: selectionSquares[0],
              to: coordinates,
            },
            position: convertFenToPositionObject(game!.fen()),
          },
        });
      } else {
        // first click
        if (canSelectSquare(coordinates, position, game!)) {
          dispatch({
            type: WithMoveValidationAction.SELECT_SQUARE,
            payload: {
              selectionSquare: coordinates,
              destinationSquares: getDestinationSquares(game!, coordinates),
            },
          });
        }
      }
    },
    onResize(width: number) {
      dispatch({
        type: WithMoveValidationAction.RESIZE,
        payload: width,
      });
    },
    selectionSquares,
    destinationSquares,
    lastMoveSquares,
    occupationSquares,
    turnColor: getTurnColor(game),
  });
};
