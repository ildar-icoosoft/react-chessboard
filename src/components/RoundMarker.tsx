import React, { FC } from "react";
import { XYCoordinates } from "../interfaces/XYCoordinates";

export interface RoundMarkerProps {
  xYCoordinates: XYCoordinates;
  width?: number;
}

export const RoundMarker: FC<RoundMarkerProps> = () => {
  return <div></div>;
};
