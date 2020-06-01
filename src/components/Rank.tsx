import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Square, SquareRef } from "./Square";
import { DEFAULT_BOARD_WIDTH, FILE_NAMES } from "../constants/constants";
import { PieceColor } from "../enums/PieceColor";
import { Position } from "../interfaces/Position";
import { SquareCssClasses } from "../interfaces/SquareCssClasses";
import { PieceCode } from "../enums/PieceCode";
import { PieceDropEvent } from "../interfaces/PieceDropEvent";
import css from "./Rank.scss";
import { PieceDragStartEvent } from "../interfaces/PieceDragStartEvent";
import { XYCoordinates } from "../interfaces/XYCoordinates";
import { SquareTransitionFrom } from "../interfaces/SquareTransitionFrom";

export interface RankRef {
  getSquareXYCoordinates(coordinates: string): XYCoordinates;
}

export interface RankProps {
  rankName: string;
  position?: Position;
  orientation?: PieceColor;
  squareCssClasses?: SquareCssClasses;
  dragStartCssClass?: string[] | string;
  dragEnterSquareCssClass?: string[] | string;
  draggable?: boolean;
  width?: number;
  showNotation?: boolean;
  transitionDuration?: number;
  transitionPieces?: Record<string, SquareTransitionFrom>;
  allowDrag?: (pieceCode: PieceCode, coordinates: string) => boolean;

  onSquareClick?(coordinates: string): void;

  onSquareRightClick?(coordinates: string): void;

  onDragStart?(event: PieceDragStartEvent): void;

  onDragEnterSquare?(coordinates: string): void;

  onDrop?(event: PieceDropEvent): void;

  onMouseEnterSquare?(coordinates: string): void;

  onMouseLeaveSquare?(coordinates: string): void;
}

export const Rank = forwardRef<RankRef, RankProps>(
  (
    {
      draggable = false,
      width = DEFAULT_BOARD_WIDTH,
      showNotation = true,
      rankName,
      position = {},
      squareCssClasses = {},
      dragStartCssClass,
      dragEnterSquareCssClass,
      orientation = PieceColor.WHITE,
      transitionDuration,
      transitionPieces = {},
      allowDrag,
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
    const squareRefs = useRef<Record<string, SquareRef | null>>({});

    useImperativeHandle(ref, () => ({
      getSquareXYCoordinates(coordinates: string): XYCoordinates {
        if (!squareRefs.current[coordinates]) {
          throw Error(`Square ${coordinates} not found`);
        }

        return (squareRefs.current[
          coordinates
        ] as SquareRef).getXYCoordinates();
      },
    }));

    let fileNames: string[];
    if (orientation === PieceColor.WHITE) {
      fileNames = FILE_NAMES;
    } else {
      fileNames = FILE_NAMES.slice().reverse();
    }

    return (
      <div
        data-testid={`rank-${rankName}`}
        className={css.rank}
        style={{ width: `${width}px` }}
      >
        {fileNames.map((fileName) => {
          const coordinates: string = fileName + rankName;

          return (
            <Square
              ref={(el) => (squareRefs.current[coordinates] = el)}
              allowDrag={allowDrag}
              coordinates={coordinates}
              transitionDuration={transitionDuration}
              transitionFrom={transitionPieces[coordinates]}
              draggable={draggable}
              width={width / 8}
              showNotation={showNotation}
              key={fileName}
              pieceCode={position[coordinates]}
              cssClass={squareCssClasses[coordinates]}
              dragStartCssClass={dragStartCssClass}
              dragEnterSquareCssClass={dragEnterSquareCssClass}
              orientation={orientation}
              onSquareClick={onSquareClick}
              onSquareRightClick={onSquareRightClick}
              onDragStart={onDragStart}
              onDragEnterSquare={onDragEnterSquare}
              onDrop={onDrop}
              onMouseEnterSquare={onMouseEnterSquare}
              onMouseLeaveSquare={onMouseLeaveSquare}
            />
          );
        })}
      </div>
    );
  }
);
