import { PieceTransition } from "./PieceTransition";

export interface PositionTransition {
  [coordinates: string]: PieceTransition;
}
