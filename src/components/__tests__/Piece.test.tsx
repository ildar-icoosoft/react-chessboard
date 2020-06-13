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
  });
});
