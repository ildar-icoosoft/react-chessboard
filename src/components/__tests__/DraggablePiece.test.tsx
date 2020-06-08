import React from "react";
import { PieceCode } from "../../enums/PieceCode";
import { DraggablePiece } from "../DraggablePiece";
import TestRenderer from "react-test-renderer";
import { Piece } from "../Piece";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

jest.useFakeTimers();

describe("DraggablePiece", () => {
  describe("children components", () => {
    it("contains 1 Piece", () => {
      const testInstance = TestRenderer.create(
        <DraggablePiece
          pieceCode={PieceCode.BLACK_QUEEN}
          xYCoordinates={{ x: 0, y: 0 }}
        />
      ).root;

      expect(testInstance.findAllByType(Piece).length).toBe(1);
    });
  });

  describe("children components props", () => {
    describe("Piece", () => {
      it("pieceCode", () => {
        const testInstance = TestRenderer.create(
          <DraggablePiece
            xYCoordinates={{ x: 100, y: 100 }}
            pieceCode={PieceCode.BLACK_QUEEN}
            transitionFrom={{
              algebraic: "e4",
              x: 200,
              y: 300,
              phantomPiece: PieceCode.BLACK_BISHOP,
            }}
            transitionDuration={400}
          />
        ).root;

        const piece: TestRenderer.ReactTestInstance = testInstance.findByType(
          Piece
        );
        expect(piece.props).toEqual({
          pieceCode: PieceCode.BLACK_QUEEN,
        });
      });
    });
  });

  describe("DOM structure", () => {
    it("contains data-testid draggable-piece-{pieceCode}", () => {
      const { queryByTestId, rerender } = render(
        <DraggablePiece
          pieceCode={PieceCode.WHITE_KING}
          xYCoordinates={{ x: 0, y: 0 }}
        />
      );
      expect(
        queryByTestId(`draggable-piece-${PieceCode.WHITE_KING}`)
      ).toBeInTheDocument();

      rerender(
        <DraggablePiece
          pieceCode={PieceCode.WHITE_QUEEN}
          xYCoordinates={{ x: 0, y: 0 }}
        />
      );
      expect(
        queryByTestId(`draggable-piece-${PieceCode.WHITE_QUEEN}`)
      ).toBeInTheDocument();
    });

    it("contains CSS transform style", () => {
      const { getByTestId, rerender } = render(
        <DraggablePiece
          pieceCode={PieceCode.WHITE_KING}
          xYCoordinates={{ x: 0, y: 0 }}
        />
      );

      const el: HTMLElement = getByTestId(
        `draggable-piece-${PieceCode.WHITE_KING}`
      );

      expect(el).toHaveStyle({
        transform: `translate(0px, 0px)`,
      });

      rerender(
        <DraggablePiece
          pieceCode={PieceCode.WHITE_KING}
          xYCoordinates={{ x: 10, y: 20 }}
        />
      );

      expect(el).toHaveStyle({
        transform: `translate(10px, 20px)`,
      });
    });

    it("contains Piece move CSS transition styles", () => {
      const { getByTestId } = render(
        <DraggablePiece
          pieceCode={PieceCode.WHITE_KING}
          xYCoordinates={{ x: 420, y: 120 }}
          transitionFrom={{
            algebraic: "e7",
            x: 240,
            y: 60,
          }}
        />
      );

      const el: HTMLElement = getByTestId(
        `draggable-piece-${PieceCode.WHITE_KING}`
      );

      // @todo
      // this style must be in the first render,
      // but for some reason we don't see the first render in tests
      // expect(el).toHaveStyle({
      //   transform: `translate(240px, 60px)`
      // });

      // right after first render start
      expect(el).toHaveStyle({
        transform: "translate(420px, 120px)",
        transition: "transform 300ms",
        zIndex: 10,
      });

      // transition is finished
      jest.advanceTimersByTime(300);
      expect(el.style.transform).toBe("translate(420px, 120px)");
      expect(el.style.transition).toBe("");
      expect(el.style.zIndex).toBe("");
    });
  });
});
