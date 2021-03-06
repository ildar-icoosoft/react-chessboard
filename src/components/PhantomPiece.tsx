import React, { FC, useEffect, useState } from "react";
import { PieceCode } from "../enums/PieceCode";
import { Piece } from "./Piece";
import { DEFAULT_TRANSITION_DURATION } from "../constants/constants";
import css from "./PhantomPiece.scss";
import { XYCoordinates } from "../interfaces/XYCoordinates";

export interface PhantomPieceProps {
  pieceCode: PieceCode;
  xYCoordinates: XYCoordinates;
  width?: number;
  transitionDuration?: number;
}

export const PhantomPiece: FC<PhantomPieceProps> = ({
  pieceCode,
  width,
  xYCoordinates,
  transitionDuration = DEFAULT_TRANSITION_DURATION,
}) => {
  const [showPhantom, setShowPhantom] = useState<boolean>(true);

  useEffect(() => {
    const timeoutId: NodeJS.Timeout = setTimeout(() => {
      setShowPhantom(false);
    }, transitionDuration);

    return () => clearTimeout(timeoutId);
  }, [transitionDuration]);

  if (!showPhantom) {
    return null;
  }

  return (
    <div
      data-testid={`phantom-piece-${pieceCode}`}
      className={css.phantomPiece}
      style={{
        transform: `translate(${xYCoordinates.x}px, ${xYCoordinates.y}px)`,
      }}
    >
      <Piece pieceCode={pieceCode} width={width} />
    </div>
  );
};
