import { FC, ReactElement, useState } from "react";
import { Position } from "../../interfaces/Position";
import { BoardDropEvent } from "../../interfaces/BoardDropEvent";

export interface MoveWithoutValidationCallbackProps {
  position: Position;
  draggable: boolean;
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
  const [, setCurrentMoveSelection] = useState<string[]>([]);

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
      setCurrentMoveSelection((prevState) => {
        if (!prevState.length && !position[coordinates]) {
          return prevState;
        }

        if (prevState.length) {
          setPosition((prevPosition) => {
            const newPosition: Position = {
              ...prevPosition,
            };
            delete newPosition[prevState[0]];

            newPosition[coordinates] = prevPosition[prevState[0]];

            return newPosition;
          });

          return [];
        }

        return [coordinates];
      });
    },
  });
};
