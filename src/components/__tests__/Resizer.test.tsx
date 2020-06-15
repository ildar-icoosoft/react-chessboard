import { render } from "@testing-library/react";
import React from "react";
import { Resizer } from "../Resizer";
import "@testing-library/jest-dom/extend-expect";

describe("Resizer", () => {
  describe("DOM structure", () => {
    it("contains data-testid resizer", () => {
      const { queryByTestId } = render(<Resizer width={480} minWidth={100} />);
      expect(queryByTestId("resizer")).toBeInTheDocument();
    });
  });
});
