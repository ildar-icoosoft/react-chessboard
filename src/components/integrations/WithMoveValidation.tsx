import { FC, ReactElement, useEffect, useState } from "react";
import { Position } from "../../interfaces/Position";
import { PieceDropEvent } from "../../interfaces/PieceDropEvent";
import { PieceDragStartEvent } from "../../interfaces/PieceDragStartEvent";
import {
  DEFAULT_BOARD_WIDTH,
  initialBoardFen,
} from "../../constants/constants";
import { Chess } from "chessops/chess";
import { chessgroundDests } from "chessops/compat";
import { parseFen as chessopsParseFen } from "chessops/fen";

export interface WithMoveValidationCallbackProps {
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
  initialPosition?: Position;
  children(
    callbackProps: WithMoveValidationCallbackProps
  ): ReactElement<any, any> | null;
}

export const WithMoveValidation: FC<WithMoveValidationProps> = ({
  children,
  initialPosition = {},
}) => {
  const [game, setGame] = useState<Chess | null>(null);

  const [position, setPosition] = useState<Position>(initialPosition);
  const [selectionSquares, setSelectionSquares] = useState<string[]>([]);
  const [destinationSquares, setDestinationSquares] = useState<string[]>([]);
  const [lastMoveSquares, setLastMoveSquares] = useState<string[]>([]);
  const [width, setWidth] = useState<number>(DEFAULT_BOARD_WIDTH);

  useEffect(() => {
    const setup = chessopsParseFen(initialBoardFen).unwrap();
    setGame(Chess.fromSetup(setup).unwrap());
  }, []);

  return children({
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
      if (!selectionSquares.length && !position[coordinates]) {
        // ignore first click on empty square
        return;
      }

      if (selectionSquares.length) {
        // second click. change position, set lastMoveSquares and clear selectionSquares

        const newPosition: Position = {
          ...position,
        };
        delete newPosition[selectionSquares[0]];

        newPosition[coordinates] = position[selectionSquares[0]];

        setPosition(newPosition);
        setLastMoveSquares([selectionSquares[0], coordinates]);
        setSelectionSquares([]);
      } else {
        // first click. set selectionSquares

        setSelectionSquares([coordinates]);
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
