import React, { FC } from "react";
import { Piece } from "./Piece";
import { PieceCode } from "../enums/PieceCode";
import { SquareTransitionFrom } from "../interfaces/SquareTransitionFrom";
import { XYCoordinates } from "../interfaces/XYCoordinates";
import classNames from "classnames";
import css from "./DraggablePiece.scss";

export interface DraggablePieceProps {
  pieceCode: PieceCode;
  xYCoordinates: XYCoordinates;
  width?: number;
  transitionFrom?: SquareTransitionFrom;
  transitionDuration?: number;
}

export const DraggablePiece: FC<DraggablePieceProps> = ({
  pieceCode,
  xYCoordinates,
}) => {
  return (
    <div
      className={classNames(css.draggablePiece)}
      data-testid={`draggable-piece-${pieceCode}`}
      style={{
        transform: `translate(${xYCoordinates.x}px, ${xYCoordinates.y}px)`,
      }}
    >
      <Piece pieceCode={pieceCode} />
    </div>
  );
};
