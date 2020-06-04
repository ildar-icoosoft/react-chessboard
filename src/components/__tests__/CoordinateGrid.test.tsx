import React from "react";
import TestRenderer from "react-test-renderer";
import "@testing-library/jest-dom/extend-expect";
import { CoordinateGrid } from "../CoordinateGrid";
import { Piece } from "../Piece";
import { PieceCode } from "../../enums/PieceCode";

jest.useFakeTimers();

describe("Square", () => {
  it("Snapshot", () => {
    const tree = TestRenderer.create(<CoordinateGrid />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe("children components", () => {
    it("contains 1 Piece", () => {
      const testRenderer = TestRenderer.create(<CoordinateGrid />);
      const testInstance = testRenderer.root;

      expect(testInstance.findAllByType(Piece).length).toBe(0);

      testRenderer.update(
        <CoordinateGrid
          position={{ e2: PieceCode.WHITE_PAWN, d5: PieceCode.BLACK_BISHOP }}
        />
      );

      expect(
        testInstance.findAll((item) => {
          return (
            item.type === Piece && item.props.pieceCode === PieceCode.WHITE_PAWN
          );
        }).length
      ).toBe(1);

      expect(
        testInstance.findAll((item) => {
          return (
            item.type === Piece &&
            item.props.pieceCode === PieceCode.BLACK_BISHOP
          );
        }).length
      ).toBe(1);
    });
  });
});
