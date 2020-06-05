import React, { createRef } from "react";
import { ReactDndRefType } from "../../interfaces/ReactDndRefType";
import { PieceCode } from "../../enums/PieceCode";
import { DraggablePiece, DraggablePieceRef } from "../DraggablePiece";
import TestRenderer from "react-test-renderer";
import { wrapInTestContext } from "react-dnd-test-utils";
import { Piece } from "../Piece";

describe("DraggablePiece", () => {
  const DraggablePieceWithDnd = wrapInTestContext(DraggablePiece);

  describe("children components", () => {
    it("contains 1 Piece", () => {
      const testInstance = TestRenderer.create(
        <DraggablePieceWithDnd pieceCode={PieceCode.BLACK_QUEEN} />
      ).root;

      expect(testInstance.findAllByType(Piece).length).toBe(1);
    });
  });

  describe("children components props", () => {
    describe("Piece", () => {
      it("all props", () => {
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
          xYCoordinates: { x: 100, y: 100 },
          pieceCode: PieceCode.BLACK_QUEEN,
          transitionFrom: {
            e2: {
              algebraic: "e4",
              x: 200,
              y: 300,
              phantomPiece: PieceCode.BLACK_BISHOP,
            },
          },
          transitionDuration: 400,
        });
      });
    });
  });

  describe("methods", () => {
    it("getDropHandlerId()", () => {
      const dragAndDropRef = createRef<ReactDndRefType>();

      TestRenderer.create(
        <DraggablePieceWithDnd
          ref={dragAndDropRef}
          pieceCode={PieceCode.WHITE_KING}
        />
      );

      const draggablePieceRef: DraggablePieceRef = (dragAndDropRef.current as ReactDndRefType).getDecoratedComponent<
        DraggablePieceRef
      >();

      expect(draggablePieceRef.getDragHandlerId()).toBeTruthy();
    });
  });
});
