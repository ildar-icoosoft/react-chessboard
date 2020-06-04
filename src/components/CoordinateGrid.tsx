import React, { FC } from "react";
import { PieceColor } from "../enums/PieceColor";
import { Position } from "../interfaces/Position";

export interface CoordinateGridProps {
  orientation: PieceColor;
  position: Position;
}

export const CoordinateGrid: FC<CoordinateGridProps> = ({}) => {
  return <div></div>;
};
