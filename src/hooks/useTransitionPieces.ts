import { Position } from "../interfaces/Position";
import { getPositionDiff } from "../utils/chess";
import { useMemo, useRef } from "react";
import { SquareTransitionFrom } from "../interfaces/SquareTransitionFrom";
import { mapValues as _mapValues } from "lodash";
import { XYCoordinates } from "../interfaces/XYCoordinates";
import { usePreviousDifferent } from "./usePreviousDifferent";
import { isEqual as _isEqual } from "lodash";

export type useTransitionPiecesResult = [
  Record<string, SquareTransitionFrom>,
  () => void, // disableTransitionInNextPosition() callback
  () => void // enableTransitionInNextPosition() callback
];

export const useTransitionPieces = (
  position: Position,
  getSquareXYCoordinates: (coordinates: string) => XYCoordinates
): useTransitionPiecesResult => {
  const disableTransitionFrom = useRef<Position | null>(null);

  const prevPosition: Position | undefined = usePreviousDifferent<Position>(
    position,
    true
  );

  if (
    disableTransitionFrom.current &&
    !_isEqual(disableTransitionFrom.current, prevPosition) &&
    !_isEqual(disableTransitionFrom.current, position)
  ) {
    disableTransitionFrom.current = null;
  }

  const positionDiff: Record<string, string> = useMemo(() => {
    if (!prevPosition) {
      return {};
    }
    if (
      disableTransitionFrom.current &&
      _isEqual(prevPosition, disableTransitionFrom.current)
    ) {
      return {};
    }

    return getPositionDiff(position, prevPosition);
  }, [position, prevPosition]);

  const transitionPieces: Record<string, SquareTransitionFrom> = _mapValues(
    positionDiff,
    (sourceCoordinates, targetCoordinates) => {
      const sourceXYCoordinates = getSquareXYCoordinates(sourceCoordinates);
      const sourceX = sourceXYCoordinates.x;
      const sourceY = sourceXYCoordinates.y;

      return {
        algebraic: sourceCoordinates,
        x: sourceX,
        y: sourceY,
        phantomPiece: (prevPosition as Position)[targetCoordinates],
      };
    }
  );

  return [
    transitionPieces,
    () => {
      disableTransitionFrom.current = position;
    },
    () => {
      disableTransitionFrom.current = null;
    },
  ];
};
