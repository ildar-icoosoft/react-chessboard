import React from "react";
import TestRenderer from "react-test-renderer";
import { Board } from "../Board";
import { PieceColor } from "../../enums/PieceColor";
import { PieceCode } from "../../enums/PieceCode";
import { PieceDragLayer } from "../PieceDragLayer";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { PieceDropEvent } from "../../interfaces/PieceDropEvent";
import { Coords } from "../Coords";
import { CoordinateGrid } from "../CoordinateGrid";
import { PieceDragStartEvent } from "../../interfaces/PieceDragStartEvent";
import { Resizer } from "../Resizer";
jest.useFakeTimers();

describe("Board", () => {
  it("Snapshot", () => {
    const tree = TestRenderer.create(<Board />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe("children components", () => {
    it("contains 1 PieceDragLayer", () => {
      const testInstance = TestRenderer.create(<Board />).root;

      expect(testInstance.findAllByType(PieceDragLayer).length).toBe(1);
    });

    it("contains 1 Coords", () => {
      const testRenderer = TestRenderer.create(<Board />);
      const testInstance = testRenderer.root;

      expect(testInstance.findAllByType(Coords).length).toBe(1);

      testRenderer.update(<Board showCoordinates={false} />);

      expect(testInstance.findAllByType(Coords).length).toBe(0);
    });

    it("contains 1 CoordinateGrid", () => {
      const testRenderer = TestRenderer.create(<Board />);
      const testInstance = testRenderer.root;

      expect(testInstance.findAllByType(CoordinateGrid).length).toBe(1);
    });

    it("contains 1 Resizer", () => {
      const testRenderer = TestRenderer.create(<Board />);
      const testInstance = testRenderer.root;

      expect(testInstance.findAllByType(Resizer).length).toBe(1);

      testRenderer.update(<Board showResizer={false} />);

      expect(testInstance.findAllByType(Resizer).length).toBe(0);
    });
  });

  describe("children components props", () => {
    describe("PieceDragLayer", () => {
      it("width", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const pieceDragLayer: TestRenderer.ReactTestInstance = testInstance.findByType(
          PieceDragLayer
        );

        expect(pieceDragLayer.props.width).toBe(480 / 8);

        testRenderer.update(<Board width={240} />);

        expect(pieceDragLayer.props.width).toBe(240 / 8);
      });
    });

    describe("Coords", () => {
      it("orientation", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const coords: TestRenderer.ReactTestInstance = testInstance.findByType(
          Coords
        );

        expect(coords.props.orientation).toBe(PieceColor.WHITE);

        testRenderer.update(<Board orientation={PieceColor.BLACK} />);

        expect(coords.props.orientation).toBe(PieceColor.BLACK);
      });
    });

    describe("CoordinateGrid", () => {
      it("orientation", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
          CoordinateGrid
        );

        expect(coordinateGrid.props.orientation).toBe(PieceColor.WHITE);

        testRenderer.update(<Board orientation={PieceColor.BLACK} />);

        expect(coordinateGrid.props.orientation).toBe(PieceColor.BLACK);
      });

      describe("position", () => {
        it("position object", () => {
          const testRenderer = TestRenderer.create(<Board />);
          const testInstance = testRenderer.root;

          const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
            CoordinateGrid
          );

          expect(coordinateGrid.props.position).toEqual({});

          testRenderer.update(
            <Board position={{ e2: PieceCode.WHITE_PAWN }} />
          );

          expect(coordinateGrid.props.position).toEqual({
            e2: PieceCode.WHITE_PAWN,
          });
        });

        // it("fen to position object", () => {
        //   const fen: string = "8/8/4k3/4P3/4K3/8/8/8 w - -";
        //
        //   const testRenderer = TestRenderer.create(<Board position={fen} />);
        //   const testInstance = testRenderer.root;
        //
        //   const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
        //     CoordinateGrid
        //   );
        //
        //   expect(coordinateGrid.props.position).toEqual({
        //     e4: PieceCode.WHITE_KING, e6: PieceCode.BLACK_KING, e5: PieceCode.WHITE_PAWN });
        // });
      });

      it("width", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
          CoordinateGrid
        );

        expect(coordinateGrid.props.width).toBe(480);

        testRenderer.update(<Board width={800} />);

        expect(coordinateGrid.props.width).toBe(800);
      });

      it("draggable", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
          CoordinateGrid
        );

        expect(coordinateGrid.props.draggable).toBeFalsy();

        testRenderer.update(<Board draggable={true} />);

        expect(coordinateGrid.props.draggable).toBeTruthy();
      });

      it("allowDrag", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
          CoordinateGrid
        );

        expect(coordinateGrid.props.allowDrag).toBeUndefined();

        const allowDrag = jest.fn();

        testRenderer.update(<Board allowDrag={allowDrag} />);

        expect(coordinateGrid.props.allowDrag).toBe(allowDrag);
      });

      it("transitionDuration", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
          CoordinateGrid
        );

        expect(coordinateGrid.props.transitionDuration).toBe(300);

        testRenderer.update(<Board transitionDuration={600} />);

        expect(coordinateGrid.props.transitionDuration).toBe(600);
      });

      it("selectionSquares", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
          CoordinateGrid
        );

        expect(coordinateGrid.props.selectionSquares).toBeUndefined();

        testRenderer.update(<Board selectionSquares={["a1"]} />);

        expect(coordinateGrid.props.selectionSquares).toEqual(["a1"]);
      });

      it("occupationSquares", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
          CoordinateGrid
        );

        expect(coordinateGrid.props.occupationSquares).toBeUndefined();

        testRenderer.update(<Board occupationSquares={["a1"]} />);

        expect(coordinateGrid.props.occupationSquares).toEqual(["a1"]);
      });

      it("destinationSquares", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
          CoordinateGrid
        );

        expect(coordinateGrid.props.destinationSquares).toBeUndefined();

        testRenderer.update(<Board destinationSquares={["a1"]} />);

        expect(coordinateGrid.props.destinationSquares).toEqual(["a1"]);
      });

      it("lastMoveSquares", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
          CoordinateGrid
        );

        expect(coordinateGrid.props.lastMoveSquares).toBeUndefined();

        testRenderer.update(<Board lastMoveSquares={["a1"]} />);

        expect(coordinateGrid.props.lastMoveSquares).toEqual(["a1"]);
      });

      it("currentPremoveSquares", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
          CoordinateGrid
        );

        expect(coordinateGrid.props.currentPremoveSquares).toBeUndefined();

        testRenderer.update(<Board currentPremoveSquares={["a1"]} />);

        expect(coordinateGrid.props.currentPremoveSquares).toEqual(["a1"]);
      });

      describe("onRightClick", () => {
        it("Right Click event must be prevented", () => {
          const testRenderer = TestRenderer.create(<Board />);
          const testInstance = testRenderer.root;

          const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
            CoordinateGrid
          );

          let mouseEvent = new MouseEvent("contextMenu", {
            bubbles: true,
            cancelable: true,
          });

          TestRenderer.act(() => {
            coordinateGrid.props.onRightClick({
              coordinates: "a1",
              mouseEvent,
            });
          });

          expect(mouseEvent.defaultPrevented).toBeFalsy();

          testRenderer.update(<Board allowMarkers={true} />);

          mouseEvent = new MouseEvent("contextMenu", {
            bubbles: true,
            cancelable: true,
          });

          TestRenderer.act(() => {
            coordinateGrid.props.onRightClick({
              coordinates: "a1",
              mouseEvent,
            });
          });

          expect(mouseEvent.defaultPrevented).toBeTruthy();
        });
      });

      describe("roundMarkers", () => {
        it("toggle roundMarker on right click if allowMarkers is true", () => {
          const testRenderer = TestRenderer.create(
            <Board allowMarkers={true} />
          );
          const testInstance = testRenderer.root;

          const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
            CoordinateGrid
          );

          expect(coordinateGrid.props.roundMarkers).toEqual([]);

          const mouseEvent = new MouseEvent("contextMenu", {
            bubbles: true,
            cancelable: true,
          });

          TestRenderer.act(() => {
            coordinateGrid.props.onRightClick({
              coordinates: "a1",
              mouseEvent,
            });
          });

          expect(coordinateGrid.props.roundMarkers).toEqual(["a1"]);

          TestRenderer.act(() => {
            coordinateGrid.props.onRightClick({
              coordinates: "a2",
              mouseEvent,
            });
          });
          expect(coordinateGrid.props.roundMarkers).toEqual(["a1", "a2"]);

          TestRenderer.act(() => {
            coordinateGrid.props.onRightClick({
              coordinates: "a1",
              mouseEvent,
            });
          });
          expect(coordinateGrid.props.roundMarkers).toEqual(["a2"]);
        });

        it("ignore right clicks if allowMarkers is false", () => {
          const testRenderer = TestRenderer.create(<Board />);
          const testInstance = testRenderer.root;

          const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
            CoordinateGrid
          );

          expect(coordinateGrid.props.roundMarkers).toEqual([]);

          const mouseEvent = new MouseEvent("contextMenu", {
            bubbles: true,
            cancelable: true,
          });

          TestRenderer.act(() => {
            coordinateGrid.props.onRightClick({
              coordinates: "a1",
              mouseEvent,
            });
          });

          expect(coordinateGrid.props.roundMarkers).toEqual([]);

          TestRenderer.act(() => {
            coordinateGrid.props.onRightClick({
              coordinates: "a1",
              mouseEvent,
            });
          });

          expect(coordinateGrid.props.roundMarkers).toEqual([]);
        });

        it("left click must clear roundMarkers", () => {
          const testRenderer = TestRenderer.create(
            <Board allowMarkers={true} />
          );
          const testInstance = testRenderer.root;

          const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
            CoordinateGrid
          );

          const mouseEvent = new MouseEvent("contextMenu", {
            bubbles: true,
            cancelable: true,
          });

          TestRenderer.act(() => {
            coordinateGrid.props.onRightClick({
              coordinates: "a1",
              mouseEvent,
            });
          });

          TestRenderer.act(() => {
            coordinateGrid.props.onRightClick({
              coordinates: "a2",
              mouseEvent,
            });
          });
          expect(coordinateGrid.props.roundMarkers).toEqual(["a1", "a2"]);

          TestRenderer.act(() => {
            coordinateGrid.props.onClick("a1");
          });

          expect(coordinateGrid.props.roundMarkers).toEqual([]);
        });

        it("drag start must clear roundMarkers", () => {
          const testRenderer = TestRenderer.create(
            <Board allowMarkers={true} />
          );
          const testInstance = testRenderer.root;

          const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
            CoordinateGrid
          );

          const mouseEvent = new MouseEvent("contextMenu", {
            bubbles: true,
            cancelable: true,
          });

          TestRenderer.act(() => {
            coordinateGrid.props.onRightClick({
              coordinates: "a1",
              mouseEvent,
            });
          });

          TestRenderer.act(() => {
            coordinateGrid.props.onRightClick({
              coordinates: "a2",
              mouseEvent,
            });
          });
          expect(coordinateGrid.props.roundMarkers).toEqual(["a1", "a2"]);

          TestRenderer.act(() => {
            coordinateGrid.props.onDragStart({
              coordinates: "a1",
              pieceCode: PieceCode.WHITE_KNIGHT,
            });
          });

          expect(coordinateGrid.props.roundMarkers).toEqual([]);
        });
      });
    });

    describe("Resizer", () => {
      it("width", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const resizer: TestRenderer.ReactTestInstance = testInstance.findByType(
          Resizer
        );

        expect(resizer.props.width).toBe(480);

        testRenderer.update(<Board width={240} />);

        expect(resizer.props.width).toBe(240);
      });
      it("minWidth", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const resizer: TestRenderer.ReactTestInstance = testInstance.findByType(
          Resizer
        );

        expect(resizer.props.minWidth).toBe(160);

        testRenderer.update(<Board minWidth={200} />);

        expect(resizer.props.minWidth).toBe(200);
      });
      it("maxWidth", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const resizer: TestRenderer.ReactTestInstance = testInstance.findByType(
          Resizer
        );

        expect(resizer.props.maxWidth).toBe(Infinity);

        testRenderer.update(<Board maxWidth={800} />);

        expect(resizer.props.maxWidth).toBe(800);
      });
    });
  });

  describe("Events", () => {
    it("onSquareClick", () => {
      const onSquareClick = jest.fn();

      const testInstance = TestRenderer.create(
        <Board onSquareClick={onSquareClick} />
      ).root;

      const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
        CoordinateGrid
      );

      TestRenderer.act(() => {
        coordinateGrid.props.onClick("e2");
      });

      expect(onSquareClick).toBeCalledTimes(1);

      expect(onSquareClick).toBeCalledWith("e2");
    });

    it("onDragStart", () => {
      const onDragStart = jest.fn();

      const testInstance = TestRenderer.create(
        <Board onDragStart={onDragStart} />
      ).root;

      const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
        CoordinateGrid
      );

      const dragStartEvent: PieceDragStartEvent = {
        coordinates: "e2",
        pieceCode: PieceCode.WHITE_PAWN,
      };

      TestRenderer.act(() => {
        coordinateGrid.props.onDragStart(dragStartEvent);
      });

      expect(onDragStart).toBeCalledTimes(1);

      expect(onDragStart).toBeCalledWith(dragStartEvent);
    });

    it("onDrop", () => {
      const onDrop = jest.fn();
      const cancelMove = jest.fn();

      const testInstance = TestRenderer.create(<Board onDrop={onDrop} />).root;

      const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
        CoordinateGrid
      );

      const dropEvent: PieceDropEvent = {
        sourceCoordinates: "e2",
        targetCoordinates: "e4",
        pieceCode: PieceCode.WHITE_PAWN,
        cancelMove,
      };

      TestRenderer.act(() => {
        coordinateGrid.props.onDrop(dropEvent);
      });

      expect(onDrop).toBeCalledTimes(1);

      expect(onDrop).toBeCalledWith(dropEvent);
    });

    it("onResize", () => {
      const onResize = jest.fn();

      const testInstance = TestRenderer.create(<Board onResize={onResize} />)
        .root;

      const resizer: TestRenderer.ReactTestInstance = testInstance.findByType(
        Resizer
      );

      TestRenderer.act(() => {
        resizer.props.onResize(300);
      });

      expect(onResize).toBeCalledTimes(1);

      expect(onResize).toBeCalledWith(300);
    });
  });

  describe("DOM structure", () => {
    it("should contain data-testid board", () => {
      const { queryByTestId } = render(<Board />);
      expect(queryByTestId("board")).toBeInTheDocument();
    });

    it("board contains width and height styles", () => {
      const { getByTestId, rerender } = render(<Board />);

      const boardEl = getByTestId("board");

      expect(boardEl).toHaveStyle({
        width: "480px",
        height: "480px",
      });

      rerender(<Board width={240} />);

      expect(boardEl).toHaveStyle({
        width: "240px",
        height: "240px",
      });
    });
  });
});
