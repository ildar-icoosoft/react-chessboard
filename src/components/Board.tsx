import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Rank, RankRef } from "./Rank";
import css from "./Board.scss";
import {
  DEFAULT_BOARD_WIDTH,
  DEFAULT_TRANSITION_DURATION,
  RANK_NAMES,
} from "../constants/constants";
import { PieceColor } from "../enums/PieceColor";
import { Position } from "../interfaces/Position";
import { SquareCssClasses } from "../interfaces/SquareCssClasses";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import { PieceDragLayer } from "./PieceDragLayer";
import { PieceCode } from "../enums/PieceCode";
import { PieceDropEvent } from "../interfaces/PieceDropEvent";
import { PieceDragStartEvent } from "../interfaces/PieceDragStartEvent";
import { useTransitionPieces } from "../hooks/useTransitionPieces";
import { XYCoordinates } from "../interfaces/XYCoordinates";
import { getRankNameFromCoordinates } from "../utils/chess";
import { BoardDropEvent } from "../interfaces/BoardDropEvent";

export interface BoardRef {
  getSquareXYCoordinates(coordinates: string): XYCoordinates;
}

export interface BoardProps {
  position?: Position;
  orientation?: PieceColor;
  squareCssClasses?: SquareCssClasses;
  dragStartCssClass?: string[] | string;
  dragEnterSquareCssClass?: string[] | string;
  draggable?: boolean;
  transitionDuration?: number;
  width?: number;
  showNotation?: boolean;
  allowDrag?: (pieceCode: PieceCode, coordinates: string) => boolean;

  onSquareClick?(coordinates: string): void;

  onSquareRightClick?(coordinates: string): void;

  onDragStart?(event: PieceDragStartEvent): void;

  onDragEnterSquare?(coordinates: string): void;

  onDrop?(event: BoardDropEvent): void;

  onMouseEnterSquare?(coordinates: string): void;

  onMouseLeaveSquare?(coordinates: string): void;
}

export const Board = forwardRef<BoardRef, BoardProps>(
  (
    {
      position = {},
      orientation = PieceColor.WHITE,
      draggable = false,
      width = DEFAULT_BOARD_WIDTH,
      allowDrag,
      showNotation = true,
      squareCssClasses,
      transitionDuration = DEFAULT_TRANSITION_DURATION,
      dragStartCssClass,
      dragEnterSquareCssClass,
      onSquareClick,
      onSquareRightClick,
      onDragStart,
      onDragEnterSquare,
      onDrop,
      onMouseEnterSquare,
      onMouseLeaveSquare,
    },
    ref
  ) => {
    const rankRefs = useRef<Record<string, RankRef | null>>({});

    const getSquareXYCoordinates = (coordinates: string): XYCoordinates => {
      const rankName: string = getRankNameFromCoordinates(coordinates);

      if (!rankRefs.current[rankName]) {
        throw Error(`Square ${coordinates} not found`);
      }

      return (rankRefs.current[rankName] as RankRef).getSquareXYCoordinates(
        coordinates
      );
    };

    useImperativeHandle(ref, () => ({
      getSquareXYCoordinates,
    }));

    let rankNames: string[];
    if (orientation === PieceColor.BLACK) {
      rankNames = RANK_NAMES;
    } else {
      rankNames = RANK_NAMES.slice().reverse();
    }

    const [
      transitionPieces,
      disableTransitionInNextPosition,
      enableTransitionInNextPosition,
    ] = useTransitionPieces(position, getSquareXYCoordinates);

    const handleDrop = (pieceDropEvent: PieceDropEvent): void => {
      if (onDrop) {
        const boardDropEvent: BoardDropEvent = {
          ...pieceDropEvent,
          cancelMove: enableTransitionInNextPosition,
        };

        disableTransitionInNextPosition();
        onDrop(boardDropEvent);
      }
    };

    return (
      <DndProvider backend={Backend}>
        <div
          data-testid={"board-wrapper"}
          className={css.board}
          style={{ width: `${width}px`, height: `${width}px` }}
        >
          {rankNames.map((rankName) => {
            return (
              <Rank
                ref={(el) => (rankRefs.current[rankName] = el)}
                key={rankName}
                allowDrag={allowDrag}
                draggable={draggable}
                transitionDuration={transitionDuration}
                transitionPieces={transitionPieces}
                width={width}
                showNotation={showNotation}
                rankName={rankName}
                position={position}
                squareCssClasses={squareCssClasses}
                dragStartCssClass={dragStartCssClass}
                dragEnterSquareCssClass={dragEnterSquareCssClass}
                orientation={orientation}
                onSquareClick={onSquareClick}
                onSquareRightClick={onSquareRightClick}
                onDragStart={onDragStart}
                onDragEnterSquare={onDragEnterSquare}
                onDrop={handleDrop}
                onMouseEnterSquare={onMouseEnterSquare}
                onMouseLeaveSquare={onMouseLeaveSquare}
              />
            );
          })}
        </div>
        <PieceDragLayer width={width / 8} />
      </DndProvider>
    );
  }
);
