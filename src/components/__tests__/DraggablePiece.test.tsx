import React, { createRef } from "react";
import { ReactDndRefType } from "../../interfaces/ReactDndRefType";
import { PieceCode } from "../../enums/PieceCode";
import { DraggablePiece, DraggablePieceRef } from "../DraggablePiece";
import TestRenderer from "react-test-renderer";
import { wrapInTestContext } from "react-dnd-test-utils";
import { Piece } from "../Piece";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

jest.useFakeTimers();

describe("DraggablePiece", () => {
  const DraggablePieceWithDnd = wrapInTestContext(DraggablePiece);

  describe("children components", () => {
    it("contains 1 Piece", () => {
      const testInstance = TestRenderer.create(
        <DraggablePieceWithDnd
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
          <DraggablePieceWithDnd
            xYCoordinates={{ x: 100, y: 100 }}
            pieceCode={PieceCode.BLACK_QUEEN}
            transitionFrom={{
              e2: {
                algebraic: "e4",
                x: 200,
                y: 300,
                phantomPiece: PieceCode.BLACK_BISHOP,
              },
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

  describe("methods", () => {
    it("getDragHandlerId()", () => {
      const dragAndDropRef = createRef<ReactDndRefType>();

      TestRenderer.create(
        <DraggablePieceWithDnd
          ref={dragAndDropRef}
          pieceCode={PieceCode.WHITE_KING}
          xYCoordinates={{ x: 0, y: 0 }}
        />
      );

      const draggablePieceRef: DraggablePieceRef = (dragAndDropRef.current as ReactDndRefType).getDecoratedComponent<
        DraggablePieceRef
      >();

      expect(draggablePieceRef.getDragHandlerId()).toBeTruthy();
    });
  });

  describe("DOM structure", () => {
    it("contains data-testid draggable-piece-{pieceCode}", () => {
      const { queryByTestId, rerender } = render(
        <DraggablePieceWithDnd
          pieceCode={PieceCode.WHITE_KING}
          xYCoordinates={{ x: 0, y: 0 }}
        />
      );
      expect(
        queryByTestId(`draggable-piece-${PieceCode.WHITE_KING}`)
      ).toBeInTheDocument();

      rerender(
        <DraggablePieceWithDnd
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
        <DraggablePieceWithDnd
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
        <DraggablePieceWithDnd
          pieceCode={PieceCode.WHITE_KING}
          xYCoordinates={{ x: 200, y: 200 }}
        />
      );

      expect(el).toHaveStyle({
        transform: `translate(200px, 200px)`,
      });
    });
  });
});
