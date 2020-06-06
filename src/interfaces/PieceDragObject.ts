import { DragObjectWithType } from "react-dnd";
import { DragItemType } from "../enums/DragItemType";
import { PieceCode } from "../enums/PieceCode";
import { XYCoordinates } from "./XYCoordinates";

export interface PieceDragObject extends DragObjectWithType {
  type: DragItemType.PIECE;
  pieceCode: PieceCode;
  xYCoordinates: XYCoordinates;
}
