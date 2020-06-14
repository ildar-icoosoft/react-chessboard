import React, { FC, useRef } from "react";
import css from "./Resizer.scss";
import { DraggableCore, DraggableData, DraggableEvent } from "react-draggable";

export interface ResizerProps {
  onResize?: (width: number) => void;
  width: number;
  minWidth: number;
}

export const Resizer: FC<ResizerProps> = ({ onResize, width, minWidth }) => {
  // if mouse position is less than minWidth, then slackWidth contains the difference between minWidth and mouse position
  const slackWidth = useRef<number>(0);

  const onDragHandler = (_event: DraggableEvent, data: DraggableData) => {
    if (onResize) {
      const deltaX: number = data.deltaX;
      const deltaY: number = data.deltaY;

      let newWidth: number = width + (deltaX + deltaY) / 2 - slackWidth.current;

      if (newWidth < minWidth) {
        slackWidth.current = minWidth - newWidth;
        newWidth = minWidth;
      } else {
        slackWidth.current = 0;
      }

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
