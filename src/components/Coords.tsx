import React, { FC } from "react";
import { PieceColor } from "../enums/PieceColor";
import { FILE_NAMES, RANK_NAMES } from "../constants/constants";
import css from "./Coords.scss";
import classNames from "classnames";

export interface CoordsProps {
  orientation?: PieceColor;
}

const getOrientationCssClass = (orientation: PieceColor) => {
  if (orientation === PieceColor.WHITE) {
    return "white";
  }
  return "black";
};

export const Coords: FC<CoordsProps> = ({ orientation = PieceColor.WHITE }) => {
  return (
    <>
      <div
        data-testid={"coords-ranks"}
        className={classNames(
          css.coords,
          css.ranks,
          css[getOrientationCssClass(orientation)]
        )}
      >
        {RANK_NAMES.map((item) => (
          <div key={item} className={css.coord}>
            {item}
          </div>
        ))}
      </div>
      <div
        data-testid={"coords-files"}
        className={classNames(
          css.coords,
          css.files,
          css[getOrientationCssClass(orientation)]
        )}
      >
        {FILE_NAMES.map((item) => (
          <div key={item} className={css.coord}>
            {item}
          </div>
        ))}
      </div>
    </>
  );
};
