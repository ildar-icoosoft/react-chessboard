import { render, fireEvent } from "@testing-library/react";
import React from "react";
import { Resizer } from "../Resizer";
import "@testing-library/jest-dom/extend-expect";

describe("Resizer", () => {
  describe("events", () => {
    it("onResize()", () => {
      const onResize = jest.fn();

      const { getByTestId } = render(
        <div
          style={{ width: "1000px", height: "1000px", position: "relative" }}
        >
          <Resizer width={480} minWidth={100} onResize={onResize} />
        </div>
      );

      const el = getByTestId("resizer");

      fireEvent.mouseDown(el);
      fireEvent.mouseMove(el, {
        clientX: -100,
        clientY: -100,
      });
      fireEvent.mouseUp(el);

      fireEvent.mouseDown(el);
      fireEvent.mouseMove(el, {
        clientX: -400,
        clientY: -400,
      });
      fireEvent.mouseUp(el);

      expect(onResize).toBeCalledTimes(2);
      expect(onResize).nthCalledWith(1, 380); // 480 - 100 = 380
      expect(onResize).nthCalledWith(2, 100); // 480 - 400 = 80, ut minWidth is 100
      // expect(onResize).nthCalledWith(3, 120); // 80 + 40

      // fireEvent.mouseUp(el);
      //
      // fireEvent.mouseDown(el);
    });
  });

  describe("DOM structure", () => {
    it("contains data-testid resizer", () => {
      const { queryByTestId } = render(<Resizer width={480} minWidth={100} />);
      expect(queryByTestId("resizer")).toBeInTheDocument();
    });
  });
});
