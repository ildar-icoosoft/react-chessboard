import React from "react";
import { Piece } from "../Piece";
import TestRenderer from "react-test-renderer";
import { PieceCode } from "../../enums/PieceCode";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

jest.useFakeTimers();

describe("Piece", () => {
  it("Snapshot", () => {
    const tree = TestRenderer.create(
      <Piece pieceCode={PieceCode.WHITE_KING} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe("DOM structure", () => {
    it("contains data-testid piece-{pieceCode}", () => {
      const { queryByTestId, rerender } = render(
        <Piece pieceCode={PieceCode.WHITE_KING} />
      );
      expect(
        queryByTestId(`piece-${PieceCode.WHITE_KING}`)
      ).toBeInTheDocument();

      rerender(<Piece pieceCode={PieceCode.WHITE_QUEEN} />);
      expect(
        queryByTestId(`piece-${PieceCode.WHITE_QUEEN}`)
      ).toBeInTheDocument();
    });

    it("transform style", () => {
      const { getByTestId, rerender } = render(
        <Piece
          pieceCode={PieceCode.WHITE_KING}
          transitionFrom={{
            algebraic: "e2",
            x: 100,
            y: 100,
          }}
        />
      );

      const el: HTMLElement = getByTestId(`piece-${PieceCode.WHITE_KING}`);

      expect(el).toHaveStyle({
        transform: `translate(100px, 100px)`,
      });

      jest.runAllTimers();

      expect(el).toHaveStyle({
        transform: `translate(0, 0)`,
      });

      rerender(<Piece pieceCode={PieceCode.WHITE_KING} />);
      expect(el.style.transform).toBe("");

      rerender(
        <Piece
          pieceCode={PieceCode.WHITE_KING}
          transitionFrom={{
            algebraic: "e2",
            x: 200,
            y: 200,
          }}
        />
      );

      expect(el).toHaveStyle({
        transform: `translate(200px, 200px)`,
      });
    });

    it("transition style", () => {
      const { getByTestId, rerender } = render(
        <Piece
          pieceCode={PieceCode.WHITE_KING}
          transitionFrom={{
            algebraic: "e2",
            x: 100,
            y: 100,
          }}
        />
      );

      const el: HTMLElement = getByTestId(`piece-${PieceCode.WHITE_KING}`);

      jest.runAllTimers();

      expect(el).toHaveStyle({
        transition: `transform 300ms`,
      });

      rerender(
        <Piece
          pieceCode={PieceCode.WHITE_KING}
          transitionFrom={{
            algebraic: "e2",
            x: 100,
            y: 100,
          }}
          transitionDuration={1000}
        />
      );

      expect(el).toHaveStyle({
        transition: `transform 1000ms`,
      });

      rerender(
        <Piece pieceCode={PieceCode.WHITE_KING} transitionDuration={1000} />
      );

      // transition style must be only if transitionFrom prop is passed
      expect(el.style.transition).toBe("");
    });
  });
});
