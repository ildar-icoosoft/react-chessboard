import React from "react";
import TestRenderer from "react-test-renderer";
import { PieceCode } from "../../enums/PieceCode";
import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { PhantomPiece } from "../PhantomPiece";
import { Piece } from "../Piece";

jest.useFakeTimers();

describe("PhantomPiece", () => {
  // @todo. maybe we should add this code to each test suite
  beforeEach(() => {
    TestRenderer.act(() => {
      jest.runAllTimers();
    });
    act(() => {
      jest.runAllTimers();
    });
  });

  it("Snapshot", () => {
    const tree = TestRenderer.create(
      <PhantomPiece pieceCode={PieceCode.WHITE_KING} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe("children components", () => {
    describe("contains 1 Piece that disappears in transitionDuration sec", () => {
      it("default transitionDuration 300 msec", () => {
        const testRenderer = TestRenderer.create(
          <PhantomPiece pieceCode={PieceCode.BLACK_QUEEN} />
        );
        const testInstance = testRenderer.root;

        expect(() => testInstance.findByType(Piece)).not.toThrow();

        TestRenderer.act(() => {
          jest.advanceTimersByTime(300);
        });

        expect(() => testInstance.findByType(Piece)).toThrow();
      });

      it("set transitionDuration", () => {
        const testRenderer = TestRenderer.create(
          <PhantomPiece
            pieceCode={PieceCode.BLACK_QUEEN}
            transitionDuration={600}
          />
        );
        const testInstance = testRenderer.root;

        expect(() => testInstance.findByType(Piece)).not.toThrow();

        TestRenderer.act(() => {
          jest.advanceTimersByTime(300);
        });

        expect(() => testInstance.findByType(Piece)).not.toThrow();

        TestRenderer.act(() => {
          jest.advanceTimersByTime(300);
        });

        expect(() => testInstance.findByType(Piece)).toThrow();
      });
    });
  });

  describe("children components props", () => {
    describe("Piece", () => {
      it("pieceCode", () => {
        const testInstance = TestRenderer.create(
          <PhantomPiece pieceCode={PieceCode.WHITE_KING} />
        ).root;

        const piece: TestRenderer.ReactTestInstance = testInstance.findByType(
          Piece
        );
        expect(piece.props.pieceCode).toBe(PieceCode.WHITE_KING);
      });
      it("width", () => {
        const testRenderer = TestRenderer.create(
          <PhantomPiece pieceCode={PieceCode.WHITE_KING} />
        );
        const testInstance = testRenderer.root;

        const piece: TestRenderer.ReactTestInstance = testInstance.findByType(
          Piece
        );
        expect(piece.props.width).toBeUndefined();

        testRenderer.update(
          <PhantomPiece pieceCode={PieceCode.WHITE_KING} width={130} />
        );
        expect(piece.props.width).toBe(130);
      });
    });
  });

  describe("DOM structure", () => {
    it("contains data-testid phantom-piece-{pieceCode}", () => {
      const { rerender, queryByTestId } = render(
        <PhantomPiece pieceCode={PieceCode.WHITE_KING} />
      );

      expect(
        queryByTestId(`phantom-piece-${PieceCode.WHITE_KING}`)
      ).toBeInTheDocument();

      rerender(<PhantomPiece pieceCode={PieceCode.WHITE_QUEEN} />);
      expect(
        queryByTestId(`phantom-piece-${PieceCode.WHITE_QUEEN}`)
      ).toBeInTheDocument();
    });

    describe("empty in transitionDuration sec", () => {
      it("default transitionDuration 300 msec", () => {
        const { container } = render(
          <PhantomPiece pieceCode={PieceCode.WHITE_KING} />
        );

        expect(container).not.toBeEmpty();

        act(() => {
          jest.advanceTimersByTime(300);
        });

        expect(container).toBeEmpty();
      });

      it("set transitionDuration", () => {
        const { container } = render(
          <PhantomPiece
            pieceCode={PieceCode.WHITE_KING}
            transitionDuration={600}
          />
        );

        expect(container).not.toBeEmpty();

        act(() => {
          jest.advanceTimersByTime(300);
        });

        expect(container).not.toBeEmpty();

        act(() => {
          jest.advanceTimersByTime(300);
        });

        expect(container).toBeEmpty();
      });
    });
  });
});
