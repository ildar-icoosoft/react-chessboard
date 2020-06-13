import React, { CSSProperties, FC, useEffect, useState } from "react";
import { Piece } from "./Piece";
import { PieceCode } from "../enums/PieceCode";
import { SquareTransitionFrom } from "../interfaces/SquareTransitionFrom";
import { XYCoordinates } from "../interfaces/XYCoordinates";
import classNames from "classnames";
import css from "./DraggablePiece.scss";
import { TransitionStatus } from "react-transition-group/Transition";
import { PartialRecord } from "../types/PartialRecord";
import { DEFAULT_TRANSITION_DURATION } from "../constants/constants";
import { Transition } from "react-transition-group";

export interface DraggablePieceProps {
  pieceCode: PieceCode;
  xYCoordinates: XYCoordinates;
  width?: number;
  transitionFrom?: SquareTransitionFrom;
  transitionDuration?: number;
  isDragged?: boolean;
}

const getTransitionStyles = (
  transitionFrom: SquareTransitionFrom | undefined,
  state: TransitionStatus,
  transitionDuration: number
): CSSProperties => {
  if (!transitionFrom) {
    return {};
  }

  const styles: PartialRecord<TransitionStatus, CSSProperties> = {
    exited: {
      transform: `translate(${transitionFrom.x}px, ${transitionFrom.y}px)`,
    },
    entering: {
      transition: `transform ${transitionDuration}ms`,
      zIndex: 10,
    },
  };

  return styles[state] || {};
};

export const DraggablePiece: FC<DraggablePieceProps> = ({
  pieceCode,
  xYCoordinates,
  transitionFrom,
  transitionDuration = DEFAULT_TRANSITION_DURATION,
  isDragged = false,
}) => {
  const [inProp, setInProp] = useState<boolean>(false);

  useEffect(() => {
    // https://github.com/facebook/react/issues/19100
    setTimeout(() => {
      if (transitionFrom) {
        setInProp(true);
      }
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [firstTransitionFrom] = useState<SquareTransitionFrom | undefined>(
    transitionFrom
  );

  return (
    <Transition in={inProp} timeout={transitionDuration}>
      {(state) => {
        return (
          <div
            className={classNames(css.draggablePiece, {
              [css.isDragged]: isDragged,
            })}
            data-testid={`draggable-piece-${pieceCode}`}
            style={{
              transform: `translate(${xYCoordinates.x}px, ${xYCoordinates.y}px)`,
              ...getTransitionStyles(
                firstTransitionFrom,
                state,
                transitionDuration
              ),
            }}
          >
            <Piece pieceCode={pieceCode} />
          </div>
        );
      }}
    </Transition>
  );
};
