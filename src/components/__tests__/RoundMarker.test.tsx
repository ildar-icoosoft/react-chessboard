import { render } from "@testing-library/react";
import React from "react";
import { RoundMarker } from "../RoundMarker";
import "@testing-library/jest-dom/extend-expect";

describe("RoundMarker", () => {
  describe("DOM structure", () => {
    it("contains data-testid round-marker", () => {
      const { queryByTestId } = render(
        <RoundMarker xYCoordinates={{ x: 0, y: 0 }} />
      );
      expect(queryByTestId("round-marker")).toBeInTheDocument();
    });

    it("contains CSS transform style", () => {
      const { getByTestId, rerender } = render(
        <RoundMarker xYCoordinates={{ x: 0, y: 0 }} />
      );

      const el: HTMLElement = getByTestId("round-marker");

      expect(el).toHaveStyle({
        transform: `translate(0px, 0px)`,
      });

      rerender(<RoundMarker xYCoordinates={{ x: 10, y: 20 }} />);

      expect(el).toHaveStyle({
        transform: `translate(10px, 20px)`,
      });
    });
  });
});
