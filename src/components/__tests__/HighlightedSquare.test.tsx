import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { DraggablePiece } from "../DraggablePiece";
import { PieceCode } from "../../enums/PieceCode";
import { HighlightedSquare, HighlightedSquareType } from "../HighlightedSquare";

jest.useFakeTimers();

describe("HighlightedSquare", () => {
  describe("DOM structure", () => {
    it("empty content if empty props.types", () => {
      const { container, rerender } = render(
        <HighlightedSquare
          types={[HighlightedSquareType.CURRENT_PREMOVE]}
          xYCoordinates={{ x: 0, y: 0 }}
        />
      );

      expect(container).not.toBeEmpty();

      rerender(<HighlightedSquare xYCoordinates={{ x: 0, y: 0 }} />);

      expect(container).toBeEmpty();
    });

    it("contains data-testid highlighted-square", () => {
      const { queryByTestId } = render(
        <HighlightedSquare
          types={[HighlightedSquareType.CURRENT_PREMOVE]}
          xYCoordinates={{ x: 0, y: 0 }}
        />
      );
      expect(queryByTestId("highlighted-square")).toBeInTheDocument();
    });

    it("contains CSS transform style", () => {
      const { getByTestId, rerender } = render(
        <DraggablePiece
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
        <DraggablePiece
          pieceCode={PieceCode.WHITE_KING}
          xYCoordinates={{ x: 10, y: 20 }}
        />
      );

      expect(el).toHaveStyle({
        transform: `translate(10px, 20px)`,
      });
    });
  });
});
