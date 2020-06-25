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
  getColorFromPieceCode,
  isValidFen,
  isValidPositionObject,
} from "../utils/chess";
import { Move } from "../interfaces/Move";
import { ValidMoves } from "../types/ValidMoves";

export interface BoardProps {
  allowMarkers?: boolean;
  allowMoveFrom?: (pieceCode: PieceCode, coordinates: string) => boolean;
  clickable?: boolean; // allow click-click moves
  check?: boolean; // true for current color, false to unset
  position?: Position | string;
  orientation?: PieceColor;
  draggable?: boolean; // allow moves & premoves to use drag'n drop
  transitionDuration?: number;
  validMoves?: ValidMoves;
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
    if (position.hasOwnProperty(coordinates)) {
      if (position[coordinates] === kingPieceCode) {
        return coordinates;
      }
    }
  }

  return undefined;
};

const getOccupationSquares = (
  destinationSquares: string[],
  position: Position
): string[] => {
  return destinationSquares.filter((item) => position[item]);
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
  showCoordinates = true,
  showResizer = true,
  transitionDuration = DEFAULT_TRANSITION_DURATION,
  lastMoveSquares,
  currentPremoveSquares,
  check = false,
  turnColor = PieceColor.WHITE,
  movableColor = "both",
  onSquareClick,
  onDragStart,
  onDrop,
  onDragEnd,
  onResize,
  onMove,
  validMoves = {},
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

  const canSelectSquare = (coordinates: string): boolean => {
    if (positionObject[coordinates]) {
      const pieceColor: PieceColor = getColorFromPieceCode(
        positionObject[coordinates]
      );

      if (pieceColor === turnColor) {
        return true;
      }
    }
    return false;
  };

  const isAllowedToClickMove = (): boolean => {
    return !!(
      clickable &&
      (movableColor === "both" || movableColor === turnColor)
    );
  };

  const isAllowedToDragMove = (): boolean => {
    return !!(
      draggable &&
      (movableColor === "both" || movableColor === turnColor)
    );
  };

  const handleSquareClick = (coordinates: string): void => {
    if (allowMarkers) {
      setRoundMarkers([]);
    }

    if (onSquareClick) {
      onSquareClick(coordinates);
    }

    if (!isAllowedToClickMove()) {
      return;
    }
    if (selectionSquare) {
      if (selectionSquare === coordinates) {
        setSelectionSquare(undefined);
        return;
      }

      if (canSelectSquare(coordinates)) {
        setSelectionSquare(coordinates);
        return;
      }

      setSelectionSquare(undefined);

      if (
        !validMoves[selectionSquare] ||
        !validMoves[selectionSquare].includes(coordinates)
      ) {
        return;
      }

      if (onMove) {
        onMove({
          from: selectionSquare,
          to: coordinates,
        });
      }
    } else {
      if (!canSelectSquare(coordinates)) {
        setSelectionSquare(undefined);
        return;
      }
      setSelectionSquare(coordinates);
    }
  };

  const handleDrop = (event: PieceDropEvent): void => {
    if (onDrop) {
      onDrop(event);
    }

    if (!isAllowedToDragMove()) {
      return;
    }

    if (
      !validMoves[event.sourceCoordinates] ||
      !validMoves[event.sourceCoordinates].includes(event.targetCoordinates)
    ) {
      return;
    }

    event.disableTransitionInNextPosition();

    if (onMove) {
      onMove({
        from: event.sourceCoordinates,
        to: event.targetCoordinates,
      });
    }
  };

  const handleDragStart = (event: PieceDragStartEvent): void => {
    if (allowMarkers) {
      setRoundMarkers([]);
    }

    if (onDragStart) {
      onDragStart(event);
    }

    if (!isAllowedToDragMove()) {
      return;
    }

    if (canSelectSquare(event.coordinates)) {
      setSelectionSquare(event.coordinates);
    }
  };

  const handleDragEnd = (): void => {
    if (onDragEnd) {
      onDragEnd();
    }

    setSelectionSquare(undefined);
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
  const destinationSquares =
    selectionSquare && validMoves[selectionSquare]
      ? validMoves[selectionSquare]
      : [];
  const occupationSquares = getOccupationSquares(
    destinationSquares,
    positionObject
  );

  const allowDrag = (pieceCode: PieceCode): boolean => {
    const pieceColor: PieceColor = getColorFromPieceCode(pieceCode);

    return (
      draggable &&
      (movableColor === "both" || movableColor === turnColor) &&
      pieceColor === turnColor
    );
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
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
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
