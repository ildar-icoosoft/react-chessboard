import React, { forwardRef, useImperativeHandle } from "react";
import { Piece, PieceProps } from "./Piece";
import { Identifier } from "dnd-core";
import { useDrag } from "react-dnd";
import { DragItemType } from "../enums/DragItemType";
import { PieceCode } from "../enums/PieceCode";
import { SquareTransitionFrom } from "../interfaces/SquareTransitionFrom";
import { XYCoordinates } from "../interfaces/XYCoordinates";

export interface DraggablePieceProps {
  pieceCode: PieceCode;
  width?: number;
  transitionFrom?: SquareTransitionFrom;
  transitionDuration?: number;
  xYCoordinates?: XYCoordinates;
}

export interface DraggablePieceRef {
  getDragHandlerId(): Identifier | null;
}

export const DraggablePiece = forwardRef<
  DraggablePieceRef,
  DraggablePieceProps
>((props: PieceProps, ref) => {
  const { pieceCode, xYCoordinates } = props;

  const [{ dragHandlerId }] = useDrag({
    item: {
      type: DragItemType.PIECE,
      pieceCode,
      xYCoordinates,
    },
    collect(monitor) {
      return {
        dragHandlerId: monitor.getHandlerId(),
      };
    },
  });

  useImperativeHandle(ref, () => ({
    getDragHandlerId: (): Identifier | null => dragHandlerId,
  }));

  return <Piece pieceCode={pieceCode} />;
});
