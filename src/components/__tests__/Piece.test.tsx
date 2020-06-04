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

    it("contains Piece move CSS transition styles", () => {
      const { getByTestId } = render(
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

      // @todo
      // this style must be in the first render,
      // but for some reason we don't see the first render in tests
      // expect(el).toHaveStyle({
      //   transform: `translate(100px, 100px)`
      // });

      // right after first render start
      expect(el).toHaveStyle({
        transform: `translate(0, 0)`,
        transition: `transform 300ms`,
        zIndex: 1,
      });

      // transition is finished
      jest.advanceTimersByTime(300);
      expect(el.style.transform).toBe("");
      expect(el.style.transition).toBe("");
      expect(el.style.zIndex).toBe("");
    });
  });

  it("contains width and height styles", () => {
    const { getByTestId, rerender } = render(
      <Piece pieceCode={PieceCode.WHITE_KING} />
    );

    const el: HTMLElement = getByTestId(`piece-${PieceCode.WHITE_KING}`);
    expect(el).toHaveStyle({
      width: "60px",
      height: "60px",
    });

    rerender(<Piece pieceCode={PieceCode.WHITE_KING} width={30} />);
    expect(el).toHaveStyle({
      width: "30px",
      height: "30px",
    });
  });

  it("does not contain Piece move CSS transition styles if there is no transitionFrom prop", () => {
    const { getByTestId } = render(<Piece pieceCode={PieceCode.WHITE_KING} />);

    const el: HTMLElement = getByTestId(`piece-${PieceCode.WHITE_KING}`);

    expect(el.style.transform).toBe("");
    expect(el.style.transition).toBe("");
    expect(el.style.zIndex).toBe("");
  });
});
