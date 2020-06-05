import React, { createRef } from "react";
import TestRenderer from "react-test-renderer";
import "@testing-library/jest-dom/extend-expect";
import { CoordinateGrid, CoordinateGridRef } from "../CoordinateGrid";
import { Piece } from "../Piece";
import { PieceCode } from "../../enums/PieceCode";
import { fireEvent, render, createEvent } from "@testing-library/react";
import { PieceColor } from "../../enums/PieceColor";
import { wrapInTestContext } from "react-dnd-test-utils";
import { ReactDndRefType } from "../../interfaces/ReactDndRefType";

jest.useFakeTimers();

describe("CoordinateGrid", () => {
  const CoordinateGridWithDnd = wrapInTestContext(CoordinateGrid);

  it("Snapshot", () => {
    const tree = TestRenderer.create(<CoordinateGridWithDnd />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe("children components", () => {
    it("contains 1 Piece", () => {
      const testRenderer = TestRenderer.create(<CoordinateGridWithDnd />);
      const testInstance = testRenderer.root;

      expect(testInstance.findAllByType(Piece).length).toBe(0);

      testRenderer.update(
        <CoordinateGridWithDnd
          position={{ e2: PieceCode.WHITE_PAWN, d5: PieceCode.BLACK_BISHOP }}
        />
      );

      expect(
        testInstance.findAll((item) => {
          return (
            item.type === Piece && item.props.pieceCode === PieceCode.WHITE_PAWN
          );
        }).length
      ).toBe(1);

      expect(
        testInstance.findAll((item) => {
          return (
            item.type === Piece &&
            item.props.pieceCode === PieceCode.BLACK_BISHOP
          );
        }).length
      ).toBe(1);
    });
  });

  describe("children components props", () => {
    describe("Piece", () => {
      it("pieceCode", () => {
        const testInstance = TestRenderer.create(
          <CoordinateGridWithDnd position={{ e2: PieceCode.WHITE_PAWN }} />
        ).root;

        const piece: TestRenderer.ReactTestInstance = testInstance.findByType(
          Piece
        );
        expect(piece.props.pieceCode).toBe(PieceCode.WHITE_PAWN);
      });

      it("width", () => {
        const testRenderer = TestRenderer.create(
          <CoordinateGridWithDnd position={{ e2: PieceCode.WHITE_PAWN }} />
        );
        const testInstance = testRenderer.root;

        const piece: TestRenderer.ReactTestInstance = testInstance.findByType(
          Piece
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
          Piece
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

      expect(() => coordinateGridRef.getDropHandlerId()).toBeTruthy();
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
});
