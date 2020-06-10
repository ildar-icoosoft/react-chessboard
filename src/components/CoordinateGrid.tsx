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
import { XYCoord } from "react-dnd/lib/interfaces/monitors";
import { PieceDragObject } from "../interfaces/PieceDragObject";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useTransitionPieces } from "../hooks/useTransitionPieces";
import { BoardDropEvent } from "../interfaces/BoardDropEvent";
import { PieceDragStartEvent } from "../interfaces/PieceDragStartEvent";

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
  transitionDuration?: number;

  onClick?(coordinates: string): void;
  onRightClick?(coordinates: string): void;
  onDrop?(event: BoardDropEvent): void;
  onDragStart?(event: PieceDragStartEvent): void;
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
      transitionDuration,
      onClick,
      onRightClick,
      onDrop,
      onDragStart,
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
        const item: PieceDragObject = calculateDragItem(monitor);

        if (onDragStart) {
          onDragStart({
            coordinates: item.coordinates as string,
            pieceCode: item.pieceCode as PieceCode,
          });
        }

        return item;
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

    const [
      transitionPieces,
      disableTransitionInNextPosition,
      enableTransitionInNextPosition,
    ] = useTransitionPieces(position, (coordinates) =>
      getSquareXYCoordinates(coordinates, width, orientation)
    );

    const [{ dropHandlerId }, dropRef] = useDrop({
      accept: DragItemType.PIECE,
      drop(item: PieceDragObject, monitor) {
        if (onDrop) {
          const rect: DOMRect = (domRef.current as HTMLDivElement).getBoundingClientRect();

          disableTransitionInNextPosition();

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
            cancelMove: enableTransitionInNextPosition,
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
        data-test-transition={JSON.stringify(transitionPieces)}
        className={css.coordinateGrid}
        style={{ width: `${width}px`, height: `${width}px` }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        ref={useCombinedRefs(dragRef, dropRef, domRef)}
      >
        {_toPairs(position).map(([algebraicCoordinates, pieceCode]) => (
          <DraggablePiece
            pieceCode={pieceCode}
            width={width / 8}
            xYCoordinates={getSquareXYCoordinates(
              algebraicCoordinates,
              width,
              orientation
            )}
            transitionDuration={transitionDuration}
            transitionFrom={transitionPieces[algebraicCoordinates]}
            key={algebraicCoordinates}
          />
        ))}
      </div>
    );
  }
);
