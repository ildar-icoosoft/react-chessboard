import { FC, ReactElement, useState } from "react";
import { Position } from "../../interfaces/Position";
import { BoardDropEvent } from "../../interfaces/BoardDropEvent";
import { SquareCssClasses } from "../../interfaces/SquareCssClasses";

export interface MoveWithoutValidationCallbackProps {
  position: Position;
  draggable: boolean;
  squareCssClasses: SquareCssClasses;
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

  const squareCssClasses: SquareCssClasses = {};
  if (currentMoveSelection) {
    squareCssClasses[currentMoveSelection] = "selectedSquare";
  }

  return children({
    position,
    draggable: true,
    onDrop(boardDropEvent) {
      setPosition((prevPosition) => {
        const newPosition: Position = {
          ...prevPosition,
        };
        delete newPosition[boardDropEvent.sourceCoordinates];

        newPosition[boardDropEvent.targetCoordinates] =
          boardDropEvent.pieceCode;

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
    squareCssClasses,
  });
};
