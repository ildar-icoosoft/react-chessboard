import { FILE_NAMES, RANK_NAMES } from "../constants/constants";
import { PieceColor } from "../enums/PieceColor";
import { PieceCode } from "../enums/PieceCode";
import { SquareWithDistance } from "../interfaces/SquareWithDistance";
import { Position } from "../interfaces/Position";
import { without as _without } from "lodash";
import { XYCoordinates } from "../interfaces/XYCoordinates";

/**
 * @param a1-h8
 * @return true if the Chess square is light
 */
export const isLightSquare = (coordinates: string) => {
  const fileIndex: number = getFileIndex(coordinates);
  const rankIndex: number = getRankIndex(coordinates);

  return Boolean((fileIndex + rankIndex) % 2);
};

/**
 * @param a1-h8
 * @return file index: 0-7
 */
export const getFileIndex = (coordinates: string): number => {
  return FILE_NAMES.indexOf(getFileNameFromCoordinates(coordinates));
};

/**
 * @param a1-h8
 * @return rank index: 0-7
 */
export const getRankIndex = (coordinates: string): number => {
  return RANK_NAMES.indexOf(getRankNameFromCoordinates(coordinates));
};

/**
 * @param a1-h8
 * @return rank name: 1-8
 */
export const getRankNameFromCoordinates = (coordinates: string): string => {
  return coordinates[1];
};

/**
 * @param a1-h8
 * @return rank name: a-h
 */
export const getFileNameFromCoordinates = (coordinates: string): string => {
  return coordinates[0];
};

/**
 * @param pieceCode (ie: wP, bK, wQ, etc)
 * @return PieceColor
 */
export const getColorFromPieceCode = (pieceCode: PieceCode): PieceColor => {
  const pieceColorMap: Record<string, PieceColor> = {
    w: PieceColor.WHITE,
    b: PieceColor.BLACK,
  };

  return pieceColorMap[pieceCode[0]];
};

export const getDistanceBetweenSquares = (
  sourceCoordinates: string,
  targetCoordinates: string
): number => {
  const sourceRankIndex = getRankIndex(sourceCoordinates);
  const targetRankIndex = getRankIndex(targetCoordinates);

  const sourceFileIndex = getFileIndex(sourceCoordinates);
  const targetFileIndex = getFileIndex(targetCoordinates);

  const rankDistance: number = Math.abs(sourceRankIndex - targetRankIndex);

  const fileDistance: number = Math.abs(sourceFileIndex - targetFileIndex);

  return rankDistance ** 2 + fileDistance ** 2;
};

/**
 * @param sourceSquare a1-h8
 * @param targetSquares Array of coordinates a1-h8
 * @return Coordinates of nearest squares in targetSquares list
 */
export const getNearestSquare = (
  sourceSquare: string,
  targetSquares: string[]
): string | undefined => {
  const distances: SquareWithDistance[] = targetSquares.map((targetSquare) => ({
    coordinates: targetSquare,
    distance: getDistanceBetweenSquares(sourceSquare, targetSquare),
  }));

  distances.sort((a, b) => a.distance - b.distance);

  if (distances.length) {
    return distances[0].coordinates;
  }
  return undefined;
};

export const getPieceCoordinatesFromPosition = (
  pieceCode: PieceCode,
  position: Position
): string[] =>
  Object.entries(position)
    .filter(([_key, value]) => pieceCode === value)
    .map(([key]) => key);

export const getPositionDiff = (
  currentPosition: Position,
  previousPosition: Position
): Record<string, string> => {
  previousPosition = { ...previousPosition };

  const result: Record<string, string> = {};

  for (const currentPositionSquare in currentPosition) {
    const pieceCode: PieceCode = currentPosition[currentPositionSquare];

    const previousPositionPieceSquares: string[] = getPieceCoordinatesFromPosition(
      pieceCode,
      previousPosition
    );

    if (previousPositionPieceSquares.includes(currentPositionSquare)) {
      continue;
    }

    const currentPositionPieceSquares: string[] = getPieceCoordinatesFromPosition(
      pieceCode,
      currentPosition
    );

    const nearestSquare: string | undefined = getNearestSquare(
      currentPositionSquare,
      _without(previousPositionPieceSquares, ...currentPositionPieceSquares)
    );

    if (nearestSquare) {
      result[currentPositionSquare] = nearestSquare;
      delete previousPosition[nearestSquare];
    }
  }

  return result;
};

export const getSquareXYCoordinates = (
  algebraicCoordinates: string,
  boardWidth: number,
  orientation: PieceColor
): XYCoordinates => {
  const fileIndex: number = getFileIndex(algebraicCoordinates);
  const rankIndex: number = getRankIndex(algebraicCoordinates);

  const squareWidth: number = boardWidth / 8;

  return {
    x:
      orientation === PieceColor.WHITE
        ? fileIndex * squareWidth
        : (7 - fileIndex) * squareWidth,
    y:
      orientation === PieceColor.WHITE
        ? (7 - rankIndex) * squareWidth
        : rankIndex * squareWidth,
  };
};

export const getSquareAlgebraicCoordinates = (
  xYCoordinates: XYCoordinates,
  boardWidth: number,
  orientation: PieceColor
): string => {
  const squareWidth: number = boardWidth / 8;

  let fileIndex: number = Math.floor(xYCoordinates.x / squareWidth);
  if (orientation === PieceColor.BLACK) {
    fileIndex = 7 - fileIndex;
  }

  let rankIndex: number = Math.floor(xYCoordinates.y / squareWidth);
  if (orientation === PieceColor.WHITE) {
    rankIndex = 7 - rankIndex;
  }

  return FILE_NAMES[fileIndex] + RANK_NAMES[rankIndex];
};
