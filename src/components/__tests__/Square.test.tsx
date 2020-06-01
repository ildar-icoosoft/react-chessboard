import React, { createRef } from "react";
import TestRenderer from "react-test-renderer";
import { Square, SquareRef } from "../Square";
import { Piece } from "../Piece";
import { PieceCode } from "../../enums/PieceCode";
import { Notation } from "../Notation";
import { PieceColor } from "../../enums/PieceColor";
import { render, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ReactDndRefType } from "../../interfaces/ReactDndRefType";
import { ITestBackend } from "react-dnd-test-backend";
import { DragDropManager, Identifier } from "dnd-core";
import { wrapInTestContext } from "react-dnd-test-utils";
import { PhantomPiece } from "../PhantomPiece";

jest.useFakeTimers();

describe("Square", () => {
  const SquareWithDnd = wrapInTestContext(Square);

  it("Snapshot", () => {
    const tree = TestRenderer.create(
      <SquareWithDnd coordinates={"a1"} pieceCode={PieceCode.BLACK_QUEEN} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe("children components", () => {
    it("contains 1 Piece", () => {
      const testInstance = TestRenderer.create(
        <SquareWithDnd coordinates={"a1"} pieceCode={PieceCode.BLACK_QUEEN} />
      ).root;

      expect(() => testInstance.findByType(Piece)).not.toThrow();
    });

    it("does not contain a Piece", () => {
      const testInstance = TestRenderer.create(
        <SquareWithDnd coordinates={"a1"} />
      ).root;

      expect(() => testInstance.findByType(Piece)).toThrow();
    });

    it("contains 1 PhantomPiece", () => {
      const testInstance = TestRenderer.create(
        <SquareWithDnd
          coordinates={"a1"}
          pieceCode={PieceCode.BLACK_QUEEN}
          transitionFrom={{
            algebraic: "e2",
            x: 0,
            y: 0,
            phantomPiece: PieceCode.WHITE_BISHOP,
          }}
        />
      ).root;

      expect(() => testInstance.findByType(PhantomPiece)).not.toThrow();
    });

    it("contains 1 Notation", () => {
      const testRenderer = TestRenderer.create(
        <SquareWithDnd coordinates={"a1"} />
      );
      const testInstance = testRenderer.root;

      expect(() => testInstance.findByType(Notation)).not.toThrow();

      testRenderer.update(
        <SquareWithDnd coordinates={"a1"} showNotation={false} />
      );

      expect(() => testInstance.findByType(Notation)).toThrow();
    });
  });

  describe("children components props", () => {
    describe("Piece", () => {
      it("pieceCode", () => {
        const testInstance = TestRenderer.create(
          <SquareWithDnd coordinates={"a1"} pieceCode={PieceCode.BLACK_QUEEN} />
        ).root;

        const piece: TestRenderer.ReactTestInstance = testInstance.findByType(
          Piece
        );
        expect(piece.props.pieceCode).toBe(PieceCode.BLACK_QUEEN);
      });

      it("width", () => {
        const testRenderer = TestRenderer.create(
          <SquareWithDnd coordinates={"a1"} pieceCode={PieceCode.BLACK_QUEEN} />
        );
        const testInstance = testRenderer.root;

        const piece: TestRenderer.ReactTestInstance = testInstance.findByType(
          Piece
        );
        expect(piece.props.width).toBe(60);

        testRenderer.update(
          <SquareWithDnd
            coordinates={"a1"}
            pieceCode={PieceCode.BLACK_QUEEN}
            width={30}
          />
        );
        expect(piece.props.width).toBe(30);
      });

      it("transitionDuration", () => {
        const testRenderer = TestRenderer.create(
          <SquareWithDnd coordinates={"a1"} pieceCode={PieceCode.BLACK_QUEEN} />
        );
        const testInstance = testRenderer.root;

        const piece: TestRenderer.ReactTestInstance = testInstance.findByType(
          Piece
        );

        expect(piece.props.transitionDuration).toBeUndefined();

        testRenderer.update(
          <SquareWithDnd
            coordinates={"a1"}
            pieceCode={PieceCode.BLACK_QUEEN}
            transitionDuration={600}
          />
        );

        expect(piece.props.transitionDuration).toBe(600);
      });

      it("transitionFrom", () => {
        const testRenderer = TestRenderer.create(
          <SquareWithDnd coordinates={"e4"} pieceCode={PieceCode.BLACK_QUEEN} />
        );
        const testInstance = testRenderer.root;

        let piece: TestRenderer.ReactTestInstance;

        piece = testInstance.findByType(Piece);
        expect(piece.props.transitionFrom).toBeUndefined();

        testRenderer.update(
          <SquareWithDnd
            coordinates={"e4"}
            pieceCode={PieceCode.BLACK_QUEEN}
            transitionFrom={{
              algebraic: "e2",
              x: 0,
              y: 0,
            }}
          />
        );

        piece = testInstance.findByType(Piece);
        expect(piece.props.transitionFrom).toEqual({
          algebraic: "e2",
          x: 0,
          y: 0,
        });
      });
    });

    describe("PhantomPiece", () => {
      it("pieceCode", () => {
        const testInstance = TestRenderer.create(
          <SquareWithDnd
            coordinates={"a1"}
            pieceCode={PieceCode.BLACK_QUEEN}
            transitionFrom={{
              algebraic: "e2",
              x: 0,
              y: 0,
              phantomPiece: PieceCode.WHITE_ROOK,
            }}
          />
        ).root;

        const phantomPiece: TestRenderer.ReactTestInstance = testInstance.findByType(
          PhantomPiece
        );
        expect(phantomPiece.props.pieceCode).toBe(PieceCode.WHITE_ROOK);
      });

      it("width", () => {
        const testRenderer = TestRenderer.create(
          <SquareWithDnd
            coordinates={"a1"}
            pieceCode={PieceCode.BLACK_QUEEN}
            transitionFrom={{
              algebraic: "e2",
              x: 0,
              y: 0,
              phantomPiece: PieceCode.WHITE_ROOK,
            }}
          />
        );
        const testInstance = testRenderer.root;

        const phantomPiece: TestRenderer.ReactTestInstance = testInstance.findByType(
          PhantomPiece
        );
        expect(phantomPiece.props.width).toBe(60);

        testRenderer.update(
          <SquareWithDnd
            coordinates={"a1"}
            pieceCode={PieceCode.BLACK_QUEEN}
            width={30}
            transitionFrom={{
              algebraic: "e2",
              x: 0,
              y: 0,
              phantomPiece: PieceCode.WHITE_ROOK,
            }}
          />
        );

        expect(phantomPiece.props.width).toBe(30);
      });

      it("transitionDuration", () => {
        const testRenderer = TestRenderer.create(
          <SquareWithDnd
            coordinates={"a1"}
            pieceCode={PieceCode.BLACK_QUEEN}
            transitionFrom={{
              algebraic: "e2",
              x: 0,
              y: 0,
              phantomPiece: PieceCode.WHITE_ROOK,
            }}
          />
        );
        const testInstance = testRenderer.root;

        const piece: TestRenderer.ReactTestInstance = testInstance.findByType(
          PhantomPiece
        );

        expect(piece.props.transitionDuration).toBeUndefined();

        testRenderer.update(
          <SquareWithDnd
            coordinates={"a1"}
            pieceCode={PieceCode.BLACK_QUEEN}
            transitionFrom={{
              algebraic: "e2",
              x: 0,
              y: 0,
              phantomPiece: PieceCode.WHITE_ROOK,
            }}
            transitionDuration={600}
          />
        );

        expect(piece.props.transitionDuration).toBe(600);
      });
    });

    describe("Notation", () => {
      it("coordinates and orientation", () => {
        const testInstance = TestRenderer.create(
          <SquareWithDnd coordinates={"a1"} orientation={PieceColor.BLACK} />
        ).root;

        expect(() => {
          testInstance.find(
            (node) =>
              node.type === Notation &&
              node.props.coordinates === "a1" &&
              node.props.orientation === PieceColor.BLACK
          );
        }).not.toThrow();
      });

      it("width", () => {
        const testRenderer = TestRenderer.create(
          <SquareWithDnd coordinates={"a1"} orientation={PieceColor.BLACK} />
        );

        const testInstance = testRenderer.root;

        const notation: TestRenderer.ReactTestInstance = testInstance.findByType(
          Notation
        );
        expect(notation.props.width).toBe(60);

        testRenderer.update(
          <SquareWithDnd
            coordinates={"a1"}
            pieceCode={PieceCode.BLACK_QUEEN}
            width={30}
          />
        );
        expect(notation.props.width).toBe(30);
      });
    });
  });

  describe("children components remounting", () => {
    describe("Piece", () => {
      it("remounts if transitionFrom.algebraic is changed", () => {
        const testRenderer = TestRenderer.create(
          <SquareWithDnd coordinates={"e4"} pieceCode={PieceCode.BLACK_QUEEN} />
        );
        const testInstance = testRenderer.root;

        let piece: TestRenderer.ReactTestInstance;
        piece = testInstance.findByType(Piece);

        testRenderer.update(
          <SquareWithDnd
            coordinates={"e4"}
            pieceCode={PieceCode.BLACK_QUEEN}
            transitionFrom={{
              algebraic: "e2",
              x: 0,
              y: 0,
            }}
          />
        );

        // old piece is unmounted because transitionFrom is changed (from undefined to object)
        expect(testInstance.findAll((item) => item === piece).length).toBe(0);

        piece = testInstance.findByType(Piece);

        testRenderer.update(
          <SquareWithDnd
            coordinates={"e4"}
            pieceCode={PieceCode.BLACK_QUEEN}
            transitionFrom={{
              algebraic: "h8",
              x: 0,
              y: 0,
            }}
          />
        );

        // old piece is unmounted because transitionFrom.algebraic is changed (from e2 to h8)
        expect(testInstance.findAll((item) => item === piece).length).toBe(0);

        piece = testInstance.findByType(Piece);

        testRenderer.update(
          <SquareWithDnd
            coordinates={"e8"}
            pieceCode={PieceCode.WHITE_PAWN}
            transitionFrom={{
              algebraic: "h8",
              x: 100,
              y: 200,
            }}
          />
        );

        // old piece is not unmounted because transitionFrom.algebraic is not changed
        expect(testInstance.findAll((item) => item === piece).length).toBe(1);
      });
    });

    describe("PhantomPiece", () => {
      it("remounts if transitionFrom.algebraic is changed", () => {
        const testRenderer = TestRenderer.create(
          <SquareWithDnd
            coordinates={"e4"}
            pieceCode={PieceCode.BLACK_QUEEN}
            transitionFrom={{
              algebraic: "e2",
              x: 0,
              y: 0,
              phantomPiece: PieceCode.WHITE_ROOK,
            }}
          />
        );
        const testInstance = testRenderer.root;

        let phantomPiece: TestRenderer.ReactTestInstance;
        phantomPiece = testInstance.findByType(PhantomPiece);

        testRenderer.update(
          <SquareWithDnd
            coordinates={"e4"}
            pieceCode={PieceCode.BLACK_QUEEN}
            transitionFrom={{
              algebraic: "h1",
              x: 0,
              y: 0,
              phantomPiece: PieceCode.WHITE_ROOK,
            }}
          />
        );

        // old piece is unmounted because transitionFrom is changed (from e2 to h1)
        expect(
          testInstance.findAll((item) => item === phantomPiece).length
        ).toBe(0);

        phantomPiece = testInstance.findByType(PhantomPiece);

        testRenderer.update(
          <SquareWithDnd
            coordinates={"a1"}
            pieceCode={PieceCode.BLACK_QUEEN}
            transitionFrom={{
              algebraic: "h1",
              x: 100,
              y: 200,
              phantomPiece: PieceCode.WHITE_KNIGHT,
            }}
          />
        );

        // old piece is not unmounted because transitionFrom.algebraic is not changed
        expect(
          testInstance.findAll((item) => item === phantomPiece).length
        ).toBe(1);
      });
    });
  });

  describe("methods", () => {
    it("getDragHandlerId()", () => {
      const dragAndDropRef = createRef<ReactDndRefType>();

      TestRenderer.create(
        <SquareWithDnd ref={dragAndDropRef} coordinates={"a1"} />
      );

      const squareRef: SquareRef = (dragAndDropRef.current as ReactDndRefType).getDecoratedComponent<
        SquareRef
      >();

      expect(() => squareRef.getDragHandlerId()).toBeTruthy();
    });

    it("getDropHandlerId()", () => {
      const dragAndDropRef = createRef<ReactDndRefType>();

      TestRenderer.create(
        <SquareWithDnd ref={dragAndDropRef} coordinates={"a1"} />
      );

      const squareRef: SquareRef = (dragAndDropRef.current as ReactDndRefType).getDecoratedComponent<
        SquareRef
      >();

      expect(() => squareRef.getDropHandlerId()).toBeTruthy();
    });

    it("getXYCoordinates()", () => {
      const dragAndDropRef = createRef<ReactDndRefType>();

      render(<SquareWithDnd ref={dragAndDropRef} coordinates={"a1"} />);

      const squareRef: SquareRef = (dragAndDropRef.current as ReactDndRefType).getDecoratedComponent<
        SquareRef
      >();

      expect(squareRef.getXYCoordinates()).toEqual({
        x: 0,
        y: 0,
      });
    });
  });

  describe("DOM structure", () => {
    it("Square color", () => {
      const { queryByTestId, rerender } = render(
        <SquareWithDnd coordinates={"a1"} />
      );
      expect(queryByTestId("square-a1")).toHaveClass("dark");

      rerender(<SquareWithDnd coordinates={"a2"} />);
      expect(queryByTestId("square-a2")).toHaveClass("light");

      rerender(<SquareWithDnd coordinates={"e5"} />);
      expect(queryByTestId("square-e5")).toHaveClass("dark");

      rerender(<SquareWithDnd coordinates={"g4"} />);
      expect(queryByTestId("square-g4")).toHaveClass("light");
    });

    it("must contain a div element in the root", () => {
      const { queryByTestId } = render(<SquareWithDnd coordinates={"a2"} />);
      expect(queryByTestId("square-a2")).toBeInTheDocument();
    });

    it("cssClass prop in div classList", () => {
      const { queryByTestId } = render(
        <SquareWithDnd coordinates={"a2"} cssClass={["class1", "class2"]} />
      );
      expect(queryByTestId("square-a2")).toHaveClass("class1", "class2");
    });
  });

  describe("Events", () => {
    it("Click", () => {
      const onSquareClick = jest.fn();
      const onSquareRightClick = jest.fn();

      const { getByTestId } = render(
        <SquareWithDnd
          coordinates={"a1"}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
        />
      );

      fireEvent.click(getByTestId("square-a1"));

      expect(onSquareClick).toHaveBeenCalledTimes(1);
      expect(onSquareClick).toBeCalledWith("a1");

      expect(onSquareRightClick).toHaveBeenCalledTimes(0);
    });

    it("Click if no callback", () => {
      const { getByTestId } = render(<SquareWithDnd coordinates={"a1"} />);
      expect(() => {
        fireEvent.click(getByTestId("square-a1"));
      }).not.toThrow();
    });

    it("Right Click", () => {
      const onSquareClick = jest.fn();
      const onSquareRightClick = jest.fn();

      const { getByTestId } = render(
        <SquareWithDnd
          coordinates={"a1"}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
        />
      );

      fireEvent.contextMenu(getByTestId("square-a1"));

      expect(onSquareRightClick).toHaveBeenCalledTimes(1);
      expect(onSquareRightClick).toBeCalledWith("a1");

      expect(onSquareClick).toHaveBeenCalledTimes(0);
    });

    it("Right Click if no callback", () => {
      const { getByTestId } = render(<SquareWithDnd coordinates={"a1"} />);
      expect(() => {
        fireEvent.contextMenu(getByTestId("square-a1"));
      }).not.toThrow();
    });

    it("onMouseEnterSquare", () => {
      const onMouseEnterSquare = jest.fn();

      const { getByTestId } = render(
        <SquareWithDnd
          coordinates={"a1"}
          onMouseEnterSquare={onMouseEnterSquare}
        />
      );

      fireEvent.mouseOver(getByTestId("square-a1"));

      expect(onMouseEnterSquare).toHaveBeenCalledTimes(1);
      expect(onMouseEnterSquare).toBeCalledWith("a1");
    });

    it("onMouseEnterSquare if no callback", () => {
      const { getByTestId } = render(<SquareWithDnd coordinates={"a1"} />);
      expect(() => {
        fireEvent.mouseOver(getByTestId("square-a1"));
      }).not.toThrow();
    });

    it("onMouseLeaveSquare", () => {
      const onMouseLeaveSquare = jest.fn();

      const { getByTestId } = render(
        <SquareWithDnd
          coordinates={"a1"}
          onMouseLeaveSquare={onMouseLeaveSquare}
        />
      );

      fireEvent.mouseOut(getByTestId("square-a1"));

      expect(onMouseLeaveSquare).toHaveBeenCalledTimes(1);
      expect(onMouseLeaveSquare).toBeCalledWith("a1");
    });

    it("onMouseLeaveSquare if no callback", () => {
      const { getByTestId } = render(<SquareWithDnd coordinates={"a1"} />);
      expect(() => {
        fireEvent.mouseOut(getByTestId("square-a1"));
      }).not.toThrow();
    });
  });

  describe("Drag and Drop", () => {
    describe("Begin Drag", () => {
      it("Cannot drag if draggable === false", () => {
        const ref = createRef<ReactDndRefType>();

        render(
          <SquareWithDnd
            ref={ref}
            coordinates={"a2"}
            draggable={false}
            pieceCode={PieceCode.WHITE_QUEEN}
          />
        );

        const manager: DragDropManager = (ref.current as ReactDndRefType).getManager() as DragDropManager;

        const dragSourceId: Identifier = (ref.current as ReactDndRefType)
          .getDecoratedComponent<SquareRef>()
          .getDragHandlerId() as Identifier;

        expect(manager.getMonitor().canDragSource(dragSourceId)).toBeFalsy();
      });

      it("Cannot drag if no piece", () => {
        const ref = createRef<ReactDndRefType>();

        render(<SquareWithDnd ref={ref} coordinates={"a2"} draggable={true} />);

        const manager: DragDropManager = (ref.current as ReactDndRefType).getManager() as DragDropManager;

        const dragSourceId: Identifier = (ref.current as ReactDndRefType)
          .getDecoratedComponent<SquareRef>()
          .getDragHandlerId() as Identifier;

        expect(manager.getMonitor().canDragSource(dragSourceId)).toBeFalsy();
      });

      it("Can drag if contains piece and draggable === true", () => {
        const ref = createRef<ReactDndRefType>();

        render(
          <SquareWithDnd
            ref={ref}
            coordinates={"a2"}
            draggable={true}
            pieceCode={PieceCode.WHITE_QUEEN}
          />
        );

        const manager: DragDropManager = (ref.current as ReactDndRefType).getManager() as DragDropManager;

        const dragSourceId: Identifier = (ref.current as ReactDndRefType)
          .getDecoratedComponent<SquareRef>()
          .getDragHandlerId() as Identifier;

        expect(manager.getMonitor().canDragSource(dragSourceId)).toBeTruthy();
      });

      it("onDragStart event", () => {
        const onDragStart = jest.fn();

        const ref = createRef<ReactDndRefType>();

        render(
          <SquareWithDnd
            ref={ref}
            coordinates={"a2"}
            draggable={true}
            pieceCode={PieceCode.WHITE_QUEEN}
            onDragStart={onDragStart}
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

        expect(onDragStart).toHaveBeenCalledTimes(1);
        expect(onDragStart).toBeCalledWith({
          coordinates: "a2",
          pieceCode: PieceCode.WHITE_QUEEN,
        });

        act(() => {
          backend.simulateEndDrag();
        });
      });

      it("CSS classes", () => {
        const ref = createRef<ReactDndRefType>();

        const { queryByTestId } = render(
          <SquareWithDnd
            ref={ref}
            coordinates={"a2"}
            draggable={true}
            dragStartCssClass={"drag-start"}
            pieceCode={PieceCode.WHITE_QUEEN}
          />
        );

        const manager: DragDropManager = (ref.current as ReactDndRefType).getManager() as DragDropManager;

        const dragSourceId: Identifier = (ref.current as ReactDndRefType)
          .getDecoratedComponent<SquareRef>()
          .getDragHandlerId() as Identifier;

        expect(queryByTestId("square-a2")).not.toHaveClass("drag-start");

        const backend: ITestBackend = manager.getBackend() as ITestBackend;

        act(() => {
          backend.simulateBeginDrag([dragSourceId]);
        });

        expect(queryByTestId("square-a2")).toHaveClass("drag-start");

        act(() => {
          backend.simulateEndDrag();
        });
      });
    });

    describe("Drag over", () => {
      it("onDragEnterSquare event", () => {
        const onDragEnterSquare = jest.fn();

        const ref = createRef<ReactDndRefType>();

        render(
          <SquareWithDnd
            ref={ref}
            coordinates={"a2"}
            draggable={true}
            pieceCode={PieceCode.WHITE_QUEEN}
            onDragEnterSquare={onDragEnterSquare}
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
          backend.simulateBeginDrag([dragSourceId]);
          backend.simulateHover([dropSourceId]);
        });

        expect(onDragEnterSquare).toHaveBeenCalledTimes(1);
        expect(onDragEnterSquare).toBeCalledWith("a2");

        act(() => {
          backend.simulateEndDrag();
        });
      });

      describe("CSS classes", () => {
        const ref = createRef<ReactDndRefType>();

        const { queryByTestId } = render(
          <SquareWithDnd
            ref={ref}
            coordinates={"a2"}
            draggable={true}
            dragEnterSquareCssClass={"drag-enter"}
            pieceCode={PieceCode.WHITE_QUEEN}
          />
        );

        const manager: DragDropManager = (ref.current as ReactDndRefType).getManager() as DragDropManager;

        const dragSourceId: Identifier = (ref.current as ReactDndRefType)
          .getDecoratedComponent<SquareRef>()
          .getDragHandlerId() as Identifier;
        const dropSourceId: Identifier = (ref.current as ReactDndRefType)
          .getDecoratedComponent<SquareRef>()
          .getDropHandlerId() as Identifier;

        expect(queryByTestId("square-a2")).not.toHaveClass("drag-enter");

        const backend: ITestBackend = manager.getBackend() as ITestBackend;

        act(() => {
          backend.simulateBeginDrag([dragSourceId]);
          backend.simulateHover([dropSourceId]);
        });

        expect(queryByTestId("square-a2")).toHaveClass("drag-enter");

        act(() => {
          backend.simulateEndDrag();
        });
      });
    });

    describe("Drop", () => {
      it("onDrop event", () => {
        const onDrop = jest.fn();

        const ref = createRef<ReactDndRefType>();

        render(
          <SquareWithDnd
            ref={ref}
            coordinates={"a2"}
            draggable={true}
            pieceCode={PieceCode.WHITE_QUEEN}
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
          backend.simulateBeginDrag([dragSourceId]);
          backend.simulateHover([dropSourceId]);
          backend.simulateDrop();
        });

        expect(onDrop).toHaveBeenCalledTimes(1);
        expect(onDrop).toBeCalledWith({
          sourceCoordinates: "a2",
          targetCoordinates: "a2",
          pieceCode: PieceCode.WHITE_QUEEN,
        });

        act(() => {
          backend.simulateEndDrag();
        });
      });
    });
  });
});
