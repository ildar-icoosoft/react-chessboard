import { PieceCode } from "../enums/PieceCode";

export interface PieceDropEvent {
  from: string;
  to: string;
  pieceCode: PieceCode;
  disableTransitionInNextPosition(): void;
}
