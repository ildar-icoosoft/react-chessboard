import React, { createRef } from "react";
import { ReactDndRefType } from "../../interfaces/ReactDndRefType";
import { PieceCode } from "../../enums/PieceCode";
import { DraggablePiece, DraggablePieceRef } from "../DraggablePiece";
import TestRenderer from "react-test-renderer";
import { wrapInTestContext } from "react-dnd-test-utils";
import { Piece } from "../Piece";
import { act, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { DragDropManager, Identifier } from "dnd-core";
import { SquareRef } from "../Square";
import { ITestBackend } from "react-dnd-test-backend";
import { DragItemType } from "../../enums/DragItemType";

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

  describe("callback props", () => {
    it("draggable callback", () => {
      const draggable = jest.fn(() => true);

      const ref = createRef<ReactDndRefType>();

      render(
        <DraggablePieceWithDnd
          ref={ref}
          pieceCode={PieceCode.WHITE_KING}
          xYCoordinates={{ x: 20, y: 30 }}
          draggable={draggable}
        />
      );

      const manager: DragDropManager = (ref.current as ReactDndRefType).getManager() as DragDropManager;

      const dragSourceId: Identifier = (ref.current as ReactDndRefType)
        .getDecoratedComponent<SquareRef>()
        .getDragHandlerId() as Identifier;

      manager.getMonitor().canDragSource(dragSourceId);

      expect(draggable).toBeCalledWith(PieceCode.WHITE_KING, { x: 20, y: 30 });
      expect(draggable).toBeCalledTimes(1);
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
          xYCoordinates={{ x: 10, y: 20 }}
        />
      );

      expect(el).toHaveStyle({
        transform: `translate(10px, 20px)`,
      });
    });
  });

  describe("Drag and Drop", () => {
    it("Can drag if draggable is true or a function which returns true", () => {
      const ref = createRef<ReactDndRefType>();

      const { rerender } = render(
        <DraggablePieceWithDnd
          ref={ref}
          pieceCode={PieceCode.WHITE_KING}
          xYCoordinates={{ x: 0, y: 0 }}
        />
      );

      const manager: DragDropManager = (ref.current as ReactDndRefType).getManager() as DragDropManager;

      const dragSourceId: Identifier = (ref.current as ReactDndRefType)
        .getDecoratedComponent<SquareRef>()
        .getDragHandlerId() as Identifier;

      expect(manager.getMonitor().canDragSource(dragSourceId)).toBeFalsy(); // draggable prop is false by default

      rerender(
        <DraggablePieceWithDnd
          ref={ref}
          pieceCode={PieceCode.WHITE_KING}
          xYCoordinates={{ x: 0, y: 0 }}
          draggable={() => false}
        />
      );

      expect(manager.getMonitor().canDragSource(dragSourceId)).toBeFalsy(); // draggable is function which returns false

      rerender(
        <DraggablePieceWithDnd
          ref={ref}
          pieceCode={PieceCode.WHITE_KING}
          xYCoordinates={{ x: 0, y: 0 }}
          draggable={true}
        />
      );

      expect(manager.getMonitor().canDragSource(dragSourceId)).toBeTruthy(); // draggable is function which returns true

      rerender(
        <DraggablePieceWithDnd
          ref={ref}
          pieceCode={PieceCode.WHITE_KING}
          xYCoordinates={{ x: 0, y: 0 }}
          draggable={() => true}
        />
      );

      expect(manager.getMonitor().canDragSource(dragSourceId)).toBeTruthy(); // draggable is function which returns true
    });

    it("checks drag source object", () => {
      const ref = createRef<ReactDndRefType>();

      render(
        <DraggablePieceWithDnd
          ref={ref}
          pieceCode={PieceCode.WHITE_KING}
          xYCoordinates={{ x: 10, y: 20 }}
          draggable={true}
        />
      );

      const manager: DragDropManager = (ref.current as ReactDndRefType).getManager() as DragDropManager;

      const dragSourceId: Identifier = (ref.current as ReactDndRefType)
        .getDecoratedComponent<SquareRef>()
        .getDragHandlerId() as Identifier;

      const backend: ITestBackend = manager.getBackend() as ITestBackend;

      act(() => {
        backend.simulateBeginDrag([dragSourceId]);
      });

      expect(manager.getMonitor().getItem()).toEqual({
        type: DragItemType.PIECE,
        pieceCode: PieceCode.WHITE_KING,
        xYCoordinates: { x: 10, y: 20 },
      });
    });
  });
});
