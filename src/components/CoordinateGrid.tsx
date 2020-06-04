import React, { FC } from "react";
import { PieceColor } from "../enums/PieceColor";
import { Position } from "../interfaces/Position";
import { toPairs as _toPairs } from "lodash";
import { Piece } from "./Piece";

export interface CoordinateGridProps {
  orientation?: PieceColor;
  position?: Position;
}

export const CoordinateGrid: FC<CoordinateGridProps> = ({ position = {} }) => {
  return (
    <>
      {_toPairs(position).map((pair) => (
        <Piece pieceCode={pair[1]} key={pair[0]} />
      ))}
    </>
  );
};
