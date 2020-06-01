import React, { CSSProperties, FC } from "react";
import { PieceCode } from "../enums/PieceCode";
import { getPieceElement } from "../utils/chess";
import { Transition } from "react-transition-group";
import { SquareTransitionFrom } from "../interfaces/SquareTransitionFrom";
import { TransitionStatus } from "react-transition-group/Transition";
import { PartialRecord } from "../types/PartialRecord";
import {
  DEFAULT_SQUARE_WIDTH,
  DEFAULT_TRANSITION_DURATION,
} from "../constants/constants";

export interface PieceProps {
  pieceCode: PieceCode;
  width?: number;
  transitionFrom?: SquareTransitionFrom;
  transitionDuration?: number;
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
    entering: {
      transform: `translate(${transitionFrom.x}px, ${transitionFrom.y}px)`,
    },
    entered: {
      transform: "translate(0, 0)",
      transition: `transform ${transitionDuration}ms`,
      zIndex: 1,
    },
  };

  return styles[state] || {};
};

export const Piece: FC<PieceProps> = ({
  pieceCode,
  width = DEFAULT_SQUARE_WIDTH,
  transitionFrom,
  transitionDuration = DEFAULT_TRANSITION_DURATION,
}) => {
  return (
    <Transition appear={true} in={transitionFrom ? true : false} timeout={0}>
      {(state) => {
        return (
          <div
            className={"piece"}
            data-testid={`piece-${pieceCode}`}
            style={getTransitionStyles(
              transitionFrom,
              state,
              transitionDuration
            )}
          >
            <svg viewBox={`1 1 43 43`} width={width} height={width}>
              <g>{getPieceElement(pieceCode, { width: 45, height: 45 })}</g>
            </svg>
          </div>
        );
      }}
    </Transition>
  );
};
