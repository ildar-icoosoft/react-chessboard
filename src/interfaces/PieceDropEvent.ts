import { PieceCode } from "../enums/PieceCode";

export interface PieceDropEvent {
  sourceCoordinates: string;
  targetCoordinates: string;
  pieceCode: PieceCode;
  cancelMove(): void;
  disableTransitionInNextPosition(): void;
}
