import React, { FC } from "react";
import { PieceColor } from "../enums/PieceColor";
import { Position } from "../interfaces/Position";
import { toPairs as _toPairs } from "lodash";
import { Piece } from "./Piece";
import css from "./CoordinateGrid.scss";
import { DEFAULT_BOARD_WIDTH } from "../constants/constants";
import { getPieceXYCoordinates } from "../utils/chess";

export interface CoordinateGridProps {
  orientation?: PieceColor;
  position?: Position;
  width?: number;
}

export const CoordinateGrid: FC<CoordinateGridProps> = ({
  position = {},
  width = DEFAULT_BOARD_WIDTH,
  orientation = PieceColor.WHITE,
}) => {
  return (
    <div
      data-testid={"coordinate-grid"}
      className={css.coordinateGrid}
      style={{ width: `${width}px`, height: `${width}px` }}
    >
      {_toPairs(position).map((pair) => (
        <Piece
          pieceCode={pair[1]}
          width={width / 8}
          xYCoordinates={getPieceXYCoordinates(pair[0], width, orientation)}
          key={pair[0]}
        />
      ))}
    </div>
  );
};
