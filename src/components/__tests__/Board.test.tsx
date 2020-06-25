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
import { Position } from "../../interfaces/Position";
import { INITIAL_BOARD_FEN } from "../../constants/constants";
import { ValidMoves } from "../../types/ValidMoves";

jest.useFakeTimers();

const initialPosition: Position = {
  e2: PieceCode.WHITE_PAWN,
  f2: PieceCode.WHITE_PAWN,
  e1: PieceCode.WHITE_KING,
  f5: PieceCode.BLACK_KING,
  e7: PieceCode.BLACK_PAWN,
  d3: PieceCode.BLACK_PAWN,
};

const initialPositionValidMoves: ValidMoves = {
  e1: ["d2", "f1", "d1", "g1", "c1"],
  e2: ["e3", "e4", "d3"],
  f2: ["f3", "f4"],
};

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

        it("fen to position object", () => {
          const fen: string = "8/8/4k3/4P3/4K3/8/8/8 w - -";

          const testRenderer = TestRenderer.create(<Board position={fen} />);
          const testInstance = testRenderer.root;

          const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
            CoordinateGrid
          );

          expect(coordinateGrid.props.position).toEqual({
            e4: PieceCode.WHITE_KING,
            e6: PieceCode.BLACK_KING,
            e5: PieceCode.WHITE_PAWN,
          });
        });

        it("if position is neither a valid FEN nor a valid Position Object", () => {
          const invalidFen = "8/8/7/4k3/4P3/4K3/8/8/8 w - -";

          const testRenderer = TestRenderer.create(
            <Board position={invalidFen} />
          );
          const testInstance = testRenderer.root;

          const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
            CoordinateGrid
          );

          expect(coordinateGrid.props.position).toEqual({});

          // @ts-ignore
          testRenderer.update(<Board position={null} />);
          expect(coordinateGrid.props.position).toEqual({});

          const invalidPositionObject: Position = {
            e4: PieceCode.WHITE_KING,
            e6: PieceCode.BLACK_KING,
            e5: PieceCode.WHITE_PAWN,
            f9: PieceCode.WHITE_PAWN,
          };

          testRenderer.update(<Board position={invalidPositionObject} />);
          expect(coordinateGrid.props.position).toEqual({});
        });
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

      it("allowMoveFrom", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
          CoordinateGrid
        );

        expect(coordinateGrid.props.allowDrag).toBeUndefined();

        const allowMoveFrom = jest.fn();

        testRenderer.update(<Board allowMoveFrom={allowMoveFrom} />);

        expect(coordinateGrid.props.allowDrag).toBe(allowMoveFrom);
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

      describe("selectionSquare", () => {
        it("default value", () => {
          const testRenderer = TestRenderer.create(
            <Board position={INITIAL_BOARD_FEN} clickable={true} />
          );
          const testInstance = testRenderer.root;

          const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
            CoordinateGrid
          );

          expect(coordinateGrid.props.selectionSquare).toBeUndefined();
        });

        it("click-click moves are allowed", () => {
          // Click-click moves are allowed (turnColor white, clickable true, movableColor both)
          const testRenderer = TestRenderer.create(
            <Board position={INITIAL_BOARD_FEN} clickable={true} />
          );
          const testInstance = testRenderer.root;

          const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
            CoordinateGrid
          );

          TestRenderer.act(() => {
            coordinateGrid.props.onClick("a1");
          });

          // add selection if square contains movable piece
          expect(coordinateGrid.props.selectionSquare).toBe("a1");

          TestRenderer.act(() => {
            coordinateGrid.props.onClick("e1");
          });

          // change selection if user clicks on another one piece
          expect(coordinateGrid.props.selectionSquare).toBe("e1");

          TestRenderer.act(() => {
            coordinateGrid.props.onClick("e1");
          });

          // clear selection if user clicks again on this square
          expect(coordinateGrid.props.selectionSquare).toBeUndefined();

          // first click on empty square
          TestRenderer.act(() => {
            coordinateGrid.props.onClick("a3");
          });

          // do not add selection if square does not contain a piece
          expect(coordinateGrid.props.selectionSquare).toBeUndefined();

          // first click on opposite piece
          TestRenderer.act(() => {
            coordinateGrid.props.onClick("e7");
          });

          // do not add selection if square does not contain a piece
          expect(coordinateGrid.props.selectionSquare).toBeUndefined();

          TestRenderer.act(() => {
            coordinateGrid.props.onClick("e1");
          });
          TestRenderer.act(() => {
            coordinateGrid.props.onClick("d5");
          });

          // invalid move. we must clear selection
          expect(coordinateGrid.props.selectionSquare).toBeUndefined();
        });

        it("clear selectionSquare after click-click move", () => {
          const testRenderer = TestRenderer.create(
            <Board
              position={initialPosition}
              clickable={true}
              validMoves={initialPositionValidMoves}
            />
          );
          const testInstance = testRenderer.root;

          const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
            CoordinateGrid
          );

          TestRenderer.act(() => {
            coordinateGrid.props.onClick("e2");
          });

          expect(coordinateGrid.props.selectionSquare).toBe("e2");

          TestRenderer.act(() => {
            coordinateGrid.props.onClick("e4");
          });

          // add selection if square contains movable piece
          expect(coordinateGrid.props.selectionSquare).toBeUndefined();
        });

        it("click-click moves are not allowed", () => {
          // Click-click moves are allowed (turnColor white, clickable true, movableColor both)
          const testRenderer = TestRenderer.create(
            <Board position={INITIAL_BOARD_FEN} clickable={false} />
          );
          const testInstance = testRenderer.root;

          const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
            CoordinateGrid
          );

          TestRenderer.act(() => {
            coordinateGrid.props.onClick("e2");
          });

          expect(coordinateGrid.props.selectionSquare).toBeUndefined();

          testRenderer.update(
            <Board
              position={INITIAL_BOARD_FEN}
              clickable={true}
              movableColor={PieceColor.BLACK}
            />
          );

          TestRenderer.act(() => {
            coordinateGrid.props.onClick("e2");
          });

          expect(coordinateGrid.props.selectionSquare).toBeUndefined();
        });

        it("Drag and drop moves are allowed", () => {
          // Click-click moves are allowed (turnColor white, clickable true, movableColor both)
          const testRenderer = TestRenderer.create(
            <Board position={INITIAL_BOARD_FEN} draggable={true} />
          );
          const testInstance = testRenderer.root;

          const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
            CoordinateGrid
          );

          TestRenderer.act(() => {
            coordinateGrid.props.onDragStart({
              coordinates: "e2",
              pieceCode: PieceCode.WHITE_PAWN,
            });
          });

          // add selection if square contains movable piece
          expect(coordinateGrid.props.selectionSquare).toBe("e2");

          TestRenderer.act(() => {
            coordinateGrid.props.onDragStart({
              coordinates: "d2",
              pieceCode: PieceCode.WHITE_PAWN,
            });
          });

          // add selection if square contains movable piece
          expect(coordinateGrid.props.selectionSquare).toBe("d2");
        });

        it("Drag and drop moves are not allowed", () => {
          // Click-click moves are allowed (turnColor white, clickable true, movableColor both)
          const testRenderer = TestRenderer.create(
            <Board position={INITIAL_BOARD_FEN} draggable={false} />
          );
          const testInstance = testRenderer.root;

          const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
            CoordinateGrid
          );

          TestRenderer.act(() => {
            coordinateGrid.props.onDragStart({
              coordinates: "e2",
              pieceCode: PieceCode.WHITE_PAWN,
            });
          });

          expect(coordinateGrid.props.selectionSquare).toBeUndefined();

          testRenderer.update(
            <Board
              position={INITIAL_BOARD_FEN}
              draggable={true}
              movableColor={PieceColor.BLACK}
            />
          );

          TestRenderer.act(() => {
            coordinateGrid.props.onDragStart({
              coordinates: "e2",
              pieceCode: PieceCode.WHITE_PAWN,
            });
          });

          expect(coordinateGrid.props.selectionSquare).toBeUndefined();
        });

        it("clear selectionSquare after onDragEnd", () => {
          const testRenderer = TestRenderer.create(
            <Board
              position={initialPosition}
              draggable={true}
              validMoves={initialPositionValidMoves}
            />
          );
          const testInstance = testRenderer.root;

          const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
            CoordinateGrid
          );

          TestRenderer.act(() => {
            coordinateGrid.props.onDragStart({
              coordinates: "e2",
              pieceCode: PieceCode.WHITE_PAWN,
            });
          });

          expect(coordinateGrid.props.selectionSquare).toBe("e2");

          TestRenderer.act(() => {
            coordinateGrid.props.onDragEnd();
          });

          // add selection if square contains movable piece
          expect(coordinateGrid.props.selectionSquare).toBeUndefined();
        });
      });

      it("occupationSquares", () => {
        const testRenderer = TestRenderer.create(
          <Board
            clickable={true}
            position={initialPosition}
            validMoves={initialPositionValidMoves}
          />
        );
        const testInstance = testRenderer.root;

        const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
          CoordinateGrid
        );

        expect(coordinateGrid.props.occupationSquares).toEqual([]);

        TestRenderer.act(() => {
          coordinateGrid.props.onClick("e2");
        });

        expect(coordinateGrid.props.occupationSquares).toEqual(["d3"]);
      });

      it("destinationSquares", () => {
        const testRenderer = TestRenderer.create(
          <Board
            position={initialPosition}
            clickable={true}
            validMoves={initialPositionValidMoves}
          />
        );
        const testInstance = testRenderer.root;

        const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
          CoordinateGrid
        );

        expect(coordinateGrid.props.destinationSquares).toEqual([]);

        TestRenderer.act(() => {
          coordinateGrid.props.onClick("e2");
        });

        expect(coordinateGrid.props.destinationSquares).toEqual([
          "e3",
          "e4",
          "d3",
        ]);
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

      it("checkSquares", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
          CoordinateGrid
        );

        expect(coordinateGrid.props.checkSquare).toBeUndefined();

        testRenderer.update(<Board check={true} />);

        expect(coordinateGrid.props.checkSquare).toBeUndefined();

        testRenderer.update(
          <Board
            check={true}
            position={{ e1: PieceCode.WHITE_KING, e8: PieceCode.BLACK_KING }}
          />
        );

        expect(coordinateGrid.props.checkSquare).toBe("e1");

        testRenderer.update(
          <Board
            check={true}
            turnColor={PieceColor.BLACK}
            position={{ e1: PieceCode.WHITE_KING, e8: PieceCode.BLACK_KING }}
          />
        );

        expect(coordinateGrid.props.checkSquare).toBe("e8");
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
    describe("onMove", () => {
      it("Allowed Click-click move", () => {
        // Click-click moves are allowed (turnColor white, clickable true, movableColor both)
        const onMove = jest.fn();

        const testRenderer = TestRenderer.create(
          <Board
            position={initialPosition}
            clickable={true}
            onMove={onMove}
            validMoves={initialPositionValidMoves}
          />
        );
        const testInstance = testRenderer.root;

        const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
          CoordinateGrid
        );

        // valid move
        TestRenderer.act(() => {
          coordinateGrid.props.onClick("e2");
        });
        TestRenderer.act(() => {
          coordinateGrid.props.onClick("e4");
        });

        expect(onMove).toBeCalledTimes(1);

        expect(onMove).toBeCalledWith({
          from: "e2",
          to: "e4",
        });

        onMove.mockClear();

        // invalid move
        TestRenderer.act(() => {
          coordinateGrid.props.onClick("e2");
        });
        TestRenderer.act(() => {
          coordinateGrid.props.onClick("e5");
        });

        expect(onMove).toBeCalledTimes(0);
      });

      it("Forbidden Click-click move", () => {
        // Click-click moves are allowed (turnColor white, clickable true, movableColor both)
        const onMove = jest.fn();

        const testRenderer = TestRenderer.create(
          <Board
            position={initialPosition}
            movableColor={PieceColor.BLACK} // turnColor is white, so moves are forbidden
            clickable={true}
            onMove={onMove}
            validMoves={initialPositionValidMoves}
          />
        );
        const testInstance = testRenderer.root;

        const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
          CoordinateGrid
        );

        // valid move
        TestRenderer.act(() => {
          coordinateGrid.props.onClick("e2");
        });
        TestRenderer.act(() => {
          coordinateGrid.props.onClick("e4");
        });

        expect(onMove).toBeCalledTimes(0);

        onMove.mockClear();

        testRenderer.update(
          <Board
            position={initialPosition}
            clickable={false} // clickable false, so moves are forbidden
            onMove={onMove}
            validMoves={initialPositionValidMoves}
          />
        );

        TestRenderer.act(() => {
          coordinateGrid.props.onClick("e2");
        });
        TestRenderer.act(() => {
          coordinateGrid.props.onClick("e4");
        });

        expect(onMove).toBeCalledTimes(0);
      });

      it("Allowed Drag and drop move", () => {
        // Drag and drop moves are allowed (turnColor white, draggable true, movableColor both)
        const onMove = jest.fn();

        const testRenderer = TestRenderer.create(
          <Board
            position={initialPosition}
            draggable={true}
            onMove={onMove}
            validMoves={initialPositionValidMoves}
          />
        );
        const testInstance = testRenderer.root;

        const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
          CoordinateGrid
        );

        // valid move
        TestRenderer.act(() => {
          coordinateGrid.props.onDrop({
            sourceCoordinates: "e2",
            targetCoordinates: "e4",
            pieceCode: PieceCode.WHITE_PAWN,
            cancelMove() {},
            disableTransitionInNextPosition() {},
          });
        });

        expect(onMove).toBeCalledTimes(1);

        expect(onMove).toBeCalledWith({
          from: "e2",
          to: "e4",
        });

        onMove.mockClear();

        // invalid move
        TestRenderer.act(() => {
          coordinateGrid.props.onDrop({
            sourceCoordinates: "e2",
            targetCoordinates: "e5",
            pieceCode: PieceCode.WHITE_PAWN,
            cancelMove() {},
            disableTransitionInNextPosition() {},
          });
        });

        expect(onMove).toBeCalledTimes(0);
      });

      it("dropEvent disableTransitionInNextPosition() must be called if move is valid", () => {
        const testRenderer = TestRenderer.create(
          <Board
            position={initialPosition}
            draggable={true}
            validMoves={initialPositionValidMoves}
          />
        );
        const testInstance = testRenderer.root;

        const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
          CoordinateGrid
        );

        const disableTransitionInNextPosition = jest.fn();

        // valid move
        TestRenderer.act(() => {
          coordinateGrid.props.onDrop({
            sourceCoordinates: "e2",
            targetCoordinates: "e4",
            pieceCode: PieceCode.WHITE_PAWN,
            disableTransitionInNextPosition,
          });
        });

        expect(disableTransitionInNextPosition).toBeCalledTimes(1);
      });

      it("Forbidden Drag and drop move", () => {
        // Click-click moves are allowed (turnColor white, clickable true, movableColor both)
        const onMove = jest.fn();

        const testRenderer = TestRenderer.create(
          <Board
            position={initialPosition}
            movableColor={PieceColor.BLACK} // turnColor is white, so moves are forbidden
            draggable={true}
            onMove={onMove}
            validMoves={initialPositionValidMoves}
          />
        );
        const testInstance = testRenderer.root;

        const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
          CoordinateGrid
        );

        TestRenderer.act(() => {
          coordinateGrid.props.onDrop({
            sourceCoordinates: "e2",
            targetCoordinates: "e4",
            pieceCode: PieceCode.WHITE_PAWN,
            cancelMove() {},
            disableTransitionInNextPosition() {},
          });
        });

        expect(onMove).toBeCalledTimes(0);

        onMove.mockClear();

        testRenderer.update(
          <Board
            position={initialPosition}
            draggable={false} // clickable false, so moves are forbidden
            onMove={onMove}
            validMoves={initialPositionValidMoves}
          />
        );

        TestRenderer.act(() => {
          coordinateGrid.props.onDrop({
            sourceCoordinates: "e2",
            targetCoordinates: "e4",
            pieceCode: PieceCode.WHITE_PAWN,
            cancelMove() {},
            disableTransitionInNextPosition() {},
          });
        });

        expect(onMove).toBeCalledTimes(0);
      });
    });

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

    it("onDragEnd", () => {
      const onDragEnd = jest.fn();

      const testInstance = TestRenderer.create(<Board onDragEnd={onDragEnd} />)
        .root;

      const coordinateGrid: TestRenderer.ReactTestInstance = testInstance.findByType(
        CoordinateGrid
      );

      TestRenderer.act(() => {
        coordinateGrid.props.onDragEnd();
      });

      expect(onDragEnd).toBeCalledTimes(1);
      expect(onDragEnd).toBeCalledWith();
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
        disableTransitionInNextPosition() {},
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
