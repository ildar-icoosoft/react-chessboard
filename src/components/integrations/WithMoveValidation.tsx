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

const canSelectSquare = (
  coordinates: string,
  position: Position,
  game: ChessInstance
): boolean => {
  return position[coordinates] && isTurnToMove(position[coordinates], game);
};

const getDestinationSquares = (
  game: ChessInstance,
  coordinates: string
): string[] => {
  return game
    .moves({ square: coordinates, verbose: true })
    .map((item) => item.to);
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
      setDestinationSquares(getDestinationSquares(game!, event.coordinates));
    },
    onDrop(event) {
      const move: Move | null = game!.move({
        from: event.sourceCoordinates as Square,
        to: event.targetCoordinates as Square,
      });
      if (!move) {
        // invalid move
        event.cancelMove();

        setSelectionSquares([]);
        setDestinationSquares([]);
        return;
      }

      setLastMoveSquares([event.sourceCoordinates, event.targetCoordinates]);

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
        // second click

        // double click on the same square
        if (selectionSquares[0] === coordinates) {
          setSelectionSquares([]);
          setDestinationSquares([]);
          return;
        }

        // click on another piece with the same color
        if (canSelectSquare(coordinates, position, game!)) {
          setSelectionSquares([coordinates]);
          setDestinationSquares(getDestinationSquares(game!, coordinates));
          return;
        }

        const move: Move | null = game!.move({
          from: selectionSquares[0] as Square,
          to: coordinates as Square,
        });
        if (!move) {
          // invalid move
          setSelectionSquares([]);
          setDestinationSquares([]);
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
        // first click

        if (canSelectSquare(coordinates, position, game!)) {
          setSelectionSquares([coordinates]);
          setDestinationSquares(getDestinationSquares(game!, coordinates));
        }
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
