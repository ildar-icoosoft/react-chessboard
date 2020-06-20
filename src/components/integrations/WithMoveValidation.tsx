import { FC, ReactElement, useEffect, useState } from "react";
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

const isTurnToMove = (pieceCode: PieceCode, game: ChessInstance): boolean => {
  const pieceColor: PieceColor = getColorFromPieceCode(pieceCode);

  return (
    (pieceColor === PieceColor.WHITE && game.turn() === "w") ||
    (pieceColor === PieceColor.BLACK && game.turn() === "b")
  );
};

export const WithMoveValidation: FC<WithMoveValidationProps> = ({
  children,
  initialFen = INITIAL_BOARD_FEN,
}) => {
  const [game, setGame] = useState<ChessInstance | null>(null);

  const [position, setPosition] = useState<Position>(
    convertFenToPositionObject(initialFen)
  );
  const [selectionSquares, setSelectionSquares] = useState<string[]>([]);
  const [destinationSquares, setDestinationSquares] = useState<string[]>([]);
  const [lastMoveSquares, setLastMoveSquares] = useState<string[]>([]);
  const [width, setWidth] = useState<number>(DEFAULT_BOARD_WIDTH);

  useEffect(() => {
    setGame(new Chess(initialFen));
  }, []);

  return children({
    allowDrag(pieceCode) {
      return isTurnToMove(pieceCode, game!);
    },
    position,
    width,
    draggable: true,
    onDragStart(event: PieceDragStartEvent) {
      setSelectionSquares([event.coordinates]);

      const dests = game!
        .moves({ square: event.coordinates, verbose: true })
        .map((item) => item.to);
      setDestinationSquares(dests);
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

        const move: Move | null = game!.move({
          from: selectionSquares[0] as Square,
          to: coordinates as Square,
        });
        if (!move) {
          // invalid move
          return;
        }

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
          !isTurnToMove(position[coordinates], game!)
        ) {
          // ignore first click on empty square or if it is not turn to move
          return;
        }

        // first click. set selectionSquares, destinationSquares
        setSelectionSquares([coordinates]);

        const dests = game!
          .moves({ square: coordinates, verbose: true })
          .map((item) => item.to);
        setDestinationSquares(dests);
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
