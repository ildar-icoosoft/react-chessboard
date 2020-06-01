import { PieceDropEvent } from "./PieceDropEvent";

export interface BoardDropEvent extends PieceDropEvent {
  cancelMove(): void;
}
