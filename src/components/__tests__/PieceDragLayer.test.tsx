import React, { createRef } from "react";
import TestRenderer from "react-test-renderer";
import { PieceCode } from "../../enums/PieceCode";
import { act, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ReactDndRefType } from "../../interfaces/ReactDndRefType";
import { DragDropManager, Identifier } from "dnd-core";
import { Square, SquareRef } from "../Square";
import { ITestBackend } from "react-dnd-test-backend";
import { wrapInTestContext } from "react-dnd-test-utils";
import { PieceDragLayer } from "../PieceDragLayer";
import { XYCoord } from "react-dnd";
import { Piece } from "../Piece";

jest.useFakeTimers();

describe("PieceDragLayer", () => {
  const SquareWithDnd = wrapInTestContext(Square);
  const PieceDragLayerWithDnd = wrapInTestContext(PieceDragLayer);

  let dragSourceId: Identifier;
  let backend: ITestBackend;

  beforeEach(() => {
    const squareRef = createRef<ReactDndRefType>();
    render(
      <SquareWithDnd
        ref={squareRef}
        coordinates={"a2"}
        draggable={true}
        pieceCode={PieceCode.WHITE_QUEEN}
      />
    );

    const manager: DragDropManager = (squareRef.current as ReactDndRefType).getManager() as DragDropManager;

    dragSourceId = (squareRef.current as ReactDndRefType)
      .getDecoratedComponent<SquareRef>()
      .getDragHandlerId() as Identifier;

    backend = manager.getBackend() as ITestBackend;
  });

  afterEach(() => {
    act(() => {
      backend.simulateEndDrag();
    });
  });

  describe("Drag an Drop", () => {
    it("contains a piece", () => {
      const clientOffset: XYCoord = {
        x: 100,
        y: 100,
      };

      act(() => {
        backend.simulateBeginDrag([dragSourceId], {
          clientOffset: clientOffset,
          getSourceClientOffset() {
            return clientOffset;
          },
        });
      });

      const testInstance = TestRenderer.create(
        <PieceDragLayerWithDnd width={70} />
      ).root;

      expect(() => testInstance.findByType(Piece)).not.toThrow();

      const piece = testInstance.findByType(Piece);

      expect(piece.props.pieceCode).toBe(PieceCode.WHITE_QUEEN);
      expect(piece.props.width).toBe(70);
    });

    it("should not render if there is no clientOffset", () => {
      const { container } = render(<PieceDragLayerWithDnd />);

      act(() => {
        backend.simulateBeginDrag([dragSourceId]);
      });

      expect(container).toBeEmpty();
    });

    it("should render on drag start", () => {
      const { container } = render(<PieceDragLayerWithDnd />);

      expect(container).toBeEmpty();

      const clientOffset: XYCoord = {
        x: 100,
        y: 100,
      };

      act(() => {
        backend.simulateBeginDrag([dragSourceId], {
          clientOffset: clientOffset,
          getSourceClientOffset() {
            return clientOffset;
          },
        });
      });

      expect(container).not.toBeEmpty();
    });

    it("should contain transform style", () => {
      const { getByTestId } = render(<PieceDragLayerWithDnd width={70} />);

      const clientOffset: XYCoord = {
        x: 100,
        y: 100,
      };

      act(() => {
        backend.simulateBeginDrag([dragSourceId], {
          clientOffset: clientOffset,
          getSourceClientOffset() {
            return clientOffset;
          },
        });
      });

      const pieceDragLayerEl = getByTestId("piece-drag-layer");

      // 100 - (70 / 2) === 65
      expect(pieceDragLayerEl.style.transform).toBe("translate(65px, 65px)");
    });
  });
});
