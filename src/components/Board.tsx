import React, { FC, useRef, useState } from "react";
import css from "./Board.scss";
import {
  DEFAULT_BOARD_MAX_WIDTH,
  DEFAULT_BOARD_MIN_WIDTH,
  DEFAULT_BOARD_WIDTH,
  DEFAULT_TRANSITION_DURATION,
} from "../constants/constants";
import { PieceColor } from "../enums/PieceColor";
import { Position } from "../interfaces/Position";
import { createDndContext, DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import { PieceDragLayer } from "./PieceDragLayer";
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
import { PieceCode } from "../enums/PieceCode";

// @see https://github.com/react-dnd/react-dnd/issues/186
const dndContext = createDndContext(Backend);

export interface BoardProps {
  /** allow round markers with right click. */
  allowMarkers?: boolean;
  /** true for current color, false to unset */
  check?: boolean;
  /** allow click-click moves */
  clickable?: boolean;
  /** allow moves & premoves to use drag'n drop */
  draggable?: boolean;
  /** squares part of the last move ["c3", "c4"] */
  lastMoveSquares?: string[];
  /** turn to play  */
  turnColor?: PieceColor;
  /** Max width in pixels */
  maxWidth?: number;
  /** Min width in pixels */
  minWidth?: number;
  /** color that can move. white | black | both */
  movableColor?: PieceColor | "both";
  /** called after move */
  onMove?(move: Move): void;
  /** called after resize */
  onResize?(width: number): void;
  /** called after the premove has been set */
  onSetPremove?(
    move: Move,
    playPremove: () => void,
    cancelPremove: () => void
  ): void;
  /** called after the premove has been unset */
  onUnsetPremove?(): void;
  /** board orientation. white | black */
  orientation?: PieceColor;
  /** FEN string or Position object */
  position?: Position | string;
  /** allow premoves for color that can not move */
  premovable?: boolean;
  /** allow resize */
  resizable?: boolean;
  /** include coords attributes */
  showCoordinates?: boolean;
  /** The time in seconds it takes for a piece to slide to the target square */
  transitionDuration?: number;
  /** valid moves. {"a2" ["a3" "a4"] "b1" ["a3" "c3"]} */
  validMoves?: ValidMoves;
  /** don't bind events: the user will never be able to move pieces around */
  viewOnly?: boolean;
  /** board width in pixels */
  width?: number;
}

/**
 * Renders a chess board using React
 */
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
  resizable = false,
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
}: BoardProps) => {
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

  const canMoveWithPiece = (pieceCode: PieceCode): boolean => {
    const pieceColor: PieceColor = getColorFromPieceCode(pieceCode);

    return (
      (movableColor === "both" || pieceColor === movableColor) &&
      ((premovable && movableColor !== "both") || pieceColor === turnColor)
    );
  };

  const isAllowedToClickMove = (): boolean => {
    return (
      !viewOnly &&
      clickable &&
      (premovable || movableColor === "both" || movableColor === turnColor)
    );
  };

  const isAllowedToDragMove = (): boolean => {
    return (
      !viewOnly &&
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
    if (roundMarkers.length) {
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

      if (
        positionObject[coordinates] &&
        canMoveWithPiece(positionObject[coordinates])
      ) {
        setSelectionSquare(coordinates);
        return;
      }

      setSelectionSquare(undefined);

      if (isPremove()) {
        doPremove(selectionSquare, coordinates);
        return;
      }

      if (!isValidMove(selectionSquare, coordinates)) {
        return;
      }

      if (onMove) {
        onMove({
          from: selectionSquare,
          to: coordinates,
        });
      }
    } else {
      if (
        !positionObject[coordinates] ||
        !canMoveWithPiece(positionObject[coordinates])
      ) {
        setSelectionSquare(undefined);
        return;
      }
      setSelectionSquare(coordinates);
    }
  };

  const isPremove = (): boolean => {
    return turnColor !== movableColor && movableColor !== "both";
  };

  const doPremove = (from: string, to: string): void => {
    if (onSetPremove) {
      const premove: Move = {
        from,
        to,
      };
      onSetPremove(premove, makePlayPremoveCallback(premove), cancelPremove);
    }
    setPremoveSquares([from, to]);
  };

  const isValidMove = (from: string, to: string): boolean => {
    return validMoves[from] && validMoves[from].includes(to);
  };

  const handleDrop = (event: PieceDropEvent): void => {
    if (!isAllowedToDragMove()) {
      return;
    }

    if (isPremove()) {
      doPremove(event.from, event.to);
      return;
    }

    if (!isValidMove(event.from, event.to)) {
      return;
    }

    event.disableTransitionInNextPosition();

    if (onMove) {
      onMove({
        from: event.from,
        to: event.to,
      });
    }
  };

  const handleDragStart = (event: PieceDragStartEvent): void => {
    if (roundMarkers.length) {
      setRoundMarkers([]);
    }

    if (premoveSquares.length) {
      cancelPremove();
    }

    if (!isAllowedToDragMove()) {
      return;
    }

    if (canMoveWithPiece(event.pieceCode)) {
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

  const manager = useRef(dndContext);

  return (
    <>
      <DndProvider manager={manager.current.dragDropManager}>
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
            allowDrag={(pieceCode) =>
              isAllowedToDragMove() && canMoveWithPiece(pieceCode)
            }
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
