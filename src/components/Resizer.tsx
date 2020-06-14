import React, { FC, useRef } from "react";
import css from "./Resizer.scss";
import { DraggableCore, DraggableData, DraggableEvent } from "react-draggable";

export interface ResizerProps {
  onResize?: (width: number) => void;
  width: number;
  minWidth: number;
}

export const Resizer: FC<ResizerProps> = ({ onResize, width, minWidth }) => {
  const diffWithMinWidth = useRef<number>(0);

  const onDrag = (_event: DraggableEvent, data: DraggableData) => {
    if (onResize) {
      const deltaX: number = data.deltaX;
      const deltaY: number = data.deltaY;

      let newWidth: number =
        width + (deltaX + deltaY) / 2 - diffWithMinWidth.current;

      if (newWidth < minWidth) {
        diffWithMinWidth.current = minWidth - newWidth;
        newWidth = minWidth;
      } else {
        diffWithMinWidth.current = 0;
      }

      onResize(newWidth);
    }
  };

  return (
    <DraggableCore onDrag={onDrag}>
      <div className={css.resizer}></div>
    </DraggableCore>
  );
};
