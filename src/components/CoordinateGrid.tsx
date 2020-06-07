import React, {
  forwardRef,
  MouseEvent,
  RefObject,
  useEffect,
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
import { DragSourceMonitor, useDrag, useDrop } from "react-dnd";
import { DragItemType } from "../enums/DragItemType";
import { useCombinedRefs } from "../hooks/useCombinedRefs";
import { Identifier } from "dnd-core";
import { DraggablePiece } from "./DraggablePiece";
import { PieceCode } from "../enums/PieceCode";
import { PieceDropEvent } from "../interfaces/PieceDropEvent";
import { XYCoord } from "react-dnd/lib/interfaces/monitors";
import { PieceDragObject } from "../interfaces/PieceDragObject";
import { getEmptyImage } from "react-dnd-html5-backend";

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

    const calculateDragItem = (monitor: DragSourceMonitor): PieceDragObject => {
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
      };
    };

    const [{ dragHandlerId }, dragRef, preview] = useDrag({
      canDrag(monitor) {
        const item: PieceDragObject = calculateDragItem(monitor);

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
      },
      item: {
        type: DragItemType.PIECE,
      },
      begin(monitor) {
        return calculateDragItem(monitor);
      },
      collect(monitor) {
        return {
          dragHandlerId: monitor.getHandlerId(),
        };
      },
    });

    useEffect(() => {
      preview(getEmptyImage());
    }, []);

    const [{ dropHandlerId }, dropRef] = useDrop({
      accept: DragItemType.PIECE,
      drop(item: PieceDragObject, monitor) {
        if (onDrop) {
          const rect: DOMRect = (domRef.current as HTMLDivElement).getBoundingClientRect();

          onDrop({
            sourceCoordinates: item.coordinates as string,
            targetCoordinates: getSquareAlgebraicCoordinates(
              {
                x: (monitor.getClientOffset() as XYCoord).x - rect.left,
                y: (monitor.getClientOffset() as XYCoord).y - rect.top,
              },
              width,
              orientation
            ),
            pieceCode: item.pieceCode as PieceCode,
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
