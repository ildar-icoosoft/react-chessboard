import React, { FC } from "react";
import { XYCoordinates } from "../interfaces/XYCoordinates";
// import css from "./HighlightedSquare.scss";
// import classNames from "classnames";

export enum HighlightedSquareType {
  SELECTION = "selection",
  DESTINATION = "destination",
  OCCUPATION = "selected",
  LAST_MOVE = "lastMove",
  CURRENT_PREMOVE = "currentPremove",
}

export interface CoordsProps {
  xYCoordinates: XYCoordinates;
  types: HighlightedSquareType[];
  width?: number;
}

export const HighlightedSquare: FC<CoordsProps> = () => {
  return <div></div>;
};
