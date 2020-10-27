import React, { FC } from "react";
import { Modal } from "antd";
import "antd/dist/antd.css";
import css from "./PromotionChoice.scss";
import classNames from "classnames";
import { PieceType } from "chess.js";
import { PieceColor } from "../../types/PieceColor";

export interface PromotionChoiceProps {
  showPromotionChoice?: boolean;
  turnColor?: PieceColor;
  onPromotion?: (promotionPiece: Exclude<PieceType, "p">) => void;
}

export const PromotionChoice: FC<PromotionChoiceProps> = ({
  showPromotionChoice = false,
  turnColor = "white",
  onPromotion,
}) => {
  const makePromotionHandler = (promotionPiece: Exclude<PieceType, "p">) => {
    return () => {
      if (onPromotion) {
        onPromotion(promotionPiece);
      }
    };
  };

  return (
    <Modal visible={showPromotionChoice} footer={null} closable={false}>
      <div style={{ textAlign: "center", cursor: "pointer" }}>
        <span
          data-testid={"promotion-q"}
          role="presentation"
          onClick={makePromotionHandler("q")}
        >
          <div
            className={classNames(css.piece, {
              [css.wQ]: turnColor === "white",
              [css.bQ]: turnColor === "black",
            })}
          />
        </span>
        <span
          data-testid={"promotion-r"}
          role="presentation"
          onClick={makePromotionHandler("r")}
        >
          <div
            className={classNames(css.piece, {
              [css.wR]: turnColor === "white",
              [css.bR]: turnColor === "black",
            })}
          />
        </span>
        <span
          data-testid={"promotion-b"}
          role="presentation"
          onClick={makePromotionHandler("b")}
        >
          <div
            className={classNames(css.piece, {
              [css.wB]: turnColor === "white",
              [css.bB]: turnColor === "black",
            })}
          />
        </span>
        <span
          data-testid={"promotion-n"}
          role="presentation"
          onClick={makePromotionHandler("n")}
        >
          <div
            className={classNames(css.piece, {
              [css.wN]: turnColor === "white",
              [css.bN]: turnColor === "black",
            })}
          />
        </span>
      </div>
    </Modal>
  );
};
