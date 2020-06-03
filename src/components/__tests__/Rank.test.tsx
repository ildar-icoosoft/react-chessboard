import React, { createRef } from "react";
import TestRenderer from "react-test-renderer";
import { Rank, RankRef } from "../Rank";
import { Square } from "../Square";
import { PieceCode } from "../../enums/PieceCode";
import { PieceColor } from "../../enums/PieceColor";
import { Position } from "../../interfaces/Position";
import { SquareCssClasses } from "../../interfaces/SquareCssClasses";
import { PieceDropEvent } from "../../interfaces/PieceDropEvent";
import { PieceDragStartEvent } from "../../interfaces/PieceDragStartEvent";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { wrapInTestContext } from "react-dnd-test-utils";
import { ReactDndRefType } from "../../interfaces/ReactDndRefType";

jest.useFakeTimers();

describe("Rank", () => {
  const RankWithDnd = wrapInTestContext(Rank);

  it("Snapshot", () => {
    const tree = TestRenderer.create(<RankWithDnd rankName={"2"} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe("children components", () => {
    it("contains 8 Squares", () => {
      const testInstance = TestRenderer.create(<RankWithDnd rankName={"2"} />)
        .root;

      expect(testInstance.findAllByType(Square).length).toBe(8);
    });
  });

  describe("children components props", () => {
    describe("Square", () => {
      it("coordinates for white orientation", () => {
        const testInstance = TestRenderer.create(
          <RankWithDnd rankName={"2"} orientation={PieceColor.WHITE} />
        ).root;

        const squares: TestRenderer.ReactTestInstance[] = testInstance.findAllByType(
          Square
        );

        const files: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];
        for (let i = 0; i < 8; i++) {
          expect(squares[i].props.coordinates).toBe(files[i] + "2");
        }
      });

      it("coordinates for black orientation", () => {
        const testInstance = TestRenderer.create(
          <RankWithDnd rankName={"2"} orientation={PieceColor.BLACK} />
        ).root;

        const squares: TestRenderer.ReactTestInstance[] = testInstance.findAllByType(
          Square
        );

        const files: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];
        for (let i = 0; i < 8; i++) {
          expect(squares[i].props.coordinates).toBe(files[7 - i] + "2");
        }
      });

      it("pieceCode", () => {
        const position: Position = {
          a1: PieceCode.BLACK_KING,
          b2: PieceCode.WHITE_QUEEN,
          c3: PieceCode.WHITE_KNIGHT,
        };

        const testInstance = TestRenderer.create(
          <RankWithDnd rankName={"2"} position={position} />
        ).root;

        const square1: TestRenderer.ReactTestInstance = testInstance.findByProps(
          {
            coordinates: "b2",
          }
        );
        expect(square1.props.pieceCode).toBe(PieceCode.WHITE_QUEEN);

        const square2: TestRenderer.ReactTestInstance = testInstance.findByProps(
          {
            coordinates: "g2",
          }
        );
        expect(square2.props.pieceCode).toBeUndefined();
      });

      it("squareCssClasses", () => {
        const squareCssClasses: SquareCssClasses = {
          e2: ["class1", "class2"],
        };

        const testInstance = TestRenderer.create(
          <RankWithDnd rankName={"2"} squareCssClasses={squareCssClasses} />
        ).root;

        const square: TestRenderer.ReactTestInstance = testInstance.findByProps(
          {
            coordinates: "e2",
          }
        );

        expect(square.props.cssClass).toEqual(["class1", "class2"]);

        const square2: TestRenderer.ReactTestInstance = testInstance.findByProps(
          {
            coordinates: "h2",
          }
        );

        expect(square2.props.cssClass).toBeUndefined();
      });

      it("dragStartCssClass", () => {
        const dragStartCssClass: string[] = ["class1", "class2"];

        const testInstance = TestRenderer.create(
          <RankWithDnd rankName={"2"} dragStartCssClass={dragStartCssClass} />
        ).root;

        const square: TestRenderer.ReactTestInstance = testInstance.findByProps(
          {
            coordinates: "e2",
          }
        );

        expect(square.props.dragStartCssClass).toEqual(["class1", "class2"]);
      });

      it("dragEnterSquareCssClass", () => {
        const dragEnterSquareCssClass: string[] = ["class1", "class2"];

        const testInstance = TestRenderer.create(
          <RankWithDnd
            rankName={"2"}
            dragEnterSquareCssClass={dragEnterSquareCssClass}
          />
        ).root;

        const square: TestRenderer.ReactTestInstance = testInstance.findByProps(
          {
            coordinates: "e2",
          }
        );

        expect(square.props.dragEnterSquareCssClass).toEqual([
          "class1",
          "class2",
        ]);
      });

      it("transitionDuration", () => {
        const testRenderer = TestRenderer.create(
          <RankWithDnd rankName={"2"} />
        );
        const testInstance = testRenderer.root;

        const square: TestRenderer.ReactTestInstance = testInstance.findByProps(
          {
            coordinates: "e2",
          }
        );

        expect(square.props.transitionDuration).toBeUndefined();

        testRenderer.update(
          <RankWithDnd rankName={"2"} transitionDuration={600} />
        );

        expect(square.props.transitionDuration).toBe(600);
      });

      it("draggable", () => {
        const testRenderer = TestRenderer.create(
          <RankWithDnd rankName={"2"} draggable={true} />
        );
        const testInstance = testRenderer.root;

        const square: TestRenderer.ReactTestInstance = testInstance.findByProps(
          {
            coordinates: "e2",
          }
        );

        expect(square.props.draggable).toBeTruthy();

        testRenderer.update(<RankWithDnd rankName={"2"} />);

        expect(square.props.draggable).toBeFalsy();
      });

      it("allowDrag", () => {
        const allowDrag = jest.fn(() => true);

        const testRenderer = TestRenderer.create(
          <RankWithDnd rankName={"2"} allowDrag={allowDrag} />
        );
        const testInstance = testRenderer.root;

        const square: TestRenderer.ReactTestInstance = testInstance.findByProps(
          {
            coordinates: "e2",
          }
        );

        expect(square.props.allowDrag).toBe(allowDrag);

        testRenderer.update(<RankWithDnd rankName={"2"} />);

        expect(square.props.allowDrag).toBeUndefined();
      });

      it("showNotation", () => {
        const testRenderer = TestRenderer.create(
          <RankWithDnd rankName={"2"} />
        );
        const testInstance = testRenderer.root;

        const square: TestRenderer.ReactTestInstance = testInstance.findByProps(
          {
            coordinates: "e2",
          }
        );

        expect(square.props.showNotation).toBeTruthy();

        testRenderer.update(
          <RankWithDnd rankName={"2"} showNotation={false} />
        );

        expect(square.props.showNotation).toBeFalsy();
      });

      it("orientation", () => {
        const testRenderer = TestRenderer.create(
          <RankWithDnd rankName={"2"} />
        );
        const testInstance = testRenderer.root;

        const square: TestRenderer.ReactTestInstance = testInstance.findByProps(
          {
            coordinates: "b2",
          }
        );
        expect(square.props.orientation).toBe(PieceColor.WHITE);

        testRenderer.update(
          <RankWithDnd rankName={"2"} orientation={PieceColor.BLACK} />
        );

        expect(square.props.orientation).toBe(PieceColor.BLACK);
      });

      it("width", () => {
        const testRenderer = TestRenderer.create(
          <RankWithDnd rankName={"2"} />
        );
        const testInstance = testRenderer.root;

        const square: TestRenderer.ReactTestInstance = testInstance.findByProps(
          {
            coordinates: "b2",
          }
        );
        expect(square.props.width).toBe(480 / 8);

        testRenderer.update(<RankWithDnd rankName={"2"} width={240} />);

        expect(square.props.width).toBe(240 / 8);
      });

      it("transitionFrom", () => {
        const testRenderer = TestRenderer.create(
          <RankWithDnd rankName={"4"} />
        );
        const testInstance = testRenderer.root;

        const square: TestRenderer.ReactTestInstance = testInstance.findByProps(
          {
            coordinates: "e4",
          }
        );
        expect(square.props.transitionFrom).toBeUndefined();

        testRenderer.update(
          <RankWithDnd
            rankName={"4"}
            transitionPieces={{
              e4: {
                algebraic: "e2",
                x: 0,
                y: 0,
              },
            }}
          />
        );

        expect(square.props.transitionFrom).toEqual({
          algebraic: "e2",
          x: 0,
          y: 0,
        });
      });
    });
  });

  describe("Events", () => {
    it("onSquareClick", () => {
      const onSquareClick = jest.fn();

      const testInstance = TestRenderer.create(
        <RankWithDnd rankName={"2"} onSquareClick={onSquareClick} />
      ).root;

      const square: TestRenderer.ReactTestInstance = testInstance.findByProps({
        coordinates: "e2",
      });

      TestRenderer.act(() => {
        square.props.onSquareClick("e2");
      });

      expect(onSquareClick).toHaveBeenCalledTimes(1);

      expect(onSquareClick).toBeCalledWith("e2");
    });

    it("onSquareRightClick", () => {
      const onSquareRightClick = jest.fn();

      const testInstance = TestRenderer.create(
        <RankWithDnd rankName={"2"} onSquareRightClick={onSquareRightClick} />
      ).root;

      const square: TestRenderer.ReactTestInstance = testInstance.findByProps({
        coordinates: "e2",
      });

      TestRenderer.act(() => {
        square.props.onSquareRightClick("e2");
      });

      expect(onSquareRightClick).toHaveBeenCalledTimes(1);

      expect(onSquareRightClick).toBeCalledWith("e2");
    });

    it("onDragStart", () => {
      const onDragStart = jest.fn();

      const testInstance = TestRenderer.create(
        <RankWithDnd rankName={"2"} onDragStart={onDragStart} />
      ).root;

      const square: TestRenderer.ReactTestInstance = testInstance.findByProps({
        coordinates: "e2",
      });

      const dragStartEvent: PieceDragStartEvent = {
        coordinates: "e2",
        pieceCode: PieceCode.WHITE_PAWN,
      };

      TestRenderer.act(() => {
        square.props.onDragStart(dragStartEvent);
      });

      expect(onDragStart).toHaveBeenCalledTimes(1);

      expect(onDragStart).toBeCalledWith(dragStartEvent);
    });

    it("onDragEnterSquare", () => {
      const onDragEnterSquare = jest.fn();

      const testInstance = TestRenderer.create(
        <RankWithDnd rankName={"2"} onDragEnterSquare={onDragEnterSquare} />
      ).root;

      const square: TestRenderer.ReactTestInstance = testInstance.findByProps({
        coordinates: "e2",
      });

      TestRenderer.act(() => {
        square.props.onDragEnterSquare("e2");
      });

      expect(onDragEnterSquare).toHaveBeenCalledTimes(1);

      expect(onDragEnterSquare).toBeCalledWith("e2");
    });

    it("onDrop", () => {
      const onDrop = jest.fn();

      const testInstance = TestRenderer.create(
        <RankWithDnd rankName={"2"} onDrop={onDrop} />
      ).root;

      const square: TestRenderer.ReactTestInstance = testInstance.findByProps({
        coordinates: "e2",
      });

      const dropEvent: PieceDropEvent = {
        sourceCoordinates: "e2",
        targetCoordinates: "e4",
        pieceCode: PieceCode.WHITE_PAWN,
      };

      TestRenderer.act(() => {
        square.props.onDrop(dropEvent);
      });

      expect(onDrop).toHaveBeenCalledTimes(1);

      expect(onDrop).toBeCalledWith(dropEvent);
    });

    it("onMouseEnterSquare", () => {
      const onMouseEnterSquare = jest.fn();

      const testInstance = TestRenderer.create(
        <RankWithDnd rankName={"2"} onMouseEnterSquare={onMouseEnterSquare} />
      ).root;

      const square: TestRenderer.ReactTestInstance = testInstance.findByProps({
        coordinates: "e2",
      });

      TestRenderer.act(() => {
        square.props.onMouseEnterSquare("e2");
      });

      expect(onMouseEnterSquare).toHaveBeenCalledTimes(1);

      expect(onMouseEnterSquare).toBeCalledWith("e2");
    });

    it("onMouseLeaveSquare", () => {
      const onMouseLeaveSquare = jest.fn();

      const testInstance = TestRenderer.create(
        <RankWithDnd rankName={"2"} onMouseLeaveSquare={onMouseLeaveSquare} />
      ).root;

      const square: TestRenderer.ReactTestInstance = testInstance.findByProps({
        coordinates: "e2",
      });

      TestRenderer.act(() => {
        square.props.onMouseLeaveSquare("e2");
      });

      expect(onMouseLeaveSquare).toHaveBeenCalledTimes(1);

      expect(onMouseLeaveSquare).toBeCalledWith("e2");
    });
  });

  describe("methods", () => {
    it("getSquareXYCoordinates()", () => {
      const dragAndDropRef = createRef<ReactDndRefType>();

      render(<RankWithDnd rankName={"2"} ref={dragAndDropRef} />);

      const rankRef: RankRef = (dragAndDropRef.current as ReactDndRefType).getDecoratedComponent<
        RankRef
      >();

      expect(rankRef.getSquareXYCoordinates("b2")).toEqual({
        x: 0,
        y: 0,
      });
    });

    it("getSquareXYCoordinates() throws Error", () => {
      const dragAndDropRef = createRef<ReactDndRefType>();

      render(<RankWithDnd rankName={"2"} ref={dragAndDropRef} />);

      const rankRef: RankRef = (dragAndDropRef.current as ReactDndRefType).getDecoratedComponent<
        RankRef
      >();

      expect(() => rankRef.getSquareXYCoordinates("c3")).toThrow();
    });
  });

  describe("DOM structure", () => {
    it("must contain a div", () => {
      const { queryByTestId } = render(<RankWithDnd rankName={"2"} />);
      expect(queryByTestId("rank-2")).toBeInTheDocument();
    });
  });
});
