import React, { FC, useState } from "react";
import css from "./Board.scss";
import {
  DEFAULT_BOARD_MAX_WIDTH,
  DEFAULT_BOARD_MIN_WIDTH,
  DEFAULT_BOARD_WIDTH,
  DEFAULT_TRANSITION_DURATION,
} from "../constants/constants";
import { PieceColor } from "../enums/PieceColor";
import { Position } from "../interfaces/Position";
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
import { Resizer } from "./Resizer";
import {
  convertFenToPositionObject,
  isValidFen,
  isValidPositionObject,
} from "../utils/chess";

export interface BoardProps {
  allowMarkers?: boolean;
  position?: Position | string;
  orientation?: PieceColor;
  draggable?: boolean; // allow moves & premoves to use drag'n drop
  clickable?: boolean; // allow click-click moves
  transitionDuration?: number;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  showCoordinates?: boolean;
  showResizer?: boolean;
  allowMoveFrom?: (pieceCode: PieceCode, coordinates: string) => boolean;
  selectionSquares?: string[];
  occupationSquares?: string[];
  destinationSquares?: string[];
  lastMoveSquares?: string[];
  currentPremoveSquares?: string[];
  checkSquares?: string[];

  onSquareClick?(coordinates: string): void;
  onSelect?(coordinates: string): void;

  onDragStart?(event: PieceDragStartEvent): void;

  onDragEnd?(): void;

  onDrop?(event: PieceDropEvent): void;

  onResize?(width: number): void;
}

export const Board: FC<BoardProps> = ({
  allowMarkers = false,
  position = {},
  orientation = PieceColor.WHITE,
  clickable = false,
  draggable = false,
  width = DEFAULT_BOARD_WIDTH,
  minWidth = DEFAULT_BOARD_MIN_WIDTH,
  maxWidth = DEFAULT_BOARD_MAX_WIDTH,
  allowMoveFrom,
  showCoordinates = true,
  showResizer = true,
  transitionDuration = DEFAULT_TRANSITION_DURATION,
  selectionSquares,
  occupationSquares,
  destinationSquares,
  lastMoveSquares,
  currentPremoveSquares,
  checkSquares,
  onSquareClick,
  onDragStart,
  onDragEnd,
  onDrop,
  onResize,
  onSelect,
}) => {
  let positionObject: Position = {};
  if (isValidFen(position)) {
    positionObject = convertFenToPositionObject(position as string);
  }
  if (isValidPositionObject(position)) {
    positionObject = position as Position;
  }

  const [roundMarkers, setRoundMarkers] = useState<string[]>([]);

  const handleSquareClick = (coordinates: string): void => {
    if (allowMarkers) {
      setRoundMarkers([]);
    }

    if (onSquareClick) {
      onSquareClick(coordinates);
    }

    if (clickable && onSelect) {
      onSelect(coordinates);
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
            allowDrag={allowMoveFrom}
            orientation={orientation}
            position={positionObject}
            width={width}
            selectionSquares={selectionSquares}
            occupationSquares={occupationSquares}
            destinationSquares={destinationSquares}
            lastMoveSquares={lastMoveSquares}
            currentPremoveSquares={currentPremoveSquares}
            checkSquares={checkSquares}
            onClick={handleSquareClick}
            onRightClick={handleSquareRightClick}
            onDrop={onDrop}
            onDragStart={handleDragStart}
            onDragEnd={onDragEnd}
            transitionDuration={transitionDuration}
            roundMarkers={roundMarkers}
          />

          {showCoordinates && <Coords orientation={orientation} />}
          {showResizer && (
            <Resizer
              width={width}
              minWidth={minWidth}
              onResize={onResize}
              maxWidth={maxWidth}
            />
          )}
        </div>
        <PieceDragLayer width={width / 8} />
      </DndProvider>
    </>
  );
};
