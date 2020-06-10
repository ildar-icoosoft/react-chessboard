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
import { BoardDropEvent } from "../../interfaces/BoardDropEvent";
import { PhantomPiece } from "../PhantomPiece";
import { HighlightedSquare } from "../HightlightedSquare";

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

    it("contains PhantomPiece", () => {
      const testRenderer = TestRenderer.create(
        <CoordinateGridWithDnd
          position={{ e2: PieceCode.WHITE_ROOK, e7: PieceCode.BLACK_PAWN }}
        />
      );
      const testInstance = testRenderer.root;

      expect(testInstance.findAllByType(PhantomPiece).length).toBe(0);

      testRenderer.update(
        <CoordinateGridWithDnd position={{ e7: PieceCode.WHITE_ROOK }} />
      );

      expect(
        testInstance.findAll((item) => {
          return (
            item.type === PhantomPiece &&
            item.props.pieceCode === PieceCode.BLACK_PAWN
          );
        }).length
      ).toBe(1);
    });

    it("contains HighlightedSquare", () => {
      const testRenderer = TestRenderer.create(<CoordinateGridWithDnd />);
      const testInstance = testRenderer.root;

      expect(testInstance.findAllByType(HighlightedSquare).length).toBe(0);

      testRenderer.update(
        <CoordinateGridWithDnd
          selectionSquares={["a1", "b1"]}
          occupationSquares={["a2", "b2"]}
          destinationSquares={["a1", "b2"]}
          lastMoveSquares={["c3", "d4"]}
          currentMoveSquares={["e5"]}
        />
      );

      expect(testInstance.findAllByType(HighlightedSquare).length).toBe(7); // a1, b1, a2, b2, c3, d4, e5

      testRenderer.update(
        <CoordinateGridWithDnd
          selectionSquares={["a1", "b2", "c3"]}
          occupationSquares={["b2", "d4"]}
          currentMoveSquares={[]}
        />
      );

      expect(testInstance.findAllByType(HighlightedSquare).length).toBe(4); // a1, b2, c3, d4
    });
  });

  describe("children components remounting", () => {
    describe("DraggablePiece", () => {
      it("remounts if coordinates or pieceCode is changed", () => {
        const testRenderer = TestRenderer.create(
          <CoordinateGridWithDnd
            position={{ d1: PieceCode.WHITE_QUEEN, d8: PieceCode.BLACK_QUEEN }}
          />
        );
        const testInstance = testRenderer.root;

        let piece: TestRenderer.ReactTestInstance;
        piece = testInstance.find(
          (item) =>
            item.type === DraggablePiece &&
            item.props.pieceCode === PieceCode.WHITE_QUEEN
        );

        testRenderer.update(
          <CoordinateGridWithDnd position={{ d8: PieceCode.WHITE_QUEEN }} />
        );

        // old piece on "d8" is unmounted because pieceCode is changed (from BLACK_QUEEN to WHITE_QUEEN)
        expect(testInstance.findAll((item) => item === piece).length).toBe(0);

        piece = testInstance.find(
          (item) =>
            item.type === DraggablePiece &&
            item.props.pieceCode === PieceCode.WHITE_QUEEN
        );

        testRenderer.update(
          <CoordinateGridWithDnd position={{ d1: PieceCode.WHITE_QUEEN }} />
        );

        // old piece on d8 is unmounted because coordinates are changed (from d8 to d1)
        expect(testInstance.findAll((item) => item === piece).length).toBe(0);

        piece = testInstance.find(
          (item) =>
            item.type === DraggablePiece &&
            item.props.pieceCode === PieceCode.WHITE_QUEEN
        );

        testRenderer.update(
          <CoordinateGridWithDnd
            position={{
              c1: PieceCode.WHITE_BISHOP,
              d1: PieceCode.WHITE_QUEEN,
              e1: PieceCode.WHITE_KING,
            }}
          />
        );

        // old piece on d8 is not unmounted because neither coordinates nor PieceCode have changed
        expect(testInstance.findAll((item) => item === piece).length).toBe(1);
      });
    });

    describe("PhantomPiece", () => {
      it("remounts if coordinates or pieceCode is changed", () => {
        let testRenderer = TestRenderer.create(
          <CoordinateGridWithDnd
            position={{ d1: PieceCode.WHITE_QUEEN, d8: PieceCode.BLACK_QUEEN }}
          />
        );
        let testInstance = testRenderer.root;

        // d8 phantomPiece is BLACK_QUEEN
        testRenderer.update(
          <CoordinateGridWithDnd
            position={{ d8: PieceCode.WHITE_QUEEN, a1: PieceCode.BLACK_BISHOP }}
          />
        );

        let phantomPiece: TestRenderer.ReactTestInstance;
        phantomPiece = testInstance.find(
          (item) =>
            item.type === PhantomPiece &&
            item.props.pieceCode === PieceCode.BLACK_QUEEN
        );

        // d8 phantomPiece is WHITE_QUEEN
        testRenderer.update(
          <CoordinateGridWithDnd position={{ d8: PieceCode.BLACK_BISHOP }} />
        );

        // old phantomPiece on "d8" is unmounted because pieceCode is changed (from BLACK_QUEEN to WHITE_QUEEN)
        expect(
          testInstance.findAll((item) => item === phantomPiece).length
        ).toBe(0);

        testRenderer = TestRenderer.create(
          <CoordinateGridWithDnd
            position={{
              a1: PieceCode.WHITE_ROOK,
              h1: PieceCode.WHITE_ROOK,
              a8: PieceCode.BLACK_ROOK,
            }}
          />
        );
        testInstance = testRenderer.root;

        // a8xa1 a1 phantomPiece is WHITE_ROOK
        testRenderer.update(
          <CoordinateGridWithDnd
            position={{ a1: PieceCode.BLACK_ROOK, h1: PieceCode.WHITE_ROOK }}
          />
        );

        phantomPiece = testInstance.find(
          (item) =>
            item.type === PhantomPiece &&
            item.props.pieceCode === PieceCode.WHITE_ROOK
        );

        // a1xh1 h1 phantomPiece is WHITE_QUEEN
        testRenderer.update(
          <CoordinateGridWithDnd position={{ h1: PieceCode.BLACK_ROOK }} />
        );

        // old phantomPiece on a1 is unmounted because coordinates are changed (from a1 to h1)
        expect(
          testInstance.findAll((item) => item === phantomPiece).length
        ).toBe(0);

        phantomPiece = testInstance.find(
          (item) =>
            item.type === PhantomPiece &&
            item.props.pieceCode === PieceCode.WHITE_ROOK
        );

        // position is not changed
        testRenderer.update(
          <CoordinateGridWithDnd position={{ h1: PieceCode.BLACK_ROOK }} />
        );

        // old phantomPiece on h1 is not unmounted because neither coordinates nor PieceCode have changed
        expect(
          testInstance.findAll((item) => item === phantomPiece).length
        ).toBe(1);
      });
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

      it("transitionDuration", () => {
        const testRenderer = TestRenderer.create(
          <CoordinateGridWithDnd position={{ e2: PieceCode.WHITE_PAWN }} />
        );
        const testInstance = testRenderer.root;

        const draggablePiece: TestRenderer.ReactTestInstance = testInstance.findByType(
          DraggablePiece
        );

        expect(draggablePiece.props.transitionDuration).toBeUndefined();

        testRenderer.update(
          <CoordinateGridWithDnd
            position={{ e2: PieceCode.WHITE_PAWN }}
            transitionDuration={600}
          />
        );

        expect(draggablePiece.props.transitionDuration).toBe(600);
      });

      describe("transitionPieces", () => {
        it("Moves with transition", () => {
          const testRenderer = TestRenderer.create(
            <CoordinateGridWithDnd
              position={{
                a1: PieceCode.WHITE_BISHOP,
                b2: PieceCode.WHITE_KING,
                c3: PieceCode.WHITE_PAWN,
              }}
            />
          );
          const testInstance = testRenderer.root;

          const getWhiteKing = () =>
            testInstance.find(
              (item) =>
                item.type === DraggablePiece &&
                item.props.pieceCode === PieceCode.WHITE_KING
            );
          const getWhiteBishop = () =>
            testInstance.find(
              (item) =>
                item.type === DraggablePiece &&
                item.props.pieceCode === PieceCode.WHITE_BISHOP
            );

          expect(getWhiteKing().props.transitionFrom).toBeUndefined();

          // b2-b4
          testRenderer.update(
            <CoordinateGridWithDnd
              position={{
                a1: PieceCode.WHITE_BISHOP,
                b4: PieceCode.WHITE_KING,
                c3: PieceCode.WHITE_PAWN,
              }}
            />
          );
          expect(getWhiteKing().props.transitionFrom).toEqual({
            algebraic: "b2",
            x: 60,
            y: 360,
          });

          // position did not changed. Transition pieces still should contain the difference between b2 and b4 positions
          testRenderer.update(
            <CoordinateGridWithDnd
              position={{
                a1: PieceCode.WHITE_BISHOP,
                b4: PieceCode.WHITE_KING,
                c3: PieceCode.WHITE_PAWN,
              }}
            />
          );
          expect(getWhiteKing().props.transitionFrom).toEqual({
            algebraic: "b2",
            x: 60,
            y: 360,
          });

          // a1xc3
          testRenderer.update(
            <CoordinateGridWithDnd
              position={{
                c3: PieceCode.WHITE_BISHOP,
                b4: PieceCode.WHITE_KING,
              }}
            />
          );

          expect(getWhiteBishop().props.transitionFrom).toEqual({
            algebraic: "a1",
            x: 0,
            y: 420,
            phantomPiece: PieceCode.WHITE_PAWN,
          });
        });

        describe("Transition on drag drop moves", () => {
          it("disabled transition if event.cancelMove() was not called", () => {
            const onDrop = jest.fn();

            const ref = createRef<ReactDndRefType>();

            const { getByTestId, rerender } = render(
              <CoordinateGridWithDnd
                ref={ref}
                onDrop={onDrop}
                position={{
                  a8: PieceCode.WHITE_BISHOP,
                }}
                draggable={true}
              />
            );

            const manager: DragDropManager = (ref.current as ReactDndRefType).getManager() as DragDropManager;

            const dragSourceId: Identifier = (ref.current as ReactDndRefType)
              .getDecoratedComponent<CoordinateGridRef>()
              .getDragHandlerId() as Identifier;
            const dropSourceId: Identifier = (ref.current as ReactDndRefType)
              .getDecoratedComponent<CoordinateGridRef>()
              .getDropHandlerId() as Identifier;

            const backend: ITestBackend = manager.getBackend() as ITestBackend;

            const clientOffset: XYCoord = {
              x: 0,
              y: 0,
            };
            act(() => {
              // move from a8
              backend.simulateBeginDrag([dragSourceId], {
                clientOffset: clientOffset,
                getSourceClientOffset() {
                  return clientOffset;
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

            // rerender with new position (after a8-b7)
            rerender(
              <CoordinateGridWithDnd
                ref={ref}
                onDrop={onDrop}
                position={{
                  b7: PieceCode.WHITE_BISHOP,
                }}
                draggable={true}
              />
            );

            // better to test it with react-test-renderer (draggablePiece.props.transitionFrom value)
            // but dnd does not work with react-test-renderer, so I created data-test-transition attribute for tests
            const coordinateGridEl = getByTestId("coordinate-grid");

            expect(
              JSON.parse(coordinateGridEl.dataset.testTransition as string)
            ).toEqual({});

            act(() => {
              backend.simulateEndDrag();
            });
          });

          it("enabled transition if event.cancelMove() was called", () => {
            const onDrop = jest.fn((event: BoardDropEvent) => {
              event.cancelMove();
            });

            const ref = createRef<ReactDndRefType>();

            const { getByTestId, rerender } = render(
              <CoordinateGridWithDnd
                ref={ref}
                onDrop={onDrop}
                position={{
                  a8: PieceCode.WHITE_BISHOP,
                }}
                draggable={true}
              />
            );

            const manager: DragDropManager = (ref.current as ReactDndRefType).getManager() as DragDropManager;

            const dragSourceId: Identifier = (ref.current as ReactDndRefType)
              .getDecoratedComponent<CoordinateGridRef>()
              .getDragHandlerId() as Identifier;
            const dropSourceId: Identifier = (ref.current as ReactDndRefType)
              .getDecoratedComponent<CoordinateGridRef>()
              .getDropHandlerId() as Identifier;

            const backend: ITestBackend = manager.getBackend() as ITestBackend;

            const clientOffset: XYCoord = {
              x: 0,
              y: 0,
            };
            act(() => {
              // move from a8
              backend.simulateBeginDrag([dragSourceId], {
                clientOffset: clientOffset,
                getSourceClientOffset() {
                  return clientOffset;
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

            // rerender with new position (after a8-b7)
            rerender(
              <CoordinateGridWithDnd
                ref={ref}
                onDrop={onDrop}
                position={{
                  b7: PieceCode.WHITE_BISHOP,
                }}
                draggable={true}
              />
            );

            // better to test it with react-test-renderer (draggablePiece.props.transitionFrom value)
            // but dnd does not work with react-test-renderer, so I created data-test-transition attribute for tests
            const coordinateGridEl = getByTestId("coordinate-grid");

            expect(
              JSON.parse(coordinateGridEl.dataset.testTransition as string)
            ).toEqual({
              b7: {
                algebraic: "a8",
                x: 0,
                y: 0,
              },
            });

            act(() => {
              backend.simulateEndDrag();
            });
          });
        });
      });
    });

    describe("PhantomPiece", () => {
      it("pieceCode", () => {
        const testRenderer = TestRenderer.create(
          <CoordinateGridWithDnd
            position={{ e2: PieceCode.WHITE_ROOK, e7: PieceCode.BLACK_PAWN }}
          />
        );
        const testInstance = testRenderer.root;

        testRenderer.update(
          <CoordinateGridWithDnd position={{ e7: PieceCode.WHITE_ROOK }} />
        );

        const phantomPiece: TestRenderer.ReactTestInstance = testInstance.findByType(
          PhantomPiece
        );
        expect(phantomPiece.props.pieceCode).toBe(PieceCode.BLACK_PAWN);
      });

      it("width", () => {
        const testRenderer = TestRenderer.create(
          <CoordinateGridWithDnd
            position={{ e2: PieceCode.WHITE_ROOK, e7: PieceCode.BLACK_PAWN }}
          />
        );
        const testInstance = testRenderer.root;

        testRenderer.update(
          <CoordinateGridWithDnd position={{ e7: PieceCode.WHITE_ROOK }} />
        );

        const phantomPiece: TestRenderer.ReactTestInstance = testInstance.findByType(
          PhantomPiece
        );
        expect(phantomPiece.props.width).toBe(60);

        testRenderer.update(
          <CoordinateGridWithDnd
            position={{ e7: PieceCode.WHITE_ROOK }}
            width={240}
          />
        );

        expect(phantomPiece.props.width).toBe(30);
      });

      it("transitionDuration", () => {
        const testRenderer = TestRenderer.create(
          <CoordinateGridWithDnd
            position={{ e2: PieceCode.WHITE_ROOK, e7: PieceCode.BLACK_PAWN }}
          />
        );
        const testInstance = testRenderer.root;

        testRenderer.update(
          <CoordinateGridWithDnd position={{ e7: PieceCode.WHITE_ROOK }} />
        );

        const phantomPiece: TestRenderer.ReactTestInstance = testInstance.findByType(
          PhantomPiece
        );

        expect(phantomPiece.props.transitionDuration).toBeUndefined();

        testRenderer.update(
          <CoordinateGridWithDnd
            position={{ e7: PieceCode.WHITE_ROOK }}
            transitionDuration={600}
          />
        );

        expect(phantomPiece.props.transitionDuration).toBe(600);
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

      it("onDragStart event", () => {
        const onDragStart = jest.fn();

        const ref = createRef<ReactDndRefType>();
        render(
          <CoordinateGridWithDnd
            ref={ref}
            position={{ a8: PieceCode.WHITE_KING }}
            draggable={true}
            onDragStart={onDragStart}
          />
        );

        const manager: DragDropManager = (ref.current as ReactDndRefType).getManager() as DragDropManager;

        const dragSourceId: Identifier = (ref.current as ReactDndRefType)
          .getDecoratedComponent<SquareRef>()
          .getDragHandlerId() as Identifier;

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
        });

        expect(onDragStart).toHaveBeenCalledTimes(1);
        expect(onDragStart).toBeCalledWith({
          coordinates: "a8",
          pieceCode: PieceCode.WHITE_KING,
        });

        act(() => {
          backend.simulateEndDrag();
        });
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
        expect(onDrop).toBeCalledWith(
          expect.objectContaining({
            sourceCoordinates: "a8",
            targetCoordinates: "b7",
            pieceCode: PieceCode.WHITE_KING,
            cancelMove: expect.any(Function),
          })
        );

        act(() => {
          backend.simulateEndDrag();
        });
      });
    });
  });
});
