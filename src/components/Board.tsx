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
import { Move } from "../interfaces/Move";

export interface BoardProps {
  allowMarkers?: boolean;
  allowMoveFrom?: (pieceCode: PieceCode, coordinates: string) => boolean;
  clickable?: boolean; // allow click-click moves
  check?: boolean; // true for current color, false to unset
  position?: Position | string;
  orientation?: PieceColor;
  draggable?: boolean; // allow moves & premoves to use drag'n drop
  transitionDuration?: number;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  showCoordinates?: boolean;
  showResizer?: boolean;
  occupationSquares?: string[];
  destinationSquares?: string[];
  lastMoveSquares?: string[];
  movableColor?: PieceColor | "both";
  currentPremoveSquares?: string[];
  turnColor?: PieceColor; // turn to play. default is PieceColor.WHITE

  onSquareClick?(coordinates: string): void;

  onDragStart?(event: PieceDragStartEvent): void;

  onDragEnd?(): void;

  onDrop?(event: PieceDropEvent): void;

  onResize?(width: number): void;

  onMove?(move: Move): void;
}

const getCheckSquare = (
  check: boolean,
  position: Position,
  turnColor: PieceColor
): string | undefined => {
  if (!check) {
    return undefined;
  }

  const kingPieceCode =
    turnColor === PieceColor.WHITE
      ? PieceCode.WHITE_KING
      : PieceCode.BLACK_KING;

  for (const coordinates in position) {
    if (position[coordinates] === kingPieceCode) {
      return coordinates;
    }
  }

  return undefined;
};

export const Board: FC<BoardProps> = ({
  allowMarkers = false,
  clickable = false,
  position = {},
  orientation = PieceColor.WHITE,
  draggable = false,
  width = DEFAULT_BOARD_WIDTH,
  minWidth = DEFAULT_BOARD_MIN_WIDTH,
  maxWidth = DEFAULT_BOARD_MAX_WIDTH,
  allowMoveFrom,
  showCoordinates = true,
  showResizer = true,
  transitionDuration = DEFAULT_TRANSITION_DURATION,
  occupationSquares,
  destinationSquares,
  lastMoveSquares,
  currentPremoveSquares,
  check = false,
  turnColor = PieceColor.WHITE,
  movableColor = "both",
  onSquareClick,
  onDragStart,
  onDragEnd,
  onDrop,
  onResize,
  onMove,
}) => {
  let positionObject: Position = {};
  if (isValidFen(position)) {
    positionObject = convertFenToPositionObject(position as string);
  }
  if (isValidPositionObject(position)) {
    positionObject = position as Position;
  }

  const [roundMarkers, setRoundMarkers] = useState<string[]>([]);

  const [selectionSquare, setSelectionSquare] = useState<string | undefined>();

  const handleSquareClick = (coordinates: string): void => {
    if (allowMarkers) {
      setRoundMarkers([]);
    }

    if (onSquareClick) {
      onSquareClick(coordinates);
    }

    if (clickable && (movableColor === "both" || movableColor === turnColor)) {
      if (selectionSquare) {
        if (selectionSquare === coordinates) {
          setSelectionSquare(undefined);
          return;
        }

        if (onMove) {
          onMove({
            from: selectionSquare,
            to: coordinates,
          });
        }
      } else {
        if (!positionObject[coordinates]) {
          setSelectionSquare(undefined);
          return;
        }
        setSelectionSquare(coordinates);
      }
    }

    if (clickable && (movableColor === "both" || movableColor === turnColor)) {
      if (selectionSquare) {
        if (selectionSquare === coordinates) {
          setSelectionSquare(undefined);
          return;
        }
      } else {
        if (!positionObject[coordinates]) {
          setSelectionSquare(undefined);
        } else {
          setSelectionSquare(coordinates);
        }
      }
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

  const checkSquare = getCheckSquare(check, positionObject, turnColor);

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
            selectionSquare={selectionSquare}
            occupationSquares={occupationSquares}
            destinationSquares={destinationSquares}
            lastMoveSquares={lastMoveSquares}
            currentPremoveSquares={currentPremoveSquares}
            checkSquare={checkSquare}
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
