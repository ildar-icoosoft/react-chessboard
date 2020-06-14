import React, { FC } from "react";
import css from "./Resizer.scss";
import { DraggableCore, DraggableData } from "react-draggable";

export interface ResizerProps {
  onResize?: (width: number) => void;
}

export const Resizer: FC<ResizerProps> = ({ onResize }) => {
  const onDrag = (_event: any, data: DraggableData) => {
    if (onResize) {
      const deltaX: number = data.deltaX;
      const deltaY: number = data.deltaY;

      const newWidth: number = Math.round((deltaX + deltaY) / 2);

      onResize(newWidth);
    }
  };

  return (
    <DraggableCore onDrag={onDrag}>
      <div className={css.resizer}></div>
    </DraggableCore>
  );
};
