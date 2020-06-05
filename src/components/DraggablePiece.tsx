import React, { FC } from "react";
import { Piece, PieceProps } from "./Piece";

export const DraggablePiece: FC<PieceProps> = (props: PieceProps) => {
  return <Piece {...props} />;
};
