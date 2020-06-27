import React, { FC, ReactElement, useEffect, useReducer, useRef } from "react";
import { Position } from "../../interfaces/Position";
import {
  DEFAULT_BOARD_WIDTH,
  INITIAL_BOARD_FEN,
} from "../../constants/constants";
import { convertFenToPositionObject, getTurnColor } from "../../utils/chess";
import { PieceColor } from "../../enums/PieceColor";
import { Chess, Move as ChessJsMove, PieceType, Square } from "chess.js";
import {
  getWithMoveValidationInitialState,
  WithMoveValidationAction,
  withMoveValidationReducer,
} from "./WithMoveValidation.reducer";
import { Move } from "../../interfaces/Move";
import { ValidMoves } from "../../types/ValidMoves";
import { Modal } from "antd";
import "antd/dist/antd.css";
import css from "./WithMoveValidation.scss";
import classNames from "classnames";

export interface WithMoveValidationCallbackProps {
  allowMarkers: boolean;
  clickable: boolean;
  check: boolean;
  position: Position;
  draggable: boolean;
  width: number;
  lastMoveSquares: string[];
  turnColor: PieceColor;
  validMoves: ValidMoves;
  viewOnly: boolean;
  movableColor: PieceColor | "both";

  onResize(width: number): void;

  onMove(move: Move): void;
  onSetPremove(
    move: Move,
    playPremove: () => void,
    cancelPremove: () => void
  ): void;
  onUnsetPremove(): void;
}

export interface WithMoveValidationProps {
  initialFen?: string;
  playerVsCompMode?: boolean;

  children(
    callbackProps: WithMoveValidationCallbackProps
  ): ReactElement<any, any> | null;
}

export const WithMoveValidation: FC<WithMoveValidationProps> = ({
  children,
  initialFen = INITIAL_BOARD_FEN,
  playerVsCompMode = false,
}) => {
  const [state, dispatch] = useReducer(
    withMoveValidationReducer,
    getWithMoveValidationInitialState(initialFen, DEFAULT_BOARD_WIDTH)
  );

  const premove = useRef<[Move, () => void, () => void] | null>(null);

  const {
    game,
    position,
    lastMoveSquares,
    width,
    validMoves,
    showPromotionChoice,
  } = state;

  const computerMove = () => {
    const moves = game!.moves({ verbose: true });
    const move = moves[Math.floor(Math.random() * moves.length)];
    if (moves.length > 0) {
      game!.move(move.san);

      dispatch({
        type: WithMoveValidationAction.CHANGE_POSITION,
        payload: {
          lastMove: {
            from: move.from,
            to: move.to,
          },
          position: convertFenToPositionObject(game!.fen()),
        },
      });

      if (premove.current) {
        premove.current[1](); // playPremove()
      }
    }
  };

  useEffect(() => {
    dispatch({
      type: WithMoveValidationAction.SET_GAME,
      payload: new Chess(initialFen),
    });
  }, []);

  const promotionMove = useRef<Move | null>(null);

  const promotion = (promotionPiece: Exclude<PieceType, "p">): void => {
    const move: Move = promotionMove.current as Move;

    const chessJsMove: ChessJsMove | null = game!.move({
      from: move.from as Square,
      to: move.to as Square,
      promotion: promotionPiece,
    });
    if (!chessJsMove) {
      return;
    }

    dispatch({
      type: WithMoveValidationAction.CHANGE_POSITION,
      payload: {
        lastMove: {
          from: move.from,
          to: move.to,
        },
        position: convertFenToPositionObject(game!.fen()),
      },
    });
    dispatch({
      type: WithMoveValidationAction.HIDE_PROMOTION_CHOICE,
      payload: {},
    });

    if (playerVsCompMode) {
      setTimeout(computerMove, 3000);
    }
  };

  const turnColor: PieceColor = getTurnColor(game);

  return (
    <>
      {children({
        check: game ? game.in_check() : false,
        position,
        width,
        allowMarkers: true,
        clickable: true,
        draggable: true,
        movableColor: playerVsCompMode ? PieceColor.WHITE : "both",
        onResize(width: number) {
          dispatch({
            type: WithMoveValidationAction.RESIZE,
            payload: width,
          });
        },
        lastMoveSquares,
        turnColor,
        onMove(move: Move) {
          const moves = game!.moves({ verbose: true });
          for (let i = 0, len = moves.length; i < len; i++) {
            /* eslint-disable-line */
            if (
              moves[i].flags.indexOf("p") !== -1 &&
              moves[i].from === move.from
            ) {
              promotionMove.current = {
                from: move.from,
                to: move.to,
              };
              dispatch({
                type: WithMoveValidationAction.SHOW_PROMOTION_CHOICE,
                payload: {},
              });
              return;
            }
          }

          const chessJsMove: ChessJsMove | null = game!.move(
            move as ChessJsMove
          );
          if (!chessJsMove) {
            return;
          }

          dispatch({
            type: WithMoveValidationAction.CHANGE_POSITION,
            payload: {
              lastMove: {
                from: move.from,
                to: move.to,
              },
              position: convertFenToPositionObject(game!.fen()),
            },
          });

          if (playerVsCompMode) {
            setTimeout(computerMove, 3000);
          }
        },
        validMoves,
        viewOnly: game ? game.game_over() : false,
        onSetPremove(
          move: Move,
          playPremove: () => void,
          cancelPremove: () => void
        ) {
          premove.current = [move, playPremove, cancelPremove];
        },
        onUnsetPremove() {
          premove.current = null;
        },
      })}
      <Modal visible={showPromotionChoice} footer={null} closable={false}>
        <div style={{ textAlign: "center", cursor: "pointer" }}>
          <span role="presentation" onClick={() => promotion("q")}>
            <div
              className={classNames(css.piece, {
                [css.wQ]: turnColor === PieceColor.WHITE,
                [css.bQ]: turnColor === PieceColor.BLACK,
              })}
            />
          </span>
          <span role="presentation" onClick={() => promotion("r")}>
            <div
              className={classNames(css.piece, {
                [css.wR]: turnColor === PieceColor.WHITE,
                [css.bR]: turnColor === PieceColor.BLACK,
              })}
            />
          </span>
          <span role="presentation" onClick={() => promotion("b")}>
            <div
              className={classNames(css.piece, {
                [css.wB]: turnColor === PieceColor.WHITE,
                [css.bB]: turnColor === PieceColor.BLACK,
              })}
            />
          </span>
          <span role="presentation" onClick={() => promotion("n")}>
            <div
              className={classNames(css.piece, {
                [css.wN]: turnColor === PieceColor.WHITE,
                [css.bN]: turnColor === PieceColor.BLACK,
              })}
            />
          </span>
        </div>
      </Modal>
    </>
  );
};
