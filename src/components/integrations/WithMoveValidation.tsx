import { FC, ReactElement, useEffect, useState } from "react";
import { Position } from "../../interfaces/Position";
import { PieceDropEvent } from "../../interfaces/PieceDropEvent";
import { PieceDragStartEvent } from "../../interfaces/PieceDragStartEvent";
import {
  DEFAULT_BOARD_WIDTH,
  INITIAL_BOARD_FEN,
} from "../../constants/constants";
import { Chess } from "chessops/chess";
import { chessgroundDests } from "chessops/compat";
import { parseFen as chessopsParseFen } from "chessops/fen";
import {
  convertFenToPositionObject,
  getColorFromPieceCode,
} from "../../utils/chess";
import { PieceCode } from "../../enums/PieceCode";
import { PieceColor } from "../../enums/PieceColor";
import { parseSquare } from "chessops/util";
import { makeSanAndPlay } from "chessops/san";

export interface WithMoveValidationCallbackProps {
  allowDrag: (pieceCode: PieceCode, coordinates: string) => boolean;
  position: Position;
  draggable: boolean;
  width: number;
  selectionSquares: string[];
  destinationSquares: string[];
  lastMoveSquares: string[];

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

const isTurnToMove = (pieceCode: PieceCode, game: Chess): boolean => {
  const pieceColor: PieceColor = getColorFromPieceCode(pieceCode);

  if (
    (pieceColor === PieceColor.WHITE && game.turn === "white") ||
    (pieceColor === PieceColor.BLACK && game.turn === "black")
  ) {
    return true;
  }
  return false;
};

export const WithMoveValidation: FC<WithMoveValidationProps> = ({
  children,
  initialFen = INITIAL_BOARD_FEN,
}) => {
  const [game, setGame] = useState<Chess | null>(null);

  const [position, setPosition] = useState<Position>(
    convertFenToPositionObject(initialFen)
  );
  const [selectionSquares, setSelectionSquares] = useState<string[]>([]);
  const [destinationSquares, setDestinationSquares] = useState<string[]>([]);
  const [lastMoveSquares, setLastMoveSquares] = useState<string[]>([]);
  const [width, setWidth] = useState<number>(DEFAULT_BOARD_WIDTH);

  useEffect(() => {
    const setup = chessopsParseFen(initialFen).unwrap();
    setGame(Chess.fromSetup(setup).unwrap());
  }, []);

  return children({
    allowDrag(pieceCode) {
      return isTurnToMove(pieceCode, game as Chess);
    },
    position,
    width,
    draggable: true,
    onDragStart(event: PieceDragStartEvent) {
      setSelectionSquares([event.coordinates]);

      const dests = chessgroundDests(game as Chess);
      setDestinationSquares(dests[event.coordinates]);
    },
    onDrop(event) {
      if (event.sourceCoordinates === event.targetCoordinates) {
        event.cancelMove();
      } else {
        setLastMoveSquares([event.sourceCoordinates, event.targetCoordinates]);
      }
      setSelectionSquares([]);
      setDestinationSquares([]);

      setPosition((prevPosition) => {
        const newPosition: Position = {
          ...prevPosition,
        };
        delete newPosition[event.sourceCoordinates];

        newPosition[event.targetCoordinates] = event.pieceCode;

        return newPosition;
      });
    },
    onSquareClick(coordinates: string) {
      if (selectionSquares.length) {
        // second click. change position, set lastMoveSquares and clear selectionSquares

        const move = (game as Chess).normalizeMove({
          from: parseSquare(selectionSquares[0])!,
          to: parseSquare(coordinates)!,
        });

        if (!game!.isLegal(move)) {
          return;
        }
        makeSanAndPlay(game!, move);

        const newPosition: Position = {
          ...position,
        };
        delete newPosition[selectionSquares[0]];

        newPosition[coordinates] = position[selectionSquares[0]];

        setPosition(newPosition);
        setLastMoveSquares([selectionSquares[0], coordinates]);

        setSelectionSquares([]);
        setDestinationSquares([]);
      } else {
        if (
          !position[coordinates] ||
          !isTurnToMove(position[coordinates], game as Chess)
        ) {
          // ignore first click on empty square or if it is not turn to move
          return;
        }

        // first click. set selectionSquares, destinationSquares
        setSelectionSquares([coordinates]);

        const dests = chessgroundDests(game as Chess);
        setDestinationSquares(dests[coordinates]);
      }
    },
    onResize(width: number) {
      setWidth(width);
    },
    selectionSquares,
    destinationSquares,
    lastMoveSquares,
  });
};
