import React, { FC } from "react";
import css from "./Resizer.scss";
import { DraggableCore } from "react-draggable";

export interface ResizerProps {
  width: number;
  onResize?: (width: number) => void;
}

export const Resizer: FC<ResizerProps> = () => {
  const onStart = (_event: any, data: any) => {
    console.log("onStart", data);
  };

  const onDrag = (_event: any, data: any) => {
    console.log("onDrag", data);
  };

  const onStop = (_event: any, data: any) => {
    console.log("onStop", data);
  };

  return (
    <DraggableCore onStart={onStart} onDrag={onDrag} onStop={onStop}>
      <div className={css.resizer}></div>
    </DraggableCore>
  );
};
