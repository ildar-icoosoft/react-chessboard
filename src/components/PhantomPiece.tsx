import React, { FC, useEffect, useState } from "react";
import { PieceCode } from "../enums/PieceCode";
import { Piece } from "./Piece";
import { DEFAULT_TRANSITION_DURATION } from "../constants/constants";
import css from "./PhantomPiece.scss";

export interface PhantomPieceProps {
  pieceCode: PieceCode;
  width?: number;
  transitionDuration?: number;
}

export const PhantomPiece: FC<PhantomPieceProps> = ({
  pieceCode,
  width,
  transitionDuration = DEFAULT_TRANSITION_DURATION,
}) => {
  const [showPhantom, setShowPhantom] = useState<boolean>(true);

  useEffect(() => {
    const timeoutId: NodeJS.Timeout = setTimeout(() => {
      setShowPhantom(false);
    }, transitionDuration);

    return () => clearTimeout(timeoutId);
  }, []);

  if (!showPhantom) {
    return null;
  }

  return (
    <div
      data-testid={`phantom-piece-${pieceCode}`}
      className={css.phantomPiece}
    >
      <Piece pieceCode={pieceCode} width={width} />
    </div>
  );
};
