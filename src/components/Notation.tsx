import React, { FC } from "react";
import { PieceColor } from "../enums/PieceColor";
import { getFileIndex, getRankIndex, isLightSquare } from "../utils/chess";
import css from "./Notation.scss";
import classNames from "classnames";
import { DEFAULT_SQUARE_WIDTH } from "../constants/constants";

export interface NotationProps {
  coordinates: string;
  orientation: PieceColor;
  width?: number;
}

export const Notation: FC<NotationProps> = ({
  coordinates,
  orientation,
  width = DEFAULT_SQUARE_WIDTH,
}) => {
  const rankIndex: number = getRankIndex(coordinates);
  const fileIndex: number = getFileIndex(coordinates);

  const isColumn: boolean =
    orientation === PieceColor.WHITE ? rankIndex === 0 : rankIndex === 7;
  const isRow: boolean =
    orientation === PieceColor.WHITE ? fileIndex === 0 : fileIndex === 7;

  if (isColumn && isRow) {
    return renderBottomLeft(coordinates, width);
  }

  if (isColumn) {
    return renderFile(coordinates, width);
  }

  if (isRow) {
    return renderRank(coordinates, width);
  }

  return null;
};

const renderBottomLeft = (coordinates: string, width: number) => {
  return (
    <>
      {renderRank(coordinates, width)}
      {renderFile(coordinates, width)}
    </>
  );
};

const renderFile = (coordinates: string, width: number) => {
  return (
    <div
      data-testid={`notation-file-${coordinates[0]}`}
      style={{
        fontSize: `${width / 6}px`,
        paddingLeft: `${width - width / 6}px`,
      }}
      className={classNames(css.fileNotation, {
        [css.lightSquare]: isLightSquare(coordinates),
      })}
    >
      {coordinates[0]}
    </div>
  );
};

const renderRank = (coordinates: string, width: number) => {
  return (
    <div
      data-testid={`notation-rank-${coordinates[1]}`}
      style={{
        fontSize: `${width / 6}px`,
        paddingRight: `${width - width / 6}px`,
      }}
      className={classNames(css.rankNotation, {
        [css.lightSquare]: isLightSquare(coordinates),
      })}
    >
      {coordinates[1]}
    </div>
  );
};
