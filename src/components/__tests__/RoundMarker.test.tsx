import { render } from "@testing-library/react";
import React from "react";
import { RoundMarker } from "../RoundMarker";
import "@testing-library/jest-dom/extend-expect";

describe("RoundMarker", () => {
  describe("DOM structure", () => {
    it("contains data-testid round-marker", () => {
      const { queryByTestId } = render(
        <svg>
          <RoundMarker xYCoordinates={{ x: 0, y: 0 }} />
        </svg>
      );
      expect(queryByTestId("round-marker")).toBeInTheDocument();
    });

    it("contains SVG cx, cy attributes", () => {
      const { getByTestId, rerender } = render(
        <svg>
          <RoundMarker xYCoordinates={{ x: 0, y: 0 }} />
        </svg>
      );

      let el: HTMLElement = getByTestId("round-marker");

      expect(el).toHaveAttribute("cx", String(0 + 60 / 2));
      expect(el).toHaveAttribute("cy", String(0 + 60 / 2));

      rerender(
        <svg>
          <RoundMarker xYCoordinates={{ x: 10, y: 20 }} />
        </svg>
      );

      el = getByTestId("round-marker");

      expect(el).toHaveAttribute("cx", String(10 + 60 / 2));
      expect(el).toHaveAttribute("cy", String(20 + 60 / 2));
    });
  });
});
