import React, { FC, MouseEvent, RefObject, useRef } from "react";
import { PieceColor } from "../enums/PieceColor";
import { Position } from "../interfaces/Position";
import { toPairs as _toPairs } from "lodash";
import { Piece } from "./Piece";
import css from "./CoordinateGrid.scss";
import { DEFAULT_BOARD_WIDTH } from "../constants/constants";
import {
  getSquareAlgebraicCoordinates,
  getSquareXYCoordinates,
} from "../utils/chess";

export interface CoordinateGridProps {
  orientation?: PieceColor;
  position?: Position;
  width?: number;

  onClick?(coordinates: string): void;
  onRightClick?(coordinates: string): void;
}

export const CoordinateGrid: FC<CoordinateGridProps> = ({
  position = {},
  width = DEFAULT_BOARD_WIDTH,
  orientation = PieceColor.WHITE,
  onClick,
  onRightClick,
}) => {
  const elementRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const handleClick = (event: MouseEvent): void => {
    if (onClick) {
      const rect: DOMRect = (elementRef.current as HTMLDivElement).getBoundingClientRect();

      const coordinates: string = getSquareAlgebraicCoordinates(
        {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        },
        width,
        orientation
      );

      onClick(coordinates);
    }
  };

  const handleContextMenu = (event: MouseEvent): void => {
    event.preventDefault();

    if (onRightClick) {
      const rect: DOMRect = (elementRef.current as HTMLDivElement).getBoundingClientRect();

      const coordinates: string = getSquareAlgebraicCoordinates(
        {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        },
        width,
        orientation
      );

      onRightClick(coordinates);
    }
  };

  return (
    <div
      data-testid={"coordinate-grid"}
      className={css.coordinateGrid}
      style={{ width: `${width}px`, height: `${width}px` }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      ref={elementRef}
    >
      {_toPairs(position).map((pair) => (
        <Piece
          pieceCode={pair[1]}
          width={width / 8}
          xYCoordinates={getSquareXYCoordinates(pair[0], width, orientation)}
          key={pair[0]}
        />
      ))}
    </div>
  );
};
