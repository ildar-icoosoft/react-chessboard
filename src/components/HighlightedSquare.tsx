import React, { FC, useCallback, useState } from "react";
import { XYCoordinates } from "../interfaces/XYCoordinates";
import css from "./HighlightedSquare.scss";
import classNames from "classnames";

export enum HighlightedSquareType {
  SELECTION = "selection",
  DESTINATION = "destination",
  OCCUPATION = "selected",
  LAST_MOVE = "lastMove",
  CURRENT_PREMOVE = "currentPremove",
  CHECK = "check",
}

export interface CoordsProps {
  xYCoordinates: XYCoordinates;
  types?: HighlightedSquareType[];
  width?: number;
}

export const HighlightedSquare: FC<CoordsProps> = ({
  xYCoordinates,
  types = [],
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = useCallback(() => setIsDragOver(true), []);
  const handleDragLeave = useCallback(() => setIsDragOver(false), []);
  const handleDrop = useCallback(() => setIsDragOver(false), []);

  if (!types.length) {
    return null;
  }

  return (
    <div
      data-testid={"highlighted-square"}
      className={classNames(css.highlightedSquare, {
        [css.selected]: types.includes(HighlightedSquareType.SELECTION),
        [css.dest]:
          types.includes(HighlightedSquareType.DESTINATION) &&
          !types.includes(HighlightedSquareType.CHECK),
        [css.oc]:
          types.includes(HighlightedSquareType.OCCUPATION) &&
          !types.includes(HighlightedSquareType.CHECK),
        [css.lastMove]: types.includes(HighlightedSquareType.LAST_MOVE),
        [css.check]: types.includes(HighlightedSquareType.CHECK),
        [css.currentPremove]: types.includes(
          HighlightedSquareType.CURRENT_PREMOVE
        ),
        [css.hover]: isDragOver,
      })}
      style={{
        transform: `translate(${xYCoordinates.x}px, ${xYCoordinates.y}px)`,
      }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    />
  );
};
