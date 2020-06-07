import React, { createRef } from "react";
import TestRenderer from "react-test-renderer";
import "@testing-library/jest-dom/extend-expect";
import { CoordinateGrid, CoordinateGridRef } from "../CoordinateGrid";
import { PieceCode } from "../../enums/PieceCode";
import { act, createEvent, fireEvent, render } from "@testing-library/react";
import { PieceColor } from "../../enums/PieceColor";
import { wrapInTestContext } from "react-dnd-test-utils";
import { ReactDndRefType } from "../../interfaces/ReactDndRefType";
import { DraggablePiece } from "../DraggablePiece";
import { DragDropManager, Identifier } from "dnd-core";
import { ITestBackend } from "react-dnd-test-backend";
import { SquareRef } from "../Square";
import { XYCoord } from "react-dnd";
import { DragItemType } from "../../enums/DragItemType";

jest.useFakeTimers();

describe("CoordinateGrid", () => {
  const CoordinateGridWithDnd = wrapInTestContext(CoordinateGrid);

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

    describe("Drag", () => {
      it("drag preview should be empty image", () => {
        // @todo
      });

      it("allows drag", () => {
        // Can drag if contains piece and draggable is true and allowDrag is not set or allowDrag returns true

        const ref = createRef<ReactDndRefType>();

        const { rerender } = render(
          <CoordinateGridWithDnd
            ref={ref}
            position={{ b7: PieceCode.WHITE_KING }}
          />
        );
        const manager: DragDropManager = (ref.current as ReactDndRefType).getManager() as DragDropManager;

        const dragSourceId: Identifier = (ref.current as ReactDndRefType)
          .getDecoratedComponent<CoordinateGridRef>()
          .getDragHandlerId() as Identifier;

        const backend: ITestBackend = manager.getBackend() as ITestBackend;

        const clientOffset: XYCoord = {
          x: 60,
          y: 60,
        };
        act(() => {
          backend.simulateBeginDrag([dragSourceId], {
            clientOffset: clientOffset,
            getSourceClientOffset() {
              return clientOffset;
            },
          });
        });
        // @todo
        // better to use canDragSource() function: manager.getMonitor().canDragSource(dragSourceId)
        // https://github.com/react-dnd/react-dnd/issues/2564
        expect(manager.getMonitor().isDragging()).toBeFalsy(); // draggable prop is false by default

        rerender(
          <CoordinateGridWithDnd
            ref={ref}
            position={{ b7: PieceCode.WHITE_KING }}
            draggable={true}
            allowDrag={() => false}
          />
        );
        act(() => {
          backend.simulateBeginDrag([dragSourceId], {
            clientOffset: clientOffset,
            getSourceClientOffset() {
              return clientOffset;
            },
          });
        });
        expect(manager.getMonitor().isDragging()).toBeFalsy(); // draggable is true but allowDrag returns false

        rerender(
          <CoordinateGridWithDnd
            ref={ref}
            position={{ b7: PieceCode.WHITE_KING }}
            draggable={false}
            allowDrag={() => true}
          />
        );
        act(() => {
          backend.simulateBeginDrag([dragSourceId], {
            clientOffset: clientOffset,
            getSourceClientOffset() {
              return clientOffset;
            },
          });
        });
        expect(manager.getMonitor().isDragging()).toBeFalsy(); // allowDrag returns true but draggable is false

        rerender(
          <CoordinateGridWithDnd
            ref={ref}
            position={{ b7: PieceCode.WHITE_KING }}
            draggable={true}
          />
        );
        act(() => {
          backend.simulateBeginDrag([dragSourceId], {
            clientOffset: clientOffset,
            getSourceClientOffset() {
              return clientOffset;
            },
          });
        });
        expect(manager.getMonitor().isDragging()).toBeTruthy(); // draggable is true

        act(() => {
          backend.simulateEndDrag();
        });

        rerender(
          <CoordinateGridWithDnd
            ref={ref}
            position={{ b7: PieceCode.WHITE_KING }}
            draggable={true}
            allowDrag={() => true}
          />
        );
        act(() => {
          backend.simulateBeginDrag([dragSourceId], {
            clientOffset: clientOffset,
            getSourceClientOffset() {
              return clientOffset;
            },
          });
        });
        expect(manager.getMonitor().isDragging()).toBeTruthy(); // draggable is true and allowDrag returns true
        act(() => {
          backend.simulateEndDrag();
        });

        rerender(
          <CoordinateGridWithDnd
            ref={ref}
            position={{ c7: PieceCode.WHITE_KING }}
            draggable={true}
          />
        );
        act(() => {
          backend.simulateBeginDrag([dragSourceId], {
            clientOffset: clientOffset,
            getSourceClientOffset() {
              return clientOffset;
            },
          });
        });
        expect(manager.getMonitor().isDragging()).toBeFalsy(); // draggable is true, but there is no piece on b7
      });

      it("checks drag source object", () => {
        const ref = createRef<ReactDndRefType>();
        render(
          <CoordinateGridWithDnd
            ref={ref}
            position={{ b7: PieceCode.WHITE_KING }}
            draggable={true}
          />
        );

        const manager: DragDropManager = (ref.current as ReactDndRefType).getManager() as DragDropManager;

        const dragSourceId: Identifier = (ref.current as ReactDndRefType)
          .getDecoratedComponent<CoordinateGridRef>()
          .getDragHandlerId() as Identifier;

        const backend: ITestBackend = manager.getBackend() as ITestBackend;

        const clientOffset: XYCoord = {
          x: 60,
          y: 60,
        };

        act(() => {
          backend.simulateBeginDrag([dragSourceId], {
            clientOffset: clientOffset,
            getSourceClientOffset() {
              return clientOffset;
            },
          });
        });

        expect(manager.getMonitor().getItem()).toEqual({
          type: DragItemType.PIECE,
          pieceCode: PieceCode.WHITE_KING,
          coordinates: "b7",
        });

        act(() => {
          backend.simulateEndDrag();
        });
      });
    });

    describe("Drop", () => {
      it("Allows to drop piece", () => {
        const ref = createRef<ReactDndRefType>();
        render(
          <CoordinateGridWithDnd
            ref={ref}
            position={{ b7: PieceCode.WHITE_KING }}
            draggable={true}
          />
        );

        const manager: DragDropManager = (ref.current as ReactDndRefType).getManager() as DragDropManager;

        const dropSourceId: Identifier = (ref.current as ReactDndRefType)
          .getDecoratedComponent<CoordinateGridRef>()
          .getDropHandlerId() as Identifier;

        const dragSourceId: Identifier = (ref.current as ReactDndRefType)
          .getDecoratedComponent<CoordinateGridRef>()
          .getDragHandlerId() as Identifier;

        const backend: ITestBackend = manager.getBackend() as ITestBackend;

        const clientOffset: XYCoord = {
          x: 60,
          y: 60,
        };

        act(() => {
          backend.simulateBeginDrag([dragSourceId], {
            clientOffset: clientOffset,
            getSourceClientOffset() {
              return clientOffset;
            },
          });
        });

        expect(manager.getMonitor().canDropOnTarget(dropSourceId)).toBeTruthy();

        act(() => {
          backend.simulateEndDrag();
        });
      });

      it("onDrop event", () => {
        const onDrop = jest.fn();

        const ref = createRef<ReactDndRefType>();
        render(
          <CoordinateGridWithDnd
            ref={ref}
            position={{ a8: PieceCode.WHITE_KING }}
            draggable={true}
            onDrop={onDrop}
          />
        );

        const manager: DragDropManager = (ref.current as ReactDndRefType).getManager() as DragDropManager;

        const dragSourceId: Identifier = (ref.current as ReactDndRefType)
          .getDecoratedComponent<SquareRef>()
          .getDragHandlerId() as Identifier;
        const dropSourceId: Identifier = (ref.current as ReactDndRefType)
          .getDecoratedComponent<SquareRef>()
          .getDropHandlerId() as Identifier;

        const backend: ITestBackend = manager.getBackend() as ITestBackend;

        act(() => {
          // move from a8
          backend.simulateBeginDrag([dragSourceId], {
            clientOffset: {
              x: 30,
              y: 30,
            },
            getSourceClientOffset() {
              return {
                x: 30,
                y: 30,
              };
            },
          });
          // move to b7
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
