import { PieceCode } from "../enums/PieceCode";
import { Position } from "../interfaces/Position";

export const startPosition: Position = {
  a2: PieceCode.WHITE_PAWN,
  b2: PieceCode.WHITE_PAWN,
  c2: PieceCode.WHITE_PAWN,
  d2: PieceCode.WHITE_PAWN,
  e2: PieceCode.WHITE_PAWN,
  f2: PieceCode.WHITE_PAWN,
  g2: PieceCode.WHITE_PAWN,
  h2: PieceCode.WHITE_PAWN,
  a1: PieceCode.WHITE_ROOK,
  h1: PieceCode.WHITE_ROOK,
  b1: PieceCode.WHITE_KNIGHT,
  g1: PieceCode.WHITE_KNIGHT,
  c1: PieceCode.WHITE_BISHOP,
  f1: PieceCode.WHITE_BISHOP,
  d1: PieceCode.WHITE_QUEEN,
  e1: PieceCode.WHITE_KING,
  a7: PieceCode.BLACK_PAWN,
  b7: PieceCode.BLACK_PAWN,
  c7: PieceCode.BLACK_PAWN,
  d7: PieceCode.BLACK_PAWN,
  e7: PieceCode.BLACK_PAWN,
  f7: PieceCode.BLACK_PAWN,
  g7: PieceCode.BLACK_PAWN,
  h7: PieceCode.BLACK_PAWN,
  a8: PieceCode.BLACK_ROOK,
  h8: PieceCode.BLACK_ROOK,
  b8: PieceCode.BLACK_KNIGHT,
  g8: PieceCode.BLACK_KNIGHT,
  c8: PieceCode.BLACK_BISHOP,
  f8: PieceCode.BLACK_BISHOP,
  d8: PieceCode.BLACK_QUEEN,
  e8: PieceCode.BLACK_KING,
};

export const RANK_NAMES: string[] = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const FILE_NAMES: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const DEFAULT_TRANSITION_DURATION: number = 300;
export const DEFAULT_BOARD_WIDTH: number = 480;
export const DEFAULT_BOARD_MIN_WIDTH: number = 160;
export const DEFAULT_SQUARE_WIDTH: number = 60;
