import React, { CSSProperties, FC, useEffect, useState } from "react";
import { PieceCode } from "../enums/PieceCode";
import { Transition } from "react-transition-group";
import { SquareTransitionFrom } from "../interfaces/SquareTransitionFrom";
import { TransitionStatus } from "react-transition-group/Transition";
import { PartialRecord } from "../types/PartialRecord";
import { DEFAULT_TRANSITION_DURATION } from "../constants/constants";
import classNames from "classnames";
import css from "./Piece.scss";
import { XYCoordinates } from "../interfaces/XYCoordinates";

export interface PieceProps {
  pieceCode: PieceCode;
  width?: number;
  transitionFrom?: SquareTransitionFrom;
  transitionDuration?: number;
  xYCoordinates?: XYCoordinates;
}

const getDefaultStyle = (
  xYCoordinates: XYCoordinates | undefined
): CSSProperties => {
  if (!xYCoordinates) {
    return {};
  }
  return {
    transform: `translate(${xYCoordinates.x}px, ${xYCoordinates.y}px)`,
  };
};

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
      transform: "translate(0, 0)",
      transition: `transform ${transitionDuration}ms`,
      zIndex: 1,
    },
  };

  return styles[state] || {};
};

export const Piece: FC<PieceProps> = ({
  pieceCode,
  transitionFrom,
  transitionDuration = DEFAULT_TRANSITION_DURATION,
  xYCoordinates,
}) => {
  const [inProp, setInProp] = useState<boolean>(false);

  useEffect(() => {
    if (transitionFrom) {
      setInProp(true);
    }
  }, [transitionFrom]);

  return (
    <Transition in={inProp} timeout={transitionDuration}>
      {(state) => {
        return (
          <div
            className={classNames(css.piece, css[pieceCode])}
            data-testid={`piece-${pieceCode}`}
            style={{
              ...getDefaultStyle(xYCoordinates),
              ...getTransitionStyles(transitionFrom, state, transitionDuration),
            }}
          ></div>
        );
      }}
    </Transition>
  );
};
