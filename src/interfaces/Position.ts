import { PieceCode } from "../enums/PieceCode";

export interface Position {
  [coordinates: string]: PieceCode;
}
