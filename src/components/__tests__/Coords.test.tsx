import React from "react";
import TestRenderer from "react-test-renderer";
import "@testing-library/jest-dom/extend-expect";
import { Coords } from "../Coords";
import { render } from "@testing-library/react";

jest.useFakeTimers();

describe("Square", () => {
  it("Snapshot", () => {
    const tree = TestRenderer.create(<Coords />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe("DOM structure", () => {
    it("should contain data-testid coords-ranks", () => {
      const { queryByTestId } = render(<Coords />);
      expect(queryByTestId("coords-ranks")).toBeInTheDocument();
    });

    it("should contain data-testid coords-files", () => {
      const { queryByTestId } = render(<Coords />);
      expect(queryByTestId("coords-files")).toBeInTheDocument();
    });
  });
});
