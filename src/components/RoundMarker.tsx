import React, { FC } from "react";
import { XYCoordinates } from "../interfaces/XYCoordinates";

export interface RoundMarkerProps {
  xYCoordinates: XYCoordinates;
  width?: number;
}

export const RoundMarker: FC<RoundMarkerProps> = ({ xYCoordinates }) => {
  return (
    <div
      data-testid={"round-marker"}
      style={{
        transform: `translate(${xYCoordinates.x}px, ${xYCoordinates.y}px)`,
      }}
    ></div>
  );
};
