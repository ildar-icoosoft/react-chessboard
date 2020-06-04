import React from "react";
import TestRenderer from "react-test-renderer";
import "@testing-library/jest-dom/extend-expect";
import { Coords } from "../Coords";

jest.useFakeTimers();

describe("Square", () => {
  it("Snapshot", () => {
    const tree = TestRenderer.create(<Coords />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
