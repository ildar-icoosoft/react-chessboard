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
import { useDrag, useDrop } from "react-dnd";
import { DragItemType } from "../enums/DragItemType";
import { useCombinedRefs } from "../hooks/useCombinedRefs";
import { Identifier } from "dnd-core";
import { DraggablePiece } from "./DraggablePiece";
import { XYCoordinates } from "../interfaces/XYCoordinates";
import { PieceCode } from "../enums/PieceCode";
import { PieceDropEvent } from "../interfaces/PieceDropEvent";
import { PieceDragObject } from "../interfaces/PieceDragObject";
import { XYCoord } from "react-dnd/lib/interfaces/monitors";
import { PieceDragObjectNew } from "../interfaces/PieceDragObjectNew";

export interface CoordinateGridRef {
  getDropHandlerId(): Identifier | null;
  getDragHandlerId(): Identifier | null;
}

export interface CoordinateGridProps {
  orientation?: PieceColor;
  position?: Position;
  width?: number;
  draggable?: boolean;
  allowDrag?: (pieceCode: PieceCode, coordinates: string) => boolean;

  onClick?(coordinates: string): void;
  onRightClick?(coordinates: string): void;
  onDrop?(event: PieceDropEvent): void;
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
      allowDrag,
      onClick,
      onRightClick,
      onDrop,
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

    const [{ dragHandlerId }, dragRef] = useDrag({
      /*canDrag(monitor) {
        const item: PieceDragObjectNew = monitor.getItem();

        if (!item.pieceCode) {
          return false;
        }
        if (!draggable) {
          return false;
        }
        if (allowDrag) {
          return allowDrag(item.pieceCode, item.coordinates as string);
        }
        return true;
      },*/
      item: {
        type: DragItemType.PIECE,
      },
      begin(monitor) {
        const rect: DOMRect = (domRef.current as HTMLDivElement).getBoundingClientRect();

        const coordinates: string = getSquareAlgebraicCoordinates(
          {
            x: (monitor.getClientOffset() as XYCoord).x - rect.left,
            y: (monitor.getClientOffset() as XYCoord).y - rect.top,
          },
          width,
          orientation
        );

        return {
          type: DragItemType.PIECE,
          pieceCode: position[coordinates],
          coordinates,
        } as PieceDragObjectNew;
      },
      collect(monitor) {
        return {
          dragHandlerId: monitor.getHandlerId(),
        };
      },
    });

    const [{ dropHandlerId }, dropRef] = useDrop({
      accept: DragItemType.PIECE,
      drop(item: PieceDragObject, monitor) {
        if (onDrop) {
          const rect: DOMRect = (domRef.current as HTMLDivElement).getBoundingClientRect();

          onDrop({
            sourceCoordinates: getSquareAlgebraicCoordinates(
              item.xYCoordinates,
              width,
              orientation
            ),
            targetCoordinates: getSquareAlgebraicCoordinates(
              {
                x: (monitor.getClientOffset() as XYCoord).x - rect.left,
                y: (monitor.getClientOffset() as XYCoord).y - rect.top,
              },
              width,
              orientation
            ),
            pieceCode: item.pieceCode,
          });
        }
      },
      collect(monitor) {
        return {
          dropHandlerId: monitor.getHandlerId(),
        };
      },
    });

    useImperativeHandle(ref, () => ({
      getDragHandlerId: (): Identifier | null => dragHandlerId,
      getDropHandlerId: (): Identifier | null => dropHandlerId,
    }));

    const allowDragHandler = (
      pieceCode: PieceCode,
      xYCoordinates: XYCoordinates
    ): boolean => {
      if (!allowDrag) {
        return true;
      }

      const algebraicCoordinates: string = getSquareAlgebraicCoordinates(
        xYCoordinates,
        width,
        orientation
      );

      return allowDrag(pieceCode, algebraicCoordinates);
    };

    return (
      <div
        data-testid={"coordinate-grid"}
        className={css.coordinateGrid}
        style={{ width: `${width}px`, height: `${width}px` }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        ref={useCombinedRefs(dragRef, dropRef, domRef)}
      >
        {_toPairs(position).map((pair) => (
          <DraggablePiece
            draggable={draggable}
            allowDrag={allowDrag ? allowDragHandler : undefined}
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
