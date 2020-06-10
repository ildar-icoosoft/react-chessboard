import React, { FC } from "react";
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
  types: HighlightedSquareType[];
}

export const HighlightedSquare: FC<CoordsProps> = () => {
  return <div></div>;
};
