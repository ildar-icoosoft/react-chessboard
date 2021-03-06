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
      <PhantomPiece
        pieceCode={PieceCode.WHITE_KING}
        xYCoordinates={{ x: 0, y: 0 }}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe("children components", () => {
    describe("contains 1 Piece that disappears in transitionDuration sec", () => {
      it("default transitionDuration 300 msec", () => {
        const testRenderer = TestRenderer.create(
          <PhantomPiece
            pieceCode={PieceCode.BLACK_QUEEN}
            xYCoordinates={{ x: 0, y: 0 }}
          />
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
            xYCoordinates={{ x: 0, y: 0 }}
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
          <PhantomPiece
            pieceCode={PieceCode.WHITE_KING}
            xYCoordinates={{ x: 0, y: 0 }}
          />
        ).root;

        const piece: TestRenderer.ReactTestInstance = testInstance.findByType(
          Piece
        );
        expect(piece.props.pieceCode).toBe(PieceCode.WHITE_KING);
      });
      it("width", () => {
        const testRenderer = TestRenderer.create(
          <PhantomPiece
            pieceCode={PieceCode.WHITE_KING}
            xYCoordinates={{ x: 0, y: 0 }}
          />
        );
        const testInstance = testRenderer.root;

        const piece: TestRenderer.ReactTestInstance = testInstance.findByType(
          Piece
        );
        expect(piece.props.width).toBeUndefined();

        testRenderer.update(
          <PhantomPiece
            pieceCode={PieceCode.WHITE_KING}
            width={130}
            xYCoordinates={{ x: 0, y: 0 }}
          />
        );
        expect(piece.props.width).toBe(130);
      });
    });
  });

  describe("DOM structure", () => {
    it("contains data-testid phantom-piece-{pieceCode}", () => {
      const { rerender, queryByTestId } = render(
        <PhantomPiece
          pieceCode={PieceCode.WHITE_KING}
          xYCoordinates={{ x: 0, y: 0 }}
        />
      );

      expect(
        queryByTestId(`phantom-piece-${PieceCode.WHITE_KING}`)
      ).toBeInTheDocument();

      rerender(
        <PhantomPiece
          pieceCode={PieceCode.WHITE_QUEEN}
          xYCoordinates={{ x: 0, y: 0 }}
        />
      );
      expect(
        queryByTestId(`phantom-piece-${PieceCode.WHITE_QUEEN}`)
      ).toBeInTheDocument();
    });

    it("contains CSS transform style", () => {
      const { getByTestId, rerender } = render(
        <PhantomPiece
          pieceCode={PieceCode.WHITE_KING}
          xYCoordinates={{ x: 0, y: 0 }}
        />
      );

      const el: HTMLElement = getByTestId(
        `phantom-piece-${PieceCode.WHITE_KING}`
      );

      expect(el).toHaveStyle({
        transform: `translate(0px, 0px)`,
      });

      rerender(
        <PhantomPiece
          pieceCode={PieceCode.WHITE_KING}
          xYCoordinates={{ x: 10, y: 20 }}
        />
      );

      expect(el).toHaveStyle({
        transform: `translate(10px, 20px)`,
      });
    });

    describe("empty in transitionDuration sec", () => {
      it("default transitionDuration 300 msec", () => {
        const { container } = render(
          <PhantomPiece
            pieceCode={PieceCode.WHITE_KING}
            xYCoordinates={{ x: 0, y: 0 }}
          />
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
            xYCoordinates={{ x: 0, y: 0 }}
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
