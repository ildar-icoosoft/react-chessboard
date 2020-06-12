import { FC, ReactElement, useState } from "react";
import { Position } from "../../interfaces/Position";
import { BoardDropEvent } from "../../interfaces/BoardDropEvent";
import { PieceDragStartEvent } from "../../interfaces/PieceDragStartEvent";

export interface MoveWithoutValidationCallbackProps {
  position: Position;
  draggable: boolean;
  selectionSquares: string[];
  lastMoveSquares: string[];
  onDragStart(event: PieceDragStartEvent): void;
  onDrop(event: BoardDropEvent): void;
  onSquareClick(coordinates: string): void;
}

export interface MoveWithoutValidationProps {
  initialPosition?: Position;
  children(
    callbackProps: MoveWithoutValidationCallbackProps
  ): ReactElement<any, any> | null;
}

export const MoveWithoutValidation: FC<MoveWithoutValidationProps> = ({
  children,
  initialPosition = {},
}) => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [selectionSquares, setSelectionSquares] = useState<string[]>([]);
  const [lastMoveSquares, setLastMoveSquares] = useState<string[]>([]);

  return children({
    position,
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
    selectionSquares,
    lastMoveSquares,
  });
};
