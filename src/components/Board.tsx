import React, { FC, useState } from "react";
import css from "./Board.scss";
import {
  DEFAULT_BOARD_WIDTH,
  DEFAULT_TRANSITION_DURATION,
} from "../constants/constants";
import { PieceColor } from "../enums/PieceColor";
import { Position } from "../interfaces/Position";
import { SquareCssClasses } from "../interfaces/SquareCssClasses";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import { PieceDragLayer } from "./PieceDragLayer";
import { PieceCode } from "../enums/PieceCode";
import { PieceDragStartEvent } from "../interfaces/PieceDragStartEvent";
import { PieceDropEvent } from "../interfaces/PieceDropEvent";
import { Coords } from "./Coords";
import {
  CoordinateGrid,
  CoordinateGridRightClickEvent,
} from "./CoordinateGrid";
import { without as _without } from "lodash";

export interface BoardProps {
  allowMarkers?: boolean;
  position?: Position;
  orientation?: PieceColor;
  squareCssClasses?: SquareCssClasses;
  dragStartCssClass?: string[] | string;
  dragEnterSquareCssClass?: string[] | string;
  draggable?: boolean;
  transitionDuration?: number;
  width?: number;
  showNotation?: boolean;
  showCoordinates?: boolean;
  allowDrag?: (pieceCode: PieceCode, coordinates: string) => boolean;
  selectionSquares?: string[];
  occupationSquares?: string[];
  destinationSquares?: string[];
  lastMoveSquares?: string[];
  currentPremoveSquares?: string[];

  onSquareClick?(coordinates: string): void;

  onSquareRightClick?(coordinates: string): void;

  onDragStart?(event: PieceDragStartEvent): void;

  onDragEnterSquare?(coordinates: string): void;

  onDrop?(event: PieceDropEvent): void;

  onMouseEnterSquare?(coordinates: string): void;

  onMouseLeaveSquare?(coordinates: string): void;
}

export const Board: FC<BoardProps> = ({
  allowMarkers = false,
  position = {},
  orientation = PieceColor.WHITE,
  draggable = false,
  width = DEFAULT_BOARD_WIDTH,
  allowDrag,
  showCoordinates = true,
  transitionDuration = DEFAULT_TRANSITION_DURATION,
  selectionSquares,
  occupationSquares,
  destinationSquares,
  lastMoveSquares,
  currentPremoveSquares,
  onSquareClick,
  onDragStart,
  onDrop,
}) => {
  const [roundMarkers, setRoundMarkers] = useState<string[]>([]);

  const handleSquareClick = (coordinates: string): void => {
    if (allowMarkers) {
      setRoundMarkers([]);
    }

    if (onSquareClick) {
      onSquareClick(coordinates);
    }
  };

  const handleDragStart = (event: PieceDragStartEvent): void => {
    if (allowMarkers) {
      setRoundMarkers([]);
    }

    if (onDragStart) {
      onDragStart(event);
    }
  };

  const handleSquareRightClick = (
    event: CoordinateGridRightClickEvent
  ): void => {
    if (allowMarkers) {
      event.mouseEvent.preventDefault();

      if (roundMarkers.includes(event.coordinates)) {
        setRoundMarkers(_without(roundMarkers, event.coordinates));
      } else {
        setRoundMarkers(roundMarkers.concat(event.coordinates));
      }
    }
  };

  return (
    <>
      <DndProvider backend={Backend}>
        <div
          data-testid={"board"}
          className={css.board}
          style={{
            width: `${width}px`,
            height: `${width}px`,
          }}
        >
          <CoordinateGrid
            draggable={draggable}
            allowDrag={allowDrag}
            orientation={orientation}
            position={position}
            width={width}
            selectionSquares={selectionSquares}
            occupationSquares={occupationSquares}
            destinationSquares={destinationSquares}
            lastMoveSquares={lastMoveSquares}
            currentPremoveSquares={currentPremoveSquares}
            onClick={handleSquareClick}
            onRightClick={handleSquareRightClick}
            onDrop={onDrop}
            onDragStart={handleDragStart}
            transitionDuration={transitionDuration}
            roundMarkers={roundMarkers}
          />

          {showCoordinates && <Coords orientation={orientation} />}
        </div>
        <PieceDragLayer width={width / 8} />
      </DndProvider>
    </>
  );
};
