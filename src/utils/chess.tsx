import { FILE_NAMES, RANK_NAMES } from "../constants/constants";
import { PieceColor } from "../enums/PieceColor";
import { PieceCode } from "../enums/PieceCode";
import { SquareWithDistance } from "../interfaces/SquareWithDistance";
import { Position } from "../interfaces/Position";
import {
  without as _without,
  isString as _isString,
  isObject as _isObject,
} from "lodash";
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

export const convertFenToPositionObject = (fen: string): Position | null => {
  if (!isValidFen(fen)) return null;
  // cut off any move, castling, etc info from the end
  // we're only interested in position information
  fen = fen.replace(/ .+$/, "");

  let rows = fen.split("/");
  let position: Position = {};

  let currentRow = 8;
  for (let i = 0; i < 8; i++) {
    let row = rows[i].split("");
    let colIdx = 0;

    // loop through each character in the FEN section
    for (let j = 0; j < row.length; j++) {
      // number / empty squares
      if (row[j].search(/[1-8]/) !== -1) {
        let numEmptySquares = parseInt(row[j], 10);
        colIdx = colIdx + numEmptySquares;
      } else {
        // piece
        let square = FILE_NAMES[colIdx] + currentRow;
        position[square] = fenToPieceCode(row[j]);
        colIdx = colIdx + 1;
      }
    }

    currentRow = currentRow - 1;
  }

  return position;
};

// convert FEN piece code to bP, wK, etc
const fenToPieceCode = (piece: string): PieceCode => {
  // black piece
  if (piece.toLowerCase() === piece) {
    return ("b" + piece.toUpperCase()) as PieceCode;
  }

  // white piece
  return ("w" + piece.toUpperCase()) as PieceCode;
};

const expandFenEmptySquares = (fen: string): string => {
  return fen
    .replace(/8/g, "11111111")
    .replace(/7/g, "1111111")
    .replace(/6/g, "111111")
    .replace(/5/g, "11111")
    .replace(/4/g, "1111")
    .replace(/3/g, "111")
    .replace(/2/g, "11");
};

export const isValidFen = (fen: string) => {
  if (!_isString(fen)) return false;

  // cut off any move, castling, etc info from the end
  // we're only interested in position information
  fen = fen.replace(/ .+$/, "");

  // expand the empty square numbers to just 1s
  fen = expandFenEmptySquares(fen);

  // FEN should be 8 sections separated by slashes
  let chunks = fen.split("/");
  if (chunks.length !== 8) return false;

  // check each section
  for (let i = 0; i < 8; i++) {
    if (chunks[i].length !== 8 || chunks[i].search(/[^kqrnbpKQRNBP1]/) !== -1) {
      return false;
    }
  }

  return true;
};

const isValidSquare = (square: string): boolean => {
  return _isString(square) && square.search(/^[a-h][1-8]$/) !== -1;
};

const isValidPieceCode = (code: string): boolean => {
  return _isString(code) && code.search(/^[bw][KQRNBP]$/) !== -1;
};

export const isValidPositionObject = (position: Position): boolean => {
  if (!_isObject(position)) {
    return false;
  }

  for (const i in position) {
    if (!position.hasOwnProperty(i)) continue;

    if (!isValidSquare(i) || !isValidPieceCode(position[i])) {
      return false;
    }
  }
  return true;
};
