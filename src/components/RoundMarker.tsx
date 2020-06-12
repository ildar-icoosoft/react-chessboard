import React, { FC } from "react";
import { XYCoordinates } from "../interfaces/XYCoordinates";

export interface RoundMarkerProps {
  xYCoordinates: XYCoordinates;
  width?: number;
}

export const RoundMarker: FC<RoundMarkerProps> = ({
  xYCoordinates,
  width = 60,
}) => {
  return (
    <circle
      data-testid={"round-marker"}
      stroke="#15781B"
      strokeWidth={width / 16}
      fill="none"
      opacity="1"
      cx={xYCoordinates.x + width / 2}
      cy={xYCoordinates.y + width / 2}
      r={width / 2 - width / 32}
    />
  );
};
