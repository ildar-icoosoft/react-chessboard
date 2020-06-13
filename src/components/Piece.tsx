import React, { FC } from "react";
import { PieceCode } from "../enums/PieceCode";
import classNames from "classnames";
import css from "./Piece.scss";

export interface PieceProps {
  pieceCode: PieceCode;
  width?: number;
}

export const Piece: FC<PieceProps> = ({ pieceCode }) => {
  return (
    <div
      className={classNames(css.piece, css[pieceCode])}
      data-testid={`piece-${pieceCode}`}
    />
  );
};
