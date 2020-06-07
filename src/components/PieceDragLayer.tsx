import React, { forwardRef } from "react";
import { useDragLayer } from "react-dnd";
import { Piece } from "./Piece";
import css from "./PieceDragLayer.scss";
import { PieceCode } from "../enums/PieceCode";
import { DragItemType } from "../enums/DragItemType";
import { DEFAULT_SQUARE_WIDTH } from "../constants/constants";

export interface PieceDragLayerRef {}

export interface PieceDragLayerProps {
  width?: number;
}

// @todo.
// we need forwardRef because we use wrapInTestContext() function in unit tests. Which is required to have a ref to Decorated component
// maybe we should update wrapInTestContext() function to check if Decorated component has a ref
export const PieceDragLayer = forwardRef<
  PieceDragLayerRef,
  PieceDragLayerProps
>(({ width = DEFAULT_SQUARE_WIDTH }, _ref) => {
  const { isDragging, itemType, item, clientOffset } = useDragLayer(
    (monitor) => ({
      isDragging: monitor.isDragging(),
      itemType: monitor.getItemType(),
      item: monitor.getItem(),
      clientOffset: monitor.getClientOffset(),
    })
  );

  if (!isDragging || itemType !== DragItemType.PIECE) {
    return null;
  }

  // for some reason on Drop event, isDragging is true, but clientOffset is NULL
  // This is why we need to check clientOffset here
  if (!clientOffset) {
    return null;
  }

  const pieceCode: PieceCode = item.pieceCode;

  const { x, y } = clientOffset;

  return (
    <div
      data-testid={"piece-drag-layer"}
      className={css.pieceDragLayer}
      style={{
        transform: `translate(${x - width / 2}px, ${y - width / 2}px)`,
        width: `${width}px`,
        height: `${width}px`,
      }}
    >
      <Piece pieceCode={pieceCode} width={width} />
    </div>
  );
});
