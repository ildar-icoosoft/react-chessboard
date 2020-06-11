import { FC, ReactElement, useState } from "react";
import { Position } from "../../interfaces/Position";
import { BoardDropEvent } from "../../interfaces/BoardDropEvent";
import { PieceDragStartEvent } from "../../interfaces/PieceDragStartEvent";

export interface MoveWithoutValidationCallbackProps {
  position: Position;
  draggable: boolean;
  selectionSquares: string[];
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
  const [position, setPosition] = useState(initialPosition);
  const [selectionSquares, setSelectionSquares] = useState<string[]>([]);

  return children({
    position,
    draggable: true,
    onDragStart(_event: PieceDragStartEvent) {},
    onDrop(event) {
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
      setSelectionSquares((currentSelectionSquares) => {
        if (currentSelectionSquares.length === 0 && !position[coordinates]) {
          return currentSelectionSquares;
        }

        if (currentSelectionSquares.length) {
          setPosition((prevPosition) => {
            const newPosition: Position = {
              ...prevPosition,
            };
            delete newPosition[currentSelectionSquares[0]];

            newPosition[coordinates] = prevPosition[currentSelectionSquares[0]];

            return newPosition;
          });

          return [];
        }

        return [coordinates];
      });
    },
    selectionSquares,
  });
};
