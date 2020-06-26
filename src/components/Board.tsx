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
  getKingSquare,
  getOccupationSquares,
  isValidFen,
  isValidPositionObject,
} from "../utils/chess";
import { Move } from "../interfaces/Move";
import { ValidMoves } from "../types/ValidMoves";

export interface BoardProps {
  allowMarkers?: boolean;
  clickable?: boolean; // allow click-click moves
  check?: boolean; // true for current color, false to unset
  position?: Position | string;
  orientation?: PieceColor;
  draggable?: boolean; // allow moves & premoves to use drag'n drop
  transitionDuration?: number;
  validMoves?: ValidMoves;
  viewOnly?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  showCoordinates?: boolean;
  resizable?: boolean;
  premovable?: boolean;
  lastMoveSquares?: string[];
  movableColor?: PieceColor | "both";
  premoveSquares?: string[];
  turnColor?: PieceColor; // turn to play. default is PieceColor.WHITE

  onResize?(width: number): void;

  onMove?(move: Move): void;
  onSetPremove?(
    move: Move,
    playPremove: () => void,
    cancelPremove: () => void
  ): void;
  onUnsetPremove?(): void;
}

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
  resizable = true,
  transitionDuration = DEFAULT_TRANSITION_DURATION,
  lastMoveSquares,
  check = false,
  turnColor = PieceColor.WHITE,
  movableColor = "both",
  onResize,
  onMove,
  onSetPremove,
  onUnsetPremove,
  validMoves = {},
  viewOnly = false,
  premovable = false,
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
  const [premoveSquares, setPremoveSquares] = useState<string[]>([]);

  const canSelectSquare = (coordinates: string): boolean => {
    if (positionObject[coordinates]) {
      const pieceColor: PieceColor = getColorFromPieceCode(
        positionObject[coordinates]
      );

      if (
        (movableColor === "both" || pieceColor === movableColor) &&
        (premovable || pieceColor === turnColor)
      ) {
        return true;
      }
    }
    return false;
  };

  const isAllowedToClickMove = (): boolean => {
    return !!(
      clickable &&
      (premovable || movableColor === "both" || movableColor === turnColor)
    );
  };

  const isAllowedToDragMove = (): boolean => {
    return !!(
      draggable &&
      (premovable || movableColor === "both" || movableColor === turnColor)
    );
  };

  const makePlayPremoveCallback = (premove: Move) => {
    return () => {
      if (onMove) {
        onMove(premove);
      }
      setPremoveSquares([]);
    };
  };

  const cancelPremove = (): void => {
    if (onUnsetPremove) {
      onUnsetPremove();
    }
    setPremoveSquares([]);
  };

  const handleSquareClick = (coordinates: string): void => {
    if (viewOnly) {
      return;
    }

    if (allowMarkers) {
      setRoundMarkers([]);
    }

    if (premoveSquares.length) {
      cancelPremove();
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

      if (turnColor !== movableColor && movableColor !== "both") {
        if (onSetPremove) {
          const premove: Move = {
            from: selectionSquare,
            to: coordinates,
          };
          onSetPremove(
            premove,
            makePlayPremoveCallback(premove),
            cancelPremove
          );
        }
        setPremoveSquares([selectionSquare, coordinates]);
        return;
      }

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
    if (viewOnly) {
      return;
    }

    if (!isAllowedToDragMove()) {
      return;
    }

    if (turnColor !== movableColor && movableColor !== "both") {
      if (onSetPremove) {
        const premove: Move = {
          from: event.sourceCoordinates,
          to: event.targetCoordinates,
        };
        onSetPremove(premove, makePlayPremoveCallback(premove), cancelPremove);
      }
      setPremoveSquares([event.sourceCoordinates, event.targetCoordinates]);
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
    if (viewOnly) {
      return;
    }

    if (allowMarkers) {
      setRoundMarkers([]);
    }

    if (premoveSquares.length) {
      cancelPremove();
    }

    if (!isAllowedToDragMove()) {
      return;
    }

    if (canSelectSquare(event.coordinates)) {
      setSelectionSquare(event.coordinates);
    }
  };

  const handleDragEnd = (): void => {
    setSelectionSquare(undefined);
  };

  const handleSquareRightClick = (
    event: CoordinateGridRightClickEvent
  ): void => {
    if (viewOnly) {
      return;
    }

    if (allowMarkers) {
      event.mouseEvent.preventDefault();

      if (roundMarkers.includes(event.coordinates)) {
        setRoundMarkers(_without(roundMarkers, event.coordinates));
      } else {
        setRoundMarkers(roundMarkers.concat(event.coordinates));
      }
    }
  };

  const checkSquare = check
    ? getKingSquare(positionObject, turnColor)
    : undefined;
  const destinationSquares =
    selectionSquare && validMoves[selectionSquare]
      ? validMoves[selectionSquare]
      : [];
  const occupationSquares = getOccupationSquares(
    positionObject,
    destinationSquares
  );

  const allowDrag = (pieceCode: PieceCode): boolean => {
    if (viewOnly) {
      return false;
    }

    const pieceColor: PieceColor = getColorFromPieceCode(pieceCode);

    return (
      draggable &&
      (movableColor === "both" || movableColor === pieceColor) &&
      (premovable || pieceColor === turnColor)
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
            premoveSquares={premoveSquares}
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
          {resizable && (
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
