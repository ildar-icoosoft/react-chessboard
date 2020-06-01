import React from "react";
import TestRenderer from "react-test-renderer";
import { Notation } from "../Notation";
import { PieceColor } from "../../enums/PieceColor";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

jest.useFakeTimers();

describe("Notation", () => {
  it("Snapshot", () => {
    const testRenderer = TestRenderer.create(
      <Notation coordinates={"a1"} orientation={PieceColor.WHITE} />
    );

    expect(testRenderer.toJSON()).toMatchSnapshot();

    testRenderer.update(
      <Notation coordinates={"a3"} orientation={PieceColor.WHITE} />
    );
    expect(testRenderer.toJSON()).toMatchSnapshot();

    testRenderer.update(
      <Notation coordinates={"d1"} orientation={PieceColor.WHITE} />
    );
    expect(testRenderer.toJSON()).toMatchSnapshot();

    testRenderer.update(
      <Notation coordinates={"h8"} orientation={PieceColor.BLACK} />
    );
    expect(testRenderer.toJSON()).toMatchSnapshot();

    testRenderer.update(
      <Notation coordinates={"h6"} orientation={PieceColor.BLACK} />
    );
    expect(testRenderer.toJSON()).toMatchSnapshot();

    testRenderer.update(
      <Notation coordinates={"d8"} orientation={PieceColor.BLACK} />
    );
    expect(testRenderer.toJSON()).toMatchSnapshot();
  });

  describe("DOM structure", () => {
    it("Empty notation", () => {
      const { container } = render(
        <Notation coordinates={"b1"} orientation={PieceColor.BLACK} />
      );

      expect(container.innerHTML).toBe("");
    });

    it("Rank notation", () => {
      const { queryByTestId } = render(
        <Notation coordinates={"a5"} orientation={PieceColor.WHITE} />
      );
      expect(queryByTestId("notation-rank-5")).toBeInTheDocument();
    });

    it("File notation", () => {
      const { queryByTestId } = render(
        <Notation coordinates={"f8"} orientation={PieceColor.BLACK} />
      );
      expect(queryByTestId("notation-file-f")).toBeInTheDocument();
    });

    it("File And Rank notation", () => {
      const { queryByTestId } = render(
        <Notation coordinates={"a1"} orientation={PieceColor.WHITE} />
      );
      expect(queryByTestId("notation-rank-1")).toBeInTheDocument();
      expect(queryByTestId("notation-file-a")).toBeInTheDocument();
    });
  });
});
