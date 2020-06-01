import { PieceCode } from "../enums/PieceCode";

export interface PieceDragStartEvent {
  coordinates: string;
  pieceCode: PieceCode;
}
