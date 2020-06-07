import React, { createRef } from "react";
import TestRenderer from "react-test-renderer";
import "@testing-library/jest-dom/extend-expect";
import { CoordinateGrid, CoordinateGridRef } from "../CoordinateGrid";
import { PieceCode } from "../../enums/PieceCode";
import { act, createEvent, fireEvent, render } from "@testing-library/react";
import { PieceColor } from "../../enums/PieceColor";
import { wrapInTestContext } from "react-dnd-test-utils";
import { ReactDndRefType } from "../../interfaces/ReactDndRefType";
import { DraggablePiece, DraggablePieceRef } from "../DraggablePiece";
import { DragDropManager, Identifier } from "dnd-core";
import { ITestBackend } from "react-dnd-test-backend";
import { SquareRef } from "../Square";

jest.useFakeTimers();

describe("CoordinateGrid", () => {
  const CoordinateGridWithDnd = wrapInTestContext(CoordinateGrid);
  const DraggablePieceWithDnd = wrapInTestContext(DraggablePiece);

  it("Snapshot", () => {
    const tree = TestRenderer.create(<CoordinateGridWithDnd />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe("children components", () => {
    it("contains DraggablePiece", () => {
      const testRenderer = TestRenderer.create(<CoordinateGridWithDnd />);
      const testInstance = testRenderer.root;

      expect(testInstance.findAllByType(DraggablePiece).length).toBe(0);

      testRenderer.update(
        <CoordinateGridWithDnd
          position={{ e2: PieceCode.WHITE_PAWN, d5: PieceCode.BLACK_BISHOP }}
        />
      );

      expect(
        testInstance.findAll((item) => {
          return (
            item.type === DraggablePiece &&
            item.props.pieceCode === PieceCode.WHITE_PAWN
          );
        }).length
      ).toBe(1);

      expect(
        testInstance.findAll((item) => {
          return (
            item.type === DraggablePiece &&
            item.props.pieceCode === PieceCode.BLACK_BISHOP
          );
        }).length
      ).toBe(1);
    });
  });

  describe("children components props", () => {
    describe("DraggablePiece", () => {
      it("pieceCode", () => {
        const testInstance = TestRenderer.create(
          <CoordinateGridWithDnd position={{ e2: PieceCode.WHITE_PAWN }} />
        ).root;

        const piece: TestRenderer.ReactTestInstance = testInstance.findByType(
          DraggablePiece
        );
        expect(piece.props.pieceCode).toBe(PieceCode.WHITE_PAWN);
      });

      it("width", () => {
        const testRenderer = TestRenderer.create(
          <CoordinateGridWithDnd position={{ e2: PieceCode.WHITE_PAWN }} />
        );
        const testInstance = testRenderer.root;

        const piece: TestRenderer.ReactTestInstance = testInstance.findByType(
          DraggablePiece
        );
        expect(piece.props.width).toBe(60);

        testRenderer.update(
          <CoordinateGridWithDnd
            position={{ e2: PieceCode.WHITE_PAWN }}
            width={240}
          />
        );
        expect(piece.props.width).toBe(30);
      });

      it("xYCoordinates", () => {
        const testRenderer = TestRenderer.create(
          <CoordinateGridWithDnd position={{ e2: PieceCode.WHITE_PAWN }} />
        );
        const testInstance = testRenderer.root;

        const piece: TestRenderer.ReactTestInstance = testInstance.findByType(
          DraggablePiece
        );
        expect(piece.props.xYCoordinates).toEqual({
          x: 240,
          y: 360,
        });

        testRenderer.update(
          <CoordinateGridWithDnd
            position={{ e2: PieceCode.WHITE_PAWN }}
            width={240}
          />
        );
        expect(piece.props.xYCoordinates).toEqual({
          x: 120,
          y: 180,
        });
      });

      it("draggable", () => {
        const testRenderer = TestRenderer.create(
          <CoordinateGridWithDnd position={{ e2: PieceCode.WHITE_PAWN }} />
        );
        const testInstance = testRenderer.root;

        const draggablePiece = testInstance.findByType(DraggablePiece);

        expect(draggablePiece.props.draggable).toBe(false);

        testRenderer.update(
          <CoordinateGridWithDnd
            position={{ e2: PieceCode.WHITE_PAWN }}
            draggable={true}
          />
        );
        expect(draggablePiece.props.draggable).toBe(true);
      });

      it("allowDrag", () => {
        const testRenderer = TestRenderer.create(
          <CoordinateGridWithDnd position={{ e2: PieceCode.WHITE_PAWN }} />
        );
        const testInstance = testRenderer.root;

        const draggablePiece = testInstance.findByType(DraggablePiece);

        expect(draggablePiece.props.allowDrag).toBeUndefined();

        const allowDragFalse = jest.fn().mockReturnValue(false);
        testRenderer.update(
          <CoordinateGridWithDnd
            position={{ e2: PieceCode.WHITE_PAWN }}
            allowDrag={allowDragFalse}
          />
        );
        expect(draggablePiece.props.allowDrag).toBeInstanceOf(Function);
        expect(
          draggablePiece.props.allowDrag(PieceCode.WHITE_PAWN, {
            x: 100,
            y: 100,
          })
        ).toBe(false);

        const allowDragTrue = jest.fn().mockReturnValue(true);
        testRenderer.update(
          <CoordinateGridWithDnd
            position={{ e2: PieceCode.WHITE_PAWN }}
            allowDrag={allowDragTrue}
          />
        );
        expect(draggablePiece.props.allowDrag).toBeInstanceOf(Function);
        expect(
          draggablePiece.props.allowDrag(PieceCode.WHITE_PAWN, {
            x: 100,
            y: 100,
          })
        ).toBe(true);
      });
    });
  });

  describe("callback props", () => {
    it("allowDrag", () => {
      const allowDrag = jest.fn();

      const testRenderer = TestRenderer.create(
        <CoordinateGridWithDnd
          position={{ e2: PieceCode.WHITE_PAWN }}
          allowDrag={allowDrag}
        />
      );
      const testInstance = testRenderer.root;

      const draggablePiece = testInstance.findByType(DraggablePiece);

      draggablePiece.props.allowDrag(PieceCode.WHITE_PAWN, {
        x: 240,
        y: 360,
      });

      expect(allowDrag).toBeCalledTimes(1);
      expect(allowDrag).toBeCalledWith(PieceCode.WHITE_PAWN, "e2");
    });
  });

  describe("Events", () => {
    it("Click", () => {
      const onClick = jest.fn();
      const onRightClick = jest.fn();

      const { getByTestId, rerender } = render(
        <CoordinateGridWithDnd onClick={onClick} onRightClick={onRightClick} />
      );

      const coordinateGridEl = getByTestId("coordinate-grid");

      fireEvent.click(coordinateGridEl, {
        clientX: 60,
        clientY: 60,
      });

      rerender(
        <CoordinateGridWithDnd
          onClick={onClick}
          onRightClick={onRightClick}
          orientation={PieceColor.BLACK}
        />
      );

      fireEvent.click(coordinateGridEl, {
        clientX: 479,
        clientY: 0,
      });

      expect(onClick).toHaveBeenCalledTimes(2);

      expect(onClick).toHaveBeenNthCalledWith(1, "b7");
      expect(onClick).toHaveBeenNthCalledWith(2, "a1");

      expect(onRightClick).toHaveBeenCalledTimes(0);
    });

    it("Click if no callback", () => {
      const { getByTestId } = render(<CoordinateGridWithDnd />);
      expect(() => {
        fireEvent.click(getByTestId("coordinate-grid"));
      }).not.toThrow();
    });

    it("Right Click", () => {
      const onClick = jest.fn();
      const onRightClick = jest.fn();

      const { getByTestId, rerender } = render(
        <CoordinateGridWithDnd onClick={onClick} onRightClick={onRightClick} />
      );

      const coordinateGridEl = getByTestId("coordinate-grid");

      fireEvent.contextMenu(coordinateGridEl, {
        clientX: 60,
        clientY: 60,
      });

      rerender(
        <CoordinateGridWithDnd
          onClick={onClick}
          onRightClick={onRightClick}
          orientation={PieceColor.BLACK}
        />
      );

      fireEvent.contextMenu(coordinateGridEl, {
        clientX: 479,
        clientY: 0,
      });

      expect(onRightClick).toHaveBeenCalledTimes(2);

      expect(onRightClick).toHaveBeenNthCalledWith(1, "b7");
      expect(onRightClick).toHaveBeenNthCalledWith(2, "a1");

      expect(onClick).toHaveBeenCalledTimes(0);
    });

    it("Right Click event must be prevented", () => {
      const { getByTestId } = render(<CoordinateGridWithDnd />);

      const coordinateGridEl = getByTestId("coordinate-grid");

      const contextMenuEvent = createEvent.contextMenu(coordinateGridEl, {
        clientX: 479,
        clientY: 0,
      });

      fireEvent(coordinateGridEl, contextMenuEvent);

      expect(contextMenuEvent.defaultPrevented).toBeTruthy();
    });

    it("Right Click if no callback", () => {
      const { getByTestId } = render(<CoordinateGridWithDnd />);
      expect(() => {
        fireEvent.contextMenu(getByTestId("coordinate-grid"));
      }).not.toThrow();
    });
  });

  describe("methods", () => {
    it("getDropHandlerId()", () => {
      const dragAndDropRef = createRef<ReactDndRefType>();

      TestRenderer.create(<CoordinateGridWithDnd ref={dragAndDropRef} />);

      const coordinateGridRef: CoordinateGridRef = (dragAndDropRef.current as ReactDndRefType).getDecoratedComponent<
        CoordinateGridRef
      >();

      expect(coordinateGridRef.getDropHandlerId()).toBeTruthy();
    });
    it("getDragHandlerId()", () => {
      const dragAndDropRef = createRef<ReactDndRefType>();

      TestRenderer.create(<CoordinateGridWithDnd ref={dragAndDropRef} />);

      const coordinateGridRef: CoordinateGridRef = (dragAndDropRef.current as ReactDndRefType).getDecoratedComponent<
        CoordinateGridRef
      >();

      expect(coordinateGridRef.getDragHandlerId()).toBeTruthy();
    });
  });

  describe("DOM structure", () => {
    it("should contain data-testid coordinateGrid", () => {
      const { queryByTestId } = render(<CoordinateGridWithDnd />);
      expect(queryByTestId("coordinate-grid")).toBeInTheDocument();
    });

    it("coordinateGrid should have width and height styles", () => {
      const { getByTestId, rerender } = render(<CoordinateGridWithDnd />);

      const coordinateGridEl = getByTestId("coordinate-grid");

      expect(coordinateGridEl).toHaveStyle({
        width: "480px",
        height: "480px",
      });

      rerender(<CoordinateGridWithDnd width={700} />);

      expect(coordinateGridEl).toHaveStyle({
        width: "700px",
        height: "700px",
      });
    });
  });

  describe("Drag and Drop", () => {
    it("checks if coordinate-grid has a ref to Connector drop source", () => {
      // @todo
    });

    it("checks if coordinate-grid has a ref to Connector drag source", () => {
      // @todo
    });

    describe("Drop", () => {
      it("Allows to drop piece", () => {
        const dropRef = createRef<ReactDndRefType>();
        render(<CoordinateGridWithDnd ref={dropRef} />);

        const dragRef = createRef<ReactDndRefType>();
        render(
          <DraggablePieceWithDnd
            ref={dragRef}
            pieceCode={PieceCode.WHITE_KING}
            xYCoordinates={{ x: 10, y: 20 }}
            draggable={true}
          />
        );

        const manager: DragDropManager = (dropRef.current as ReactDndRefType).getManager() as DragDropManager;

        const dropSourceId: Identifier = (dropRef.current as ReactDndRefType)
          .getDecoratedComponent<CoordinateGridRef>()
          .getDropHandlerId() as Identifier;

        const dragSourceId: Identifier = (dragRef.current as ReactDndRefType)
          .getDecoratedComponent<DraggablePieceRef>()
          .getDragHandlerId() as Identifier;

        const backend: ITestBackend = manager.getBackend() as ITestBackend;

        act(() => {
          backend.simulateBeginDrag([dragSourceId]);
        });

        expect(manager.getMonitor().canDropOnTarget(dropSourceId)).toBeTruthy();

        act(() => {
          backend.simulateEndDrag();
        });
      });

      it("onDrop event", () => {
        const onDrop = jest.fn();

        const dropRef = createRef<ReactDndRefType>();
        render(<CoordinateGridWithDnd ref={dropRef} onDrop={onDrop} />);

        const dragRef = createRef<ReactDndRefType>();
        render(
          <DraggablePieceWithDnd
            ref={dragRef}
            pieceCode={PieceCode.WHITE_KING}
            xYCoordinates={{ x: 10, y: 20 }}
            draggable={true}
          />
        );

        const manager: DragDropManager = (dropRef.current as ReactDndRefType).getManager() as DragDropManager;

        const dragSourceId: Identifier = (dragRef.current as ReactDndRefType)
          .getDecoratedComponent<SquareRef>()
          .getDragHandlerId() as Identifier;
        const dropSourceId: Identifier = (dropRef.current as ReactDndRefType)
          .getDecoratedComponent<SquareRef>()
          .getDropHandlerId() as Identifier;

        const backend: ITestBackend = manager.getBackend() as ITestBackend;

        act(() => {
          backend.simulateBeginDrag([dragSourceId]);
          backend.simulateHover([dropSourceId], {
            clientOffset: {
              x: 60,
              y: 60,
            },
          });
          backend.simulateDrop();
        });

        expect(onDrop).toHaveBeenCalledTimes(1);
        expect(onDrop).toBeCalledWith({
          sourceCoordinates: "a8",
          targetCoordinates: "b7",
          pieceCode: PieceCode.WHITE_KING,
        });

        act(() => {
          backend.simulateEndDrag();
        });
      });
    });
  });
});
