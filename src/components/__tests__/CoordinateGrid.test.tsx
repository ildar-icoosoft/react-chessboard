import React from "react";
import TestRenderer from "react-test-renderer";
import "@testing-library/jest-dom/extend-expect";
import { CoordinateGrid } from "../CoordinateGrid";
import { Piece } from "../Piece";
import { PieceCode } from "../../enums/PieceCode";
import { render, fireEvent } from "@testing-library/react";

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

  describe("children components props", () => {
    describe("Piece", () => {
      it("pieceCode", () => {
        const testInstance = TestRenderer.create(
          <CoordinateGrid position={{ e2: PieceCode.WHITE_PAWN }} />
        ).root;

        const piece: TestRenderer.ReactTestInstance = testInstance.findByType(
          Piece
        );
        expect(piece.props.pieceCode).toBe(PieceCode.WHITE_PAWN);
      });

      it("width", () => {
        const testRenderer = TestRenderer.create(
          <CoordinateGrid position={{ e2: PieceCode.WHITE_PAWN }} />
        );
        const testInstance = testRenderer.root;

        const piece: TestRenderer.ReactTestInstance = testInstance.findByType(
          Piece
        );
        expect(piece.props.width).toBe(60);

        testRenderer.update(
          <CoordinateGrid position={{ e2: PieceCode.WHITE_PAWN }} width={240} />
        );
        expect(piece.props.width).toBe(30);
      });

      it("xYCoordinates", () => {
        const testRenderer = TestRenderer.create(
          <CoordinateGrid position={{ e2: PieceCode.WHITE_PAWN }} />
        );
        const testInstance = testRenderer.root;

        const piece: TestRenderer.ReactTestInstance = testInstance.findByType(
          Piece
        );
        expect(piece.props.xYCoordinates).toEqual({
          x: 240,
          y: 360,
        });

        testRenderer.update(
          <CoordinateGrid position={{ e2: PieceCode.WHITE_PAWN }} width={240} />
        );
        expect(piece.props.xYCoordinates).toEqual({
          x: 120,
          y: 180,
        });
      });
    });
  });

  describe("Events", () => {
    it("Click", () => {
      const onClick = jest.fn();
      const onRightClick = jest.fn();

      const { getByTestId } = render(
        <CoordinateGrid onClick={onClick} onRightClick={onRightClick} />
      );

      fireEvent.click(getByTestId("coordinate-grid"), {
        clientX: 60,
        clientY: 60,
      });

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toBeCalledWith("b7");

      expect(onRightClick).toHaveBeenCalledTimes(0);
    });

    /*  it("Click if no callback", () => {
      const {getByTestId} = render(<CoordinateGrid />);
      expect(() => {
        fireEvent.click(getByTestId("square-a1"));
      }).not.toThrow();
    });*/
  });

  describe("DOM structure", () => {
    it("should contain data-testid coordinateGrid", () => {
      const { queryByTestId } = render(<CoordinateGrid />);
      expect(queryByTestId("coordinate-grid")).toBeInTheDocument();
    });

    it("coordinateGrid should have width and height styles", () => {
      const { getByTestId, rerender } = render(<CoordinateGrid />);

      const coordinateGridEl = getByTestId("coordinate-grid");

      expect(coordinateGridEl).toHaveStyle({
        width: "480px",
        height: "480px",
      });

      rerender(<CoordinateGrid width={700} />);

      expect(coordinateGridEl).toHaveStyle({
        width: "700px",
        height: "700px",
      });
    });
  });
});
