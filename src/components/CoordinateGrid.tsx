import React, {
  forwardRef,
  MouseEvent,
  RefObject,
  useImperativeHandle,
  useRef,
} from "react";
import { PieceColor } from "../enums/PieceColor";
import { Position } from "../interfaces/Position";
import { toPairs as _toPairs } from "lodash";
import css from "./CoordinateGrid.scss";
import { DEFAULT_BOARD_WIDTH } from "../constants/constants";
import {
  getSquareAlgebraicCoordinates,
  getSquareXYCoordinates,
} from "../utils/chess";
import { useDrop } from "react-dnd";
import { DragItemType } from "../enums/DragItemType";
import { useCombinedRefs } from "../hooks/useCombinedRefs";
import { Identifier } from "dnd-core";
import { DraggablePiece } from "./DraggablePiece";
import { XYCoordinates } from "../interfaces/XYCoordinates";
import { isFunction as _isFunction } from "lodash";
import { PieceCode } from "../enums/PieceCode";

export interface CoordinateGridRef {
  getDropHandlerId(): Identifier | null;
}

export interface CoordinateGridProps {
  orientation?: PieceColor;
  position?: Position;
  width?: number;
  draggable?:
    | ((pieceCode: PieceCode, coordinates: string) => boolean)
    | boolean;

  onClick?(coordinates: string): void;
  onRightClick?(coordinates: string): void;
}

export const CoordinateGrid = forwardRef<
  CoordinateGridRef,
  CoordinateGridProps
>(
  (
    {
      position = {},
      width = DEFAULT_BOARD_WIDTH,
      orientation = PieceColor.WHITE,
      draggable = false,
      onClick,
      onRightClick,
    },
    ref
  ) => {
    const domRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const handleClick = (event: MouseEvent): void => {
      if (onClick) {
        const rect: DOMRect = (domRef.current as HTMLDivElement).getBoundingClientRect();

        const coordinates: string = getSquareAlgebraicCoordinates(
          {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          },
          width,
          orientation
        );

        onClick(coordinates);
      }
    };

    const handleContextMenu = (event: MouseEvent): void => {
      event.preventDefault();

      if (onRightClick) {
        const rect: DOMRect = (domRef.current as HTMLDivElement).getBoundingClientRect();

        const coordinates: string = getSquareAlgebraicCoordinates(
          {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          },
          width,
          orientation
        );

        onRightClick(coordinates);
      }
    };

    const [{ dropHandlerId }, dropRef] = useDrop({
      accept: DragItemType.PIECE,
      collect(monitor) {
        return {
          dropHandlerId: monitor.getHandlerId(),
        };
      },
    });

    useImperativeHandle(ref, () => ({
      getDropHandlerId: (): Identifier | null => dropHandlerId,
    }));

    const draggableHandler = (
      pieceCode: PieceCode,
      xYCoordinates: XYCoordinates
    ): boolean => {
      if (!_isFunction(draggable)) {
        return draggable;
      }

      const algebraicCoordinates: string = getSquareAlgebraicCoordinates(
        xYCoordinates,
        width,
        orientation
      );

      return draggable(pieceCode, algebraicCoordinates);
    };

    return (
      <div
        data-testid={"coordinate-grid"}
        className={css.coordinateGrid}
        style={{ width: `${width}px`, height: `${width}px` }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        ref={useCombinedRefs(dropRef, domRef)}
      >
        {_toPairs(position).map((pair) => (
          <DraggablePiece
            draggable={draggableHandler}
            pieceCode={pair[1]}
            width={width / 8}
            xYCoordinates={getSquareXYCoordinates(pair[0], width, orientation)}
            key={pair[0]}
          />
        ))}
      </div>
    );
  }
);
