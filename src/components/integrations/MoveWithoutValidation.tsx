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
  const [currentMoveSelection, setCurrentMoveSelection] = useState<
    string | null
  >(null);

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
      setCurrentMoveSelection((currentSelection) => {
        if (currentSelection === null && !position[coordinates]) {
          return currentSelection;
        }

        if (currentSelection) {
          setPosition((prevPosition) => {
            const newPosition: Position = {
              ...prevPosition,
            };
            delete newPosition[currentSelection];

            newPosition[coordinates] = prevPosition[currentSelection];

            return newPosition;
          });

          return null;
        }

        return coordinates;
      });
    },
    selectionSquares: currentMoveSelection ? [currentMoveSelection] : [],
  });
};
