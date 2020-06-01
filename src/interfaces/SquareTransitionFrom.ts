import { PieceCode } from "../enums/PieceCode";

export interface SquareTransitionFrom {
  algebraic: string;
  x: number;
  y: number;
  phantomPiece?: PieceCode;
}
