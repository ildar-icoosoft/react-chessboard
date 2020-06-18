import { FC, ReactElement, useState } from "react";
import { Position } from "../../interfaces/Position";
import { PieceDropEvent } from "../../interfaces/PieceDropEvent";
import { PieceDragStartEvent } from "../../interfaces/PieceDragStartEvent";
import { DEFAULT_BOARD_WIDTH } from "../../constants/constants";

export interface WithMoveValidationCallbackProps {
  position: Position;
  draggable: boolean;
  width: number;
  selectionSquares: string[];
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
  const [position, setPosition] = useState<Position>(initialPosition);
  const [selectionSquares, setSelectionSquares] = useState<string[]>([]);
  const [lastMoveSquares, setLastMoveSquares] = useState<string[]>([]);
  const [width, setWidth] = useState<number>(DEFAULT_BOARD_WIDTH);

  return children({
    position,
    width,
    draggable: true,
    onDragStart(event: PieceDragStartEvent) {
      setSelectionSquares([event.coordinates]);
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
    lastMoveSquares,
  });
};