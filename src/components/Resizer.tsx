import React, { FC, useRef } from "react";
import css from "./Resizer.scss";
import { DraggableCore, DraggableData, DraggableEvent } from "react-draggable";

export interface ResizerProps {
  onResize?: (width: number) => void;
  width: number;
  minWidth: number;
}

export const Resizer: FC<ResizerProps> = ({ onResize, width, minWidth }) => {
  const slackWidth = useRef<number>(0);

  const onDragHandler = (_event: DraggableEvent, data: DraggableData) => {
    if (onResize) {
      const deltaX: number = data.deltaX;
      const deltaY: number = data.deltaY;

      const oldWidth: number = width + (deltaX + deltaY) / 2;

      let newWidth: number = oldWidth + slackWidth.current;

      newWidth = Math.max(minWidth, newWidth);

      slackWidth.current += oldWidth - newWidth;

      onResize(newWidth);
    }
  };

  const onStopHandler = () => {
    slackWidth.current = 0;
  };

  return (
    <DraggableCore onDrag={onDragHandler} onStop={onStopHandler}>
      <div className={css.resizer}></div>
    </DraggableCore>
  );
};
