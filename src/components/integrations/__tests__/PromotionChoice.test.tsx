import { PromotionChoice } from "../PromotionChoice";
import TestRenderer from "react-test-renderer";
import React from "react";
import { Modal } from "antd";
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

describe("PromotionChoice", () => {
  describe("children components", () => {
    it("contains 1 Modal", () => {
      const testRenderer = TestRenderer.create(<PromotionChoice />);
      const testInstance = testRenderer.root;

      expect(testInstance.findAllByType(Modal).length).toBe(1);
    });
  });

  describe("children components props", () => {
    it("Modal", () => {
      const testRenderer = TestRenderer.create(<PromotionChoice />);
      const testInstance = testRenderer.root;

      const modal: TestRenderer.ReactTestInstance = testInstance.findByType(
        Modal
      );

      expect(modal.props.visible).toBe(false);

      testRenderer.update(<PromotionChoice showPromotionChoice={true} />);

      expect(modal.props.visible).toBe(true);
    });
  });

  describe("Events", () => {
    it("onPromotion", () => {
      // onPromotion?: (promotionPiece: Exclude<PieceType, "p">) => void;
      const onPromotion = jest.fn();

      const { getByTestId } = render(
        <PromotionChoice showPromotionChoice={true} onPromotion={onPromotion} />
      );
      const queenPromotion = getByTestId("promotion-q");
      const rookPromotion = getByTestId("promotion-r");
      const bishopPromotion = getByTestId("promotion-b");
      const knightPromotion = getByTestId("promotion-n");

      fireEvent.click(queenPromotion);
      fireEvent.click(rookPromotion);
      fireEvent.click(bishopPromotion);
      fireEvent.click(knightPromotion);

      expect(onPromotion).toBeCalledTimes(4);

      expect(onPromotion).nthCalledWith(1, "q");
      expect(onPromotion).nthCalledWith(2, "r");
      expect(onPromotion).nthCalledWith(3, "b");
      expect(onPromotion).nthCalledWith(4, "n");
    });
  });

  describe("DOM structure", () => {
    it("should contain data-testid promotion-q, promotion-r, promotion-b, promotion-n", () => {
      const { queryByTestId } = render(
        <PromotionChoice showPromotionChoice={true} />
      );
      expect(queryByTestId("promotion-q")).toBeInTheDocument();
      expect(queryByTestId("promotion-r")).toBeInTheDocument();
      expect(queryByTestId("promotion-b")).toBeInTheDocument();
      expect(queryByTestId("promotion-n")).toBeInTheDocument();
    });
  });
});
