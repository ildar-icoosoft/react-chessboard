import { DragObjectWithType } from "react-dnd";
import { DragItemType } from "../enums/DragItemType";
import { PieceCode } from "../enums/PieceCode";

export interface PieceDragObject extends DragObjectWithType {
  type: DragItemType.PIECE;
  pieceCode?: PieceCode;
  coordinates?: string;
}
