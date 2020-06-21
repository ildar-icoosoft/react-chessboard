import React, { FC, useRef } from "react";
import css from "./Resizer.scss";
import { DraggableCore, DraggableData, DraggableEvent } from "react-draggable";

export interface ResizerProps {
  onResize?: (width: number) => void;
  width: number;
  minWidth: number;
  maxWidth?: number;
}

export const Resizer: FC<ResizerProps> = ({
  onResize,
  width,
  minWidth,
  maxWidth = Infinity,
}) => {
  const slackWidth = useRef<number>(0);

  const onDragHandler = (_event: DraggableEvent, data: DraggableData) => {
    if (onResize) {
      const deltaX: number = data.deltaX;
      const deltaY: number = data.deltaY;

      const oldWidth: number = width + (deltaX + deltaY) / 2;

      let newWidth: number = oldWidth + slackWidth.current;

      newWidth = Math.max(minWidth, newWidth);
      newWidth = Math.min(maxWidth, newWidth);

      slackWidth.current += oldWidth - newWidth;

      onResize(newWidth);
    }
  };

  const onStopHandler = () => {
    slackWidth.current = 0;
  };

  return (
    <DraggableCore onDrag={onDragHandler} onStop={onStopHandler}>
      <div data-testid={"resizer"} className={css.resizer} />
    </DraggableCore>
  );
};
