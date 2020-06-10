import React, {
  forwardRef,
  MouseEvent,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Piece } from "./Piece";
import classNames from "classnames";
import css from "./Square.scss";
import { isLightSquare } from "../utils/chess";
import { PieceCode } from "../enums/PieceCode";
import { useDrag, useDrop } from "react-dnd";
import { DragItemType } from "../enums/DragItemType";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useCombinedRefs } from "../hooks/useCombinedRefs";
import { PieceDragObjectOld } from "../interfaces/PieceDragObjectOld";
import { PieceDropEvent } from "../interfaces/PieceDropEvent";
import { PieceDragStartEvent } from "../interfaces/PieceDragStartEvent";
import { Notation } from "./Notation";
import { PieceColor } from "../enums/PieceColor";
import { Identifier } from "dnd-core";
import { XYCoordinates } from "../interfaces/XYCoordinates";
import { SquareTransitionFrom } from "../interfaces/SquareTransitionFrom";
import { PhantomPiece } from "./PhantomPiece";
import { DEFAULT_SQUARE_WIDTH } from "../constants/constants";

export interface SquareRef {
  getDragHandlerId(): Identifier | null;
  getDropHandlerId(): Identifier | null;
  getXYCoordinates(): XYCoordinates;
}

export interface SquareProps {
  allowDrag?: (pieceCode: PieceCode, coordinates: string) => boolean;
  coordinates: string;
  pieceCode?: PieceCode;
  cssClass?: string[] | string;
  transitionFrom?: SquareTransitionFrom;
  dragStartCssClass?: string[] | string;
  dragEnterSquareCssClass?: string[] | string;
  draggable?: boolean;
  width?: number;
  transitionDuration?: number;
  showNotation?: boolean;
  orientation?: PieceColor;

  onSquareClick?(coordinates: string): void;

  onSquareRightClick?(coordinates: string): void;

  onDragStart?(event: PieceDragStartEvent): void;

  onDragEnterSquare?(coordinates: string): void;

  onDrop?(event: PieceDropEvent): void;

  onMouseEnterSquare?(coordinates: string): void;

  onMouseLeaveSquare?(coordinates: string): void;
}

export const Square = forwardRef<SquareRef, SquareProps>(
  (
    {
      allowDrag,
      coordinates,
      transitionDuration,
      draggable = false,
      width = DEFAULT_SQUARE_WIDTH,
      showNotation = true,
      pieceCode,
      cssClass = [],
      dragStartCssClass = [],
      dragEnterSquareCssClass = [],
      orientation = PieceColor.WHITE,
      onSquareClick,
      onSquareRightClick,
      onDragStart,
      onDragEnterSquare,
      onDrop,
      onMouseEnterSquare,
      onMouseLeaveSquare,
      transitionFrom,
    },
    ref
  ) => {
    const [{ isOver, dropHandlerId }, dropRef] = useDrop({
      accept: DragItemType.PIECE,
      drop(item: PieceDragObjectOld) {
        if (onDrop) {
          onDrop({
            sourceCoordinates: item.coordinates,
            targetCoordinates: coordinates,
            pieceCode: item.pieceCode,
          });
        }
      },
      hover(_item: PieceDragObjectOld, monitor) {
        // we could also use HTML onDragEnter event, but for some reason it called twice on beginning of the drag
        if (!monitor.isOver({ shallow: true })) {
          if (onDragEnterSquare) {
            onDragEnterSquare(coordinates);
          }
        }
      },
      collect(monitor) {
        return {
          isOver: monitor.isOver(),
          dropHandlerId: monitor.getHandlerId(),
        };
      },
    });

    const handleSquareClick = (): void => {
      if (onSquareClick) {
        onSquareClick(coordinates);
      }
    };

    const handleContextMenu = (
      event: MouseEvent<HTMLTableDataCellElement>
    ): void => {
      event.preventDefault();

      if (onSquareRightClick) {
        onSquareRightClick(coordinates);
      }
    };

    const handleMouseEnterSquare = (): void => {
      if (onMouseEnterSquare) {
        onMouseEnterSquare(coordinates);
      }
    };

    const handleMouseLeaveSquare = (): void => {
      if (onMouseLeaveSquare) {
        onMouseLeaveSquare(coordinates);
      }
    };

    const isLight = isLightSquare(coordinates);

    const [{ isDragging, dragHandlerId }, dragRef, preview] = useDrag({
      begin(_monitor) {
        if (onDragStart) {
          onDragStart({
            coordinates,
            pieceCode: pieceCode as PieceCode,
          });
        }
      },
      item: {
        type: DragItemType.PIECE,
        pieceCode,
        coordinates,
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        dragHandlerId: monitor.getHandlerId(),
      }),
      canDrag() {
        if (!pieceCode) {
          return false;
        }
        if (allowDrag) {
          return allowDrag(pieceCode, coordinates);
        }
        return draggable;
      },
    });

    const domRef = useRef<HTMLElement>();

    useImperativeHandle(ref, () => ({
      getDragHandlerId: (): Identifier | null => dragHandlerId,
      getDropHandlerId: (): Identifier | null => dropHandlerId,
      getXYCoordinates(): XYCoordinates {
        const el: HTMLElement = domRef.current as HTMLElement;

        // for unit testing where getBoundingClientRect is undefined
        if (!el || !el.getBoundingClientRect) {
          return {
            x: 0,
            y: 0,
          };
        }

        const { x, y } = el.getBoundingClientRect();
        return {
          x: x || 0,
          y: y || 0,
        };
      },
    }));

    useEffect(() => {
      preview(getEmptyImage());
    });

    return (
      <div
        data-testid={`square-${coordinates}`}
        ref={useCombinedRefs(dropRef, dragRef, domRef)}
        style={{ width: `${width}px`, height: `${width}px` }}
        className={classNames(
          css.square,
          cssClass,
          isOver && dragEnterSquareCssClass,
          isDragging && dragStartCssClass,
          {
            [css.light]: isLight,
            [css.dark]: !isLight,
            [css.isDragging]: isDragging,
            [css.isOver]: isOver,
          }
        )}
        onClick={handleSquareClick}
        onContextMenu={handleContextMenu}
        onMouseEnter={handleMouseEnterSquare}
        onMouseLeave={handleMouseLeaveSquare}
      >
        {pieceCode && (
          <Piece
            pieceCode={pieceCode}
            transitionDuration={transitionDuration}
            width={width}
            transitionFrom={transitionFrom}
            key={
              transitionFrom ? `piece-${transitionFrom.algebraic}` : undefined
            }
          />
        )}
        {transitionFrom && transitionFrom.phantomPiece && (
          <PhantomPiece
            pieceCode={transitionFrom.phantomPiece}
            transitionDuration={transitionDuration}
            width={width}
            xYCoordinates={{ x: 0, y: 0 }}
            key={`phantom-piece-${transitionFrom.algebraic}`}
          />
        )}
        {showNotation && (
          <Notation
            coordinates={coordinates}
            orientation={orientation}
            width={width}
          />
        )}
      </div>
    );
  }
);
