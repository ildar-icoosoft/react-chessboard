import TestRenderer from "react-test-renderer";
import React from "react";
import { MoveWithoutValidation } from "../MoveWithoutValidation";
import { Position } from "../../../interfaces/Position";
import { PieceCode } from "../../../enums/PieceCode";
import { is } from "ramda";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

const initialPosition: Position = {
  e2: PieceCode.WHITE_PAWN,
  f2: PieceCode.WHITE_PAWN,
};

// 1. e2-e4
const positionAfterFirstMove: Position = {
  e4: PieceCode.WHITE_PAWN,
  f2: PieceCode.WHITE_PAWN,
};

describe("MoveWithoutValidation", () => {
  describe("callback props", () => {
    it("props.children must be called", () => {
      const childrenCallback = jest.fn();

      TestRenderer.create(
        <MoveWithoutValidation>
          {(props) => {
            childrenCallback(props);
            return null;
          }}
        </MoveWithoutValidation>
      );

      expect(childrenCallback).toHaveBeenCalledTimes(1);
    });

    it("props.children default position", () => {
      const childrenCallback = jest.fn((res) => res.position);

      TestRenderer.create(
        <MoveWithoutValidation>
          {(props) => {
            childrenCallback(props);
            return null;
          }}
        </MoveWithoutValidation>
      );

      expect(childrenCallback).toHaveReturnedWith({});
    });

    it("props.children position", () => {
      const childrenCallback = jest.fn((res) => res.position);

      TestRenderer.create(
        <MoveWithoutValidation initialPosition={initialPosition}>
          {(props) => {
            childrenCallback(props);
            return null;
          }}
        </MoveWithoutValidation>
      );

      expect(childrenCallback).toHaveReturnedWith(initialPosition);
    });

    it("props.children draggable", () => {
      const childrenCallback = jest.fn((res) => res.draggable);

      TestRenderer.create(
        <MoveWithoutValidation>
          {(props) => {
            childrenCallback(props);
            return null;
          }}
        </MoveWithoutValidation>
      );

      expect(childrenCallback).toReturnWith(true);
    });

    it("props.children onDrop is a function", () => {
      const childrenCallback = jest.fn((res) => {
        return is(Function, res.onDrop);
      });

      TestRenderer.create(
        <MoveWithoutValidation>
          {(props) => {
            childrenCallback(props);
            return null;
          }}
        </MoveWithoutValidation>
      );

      expect(childrenCallback).toReturnWith(true);
    });

    describe("Move by drag and drop", () => {
      it("props.children call onDrop()", () => {
        const childrenCallback = jest.fn((res) => {
          return res.position;
        });
        let isFirstCallbackCall: boolean = true;

        TestRenderer.create(
          <MoveWithoutValidation initialPosition={initialPosition}>
            {(props) => {
              childrenCallback(props);

              if (isFirstCallbackCall) {
                isFirstCallbackCall = false;

                props.onDrop({
                  sourceCoordinates: "e2",
                  targetCoordinates: "e4",
                  pieceCode: PieceCode.WHITE_PAWN,
                  cancelMove() {},
                });
              }

              return null;
            }}
          </MoveWithoutValidation>
        );

        expect(childrenCallback).toHaveBeenCalledTimes(2);

        expect(childrenCallback).nthReturnedWith(1, initialPosition);
        expect(childrenCallback).nthReturnedWith(2, positionAfterFirstMove);
      });

      it("props.children call onDrop() on the same square", () => {
        const childrenCallback = jest.fn((res) => {
          return res.position;
        });
        let isFirstCallbackCall: boolean = true;

        TestRenderer.create(
          <MoveWithoutValidation initialPosition={initialPosition}>
            {(props) => {
              childrenCallback(props);

              if (isFirstCallbackCall) {
                isFirstCallbackCall = false;

                props.onDrop({
                  sourceCoordinates: "e2",
                  targetCoordinates: "e2",
                  pieceCode: PieceCode.WHITE_PAWN,
                  cancelMove() {},
                });
              }

              return null;
            }}
          </MoveWithoutValidation>
        );

        expect(childrenCallback).toHaveBeenCalledTimes(2);

        expect(childrenCallback).nthReturnedWith(1, initialPosition);
        expect(childrenCallback).nthReturnedWith(2, initialPosition);
      });
    });

    it("props.children onSquareClick is a function", () => {
      const childrenCallback = jest.fn((res) => {
        return is(Function, res.onSquareClick);
      });

      TestRenderer.create(
        <MoveWithoutValidation>
          {(props) => {
            childrenCallback(props);
            return null;
          }}
        </MoveWithoutValidation>
      );

      expect(childrenCallback).toReturnWith(true);
    });

    describe("Move by click", () => {
      it("props.children onSquareClick() e2-e4", () => {
        const childrenCallback = jest.fn((res) => {
          return res.position;
        });
        let isFirstCallbackCall: boolean = true;

        TestRenderer.create(
          <MoveWithoutValidation initialPosition={initialPosition}>
            {(props) => {
              childrenCallback(props);

              if (isFirstCallbackCall) {
                isFirstCallbackCall = false;

                props.onSquareClick("e2");
                props.onSquareClick("e4");
              }

              return null;
            }}
          </MoveWithoutValidation>
        );

        expect(childrenCallback).toHaveBeenCalledTimes(3);

        expect(childrenCallback).nthReturnedWith(1, initialPosition);
        expect(childrenCallback).nthReturnedWith(3, positionAfterFirstMove);
      });

      it("props.children onSquareClick() on empty square", () => {
        const childrenCallback = jest.fn((res) => {
          return res.position;
        });
        let isFirstCallbackCall: boolean = true;

        TestRenderer.create(
          <MoveWithoutValidation initialPosition={initialPosition}>
            {(props) => {
              childrenCallback(props);

              if (isFirstCallbackCall) {
                isFirstCallbackCall = false;

                props.onSquareClick("e4");
                props.onSquareClick("e2");
              }

              return null;
            }}
          </MoveWithoutValidation>
        );

        expect(childrenCallback).toHaveBeenCalledTimes(2);

        expect(childrenCallback).nthReturnedWith(1, initialPosition);
        expect(childrenCallback).nthReturnedWith(2, initialPosition);
      });
    });
  });

  describe("With react-dom", () => {
    describe("DOM structure", () => {
      it("must contain children", () => {
        const { container } = render(
          <MoveWithoutValidation>
            {() => <div data-testid="some-children"></div>}
          </MoveWithoutValidation>
        );

        expect(container).toContainHTML(
          '<div data-testid="some-children"></div>'
        );
      });
    });
  });
});
