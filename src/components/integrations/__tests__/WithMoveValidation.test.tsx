import TestRenderer from "react-test-renderer";
import React from "react";
import {
  WithMoveValidation,
  WithMoveValidationCallbackProps,
} from "../WithMoveValidation";
import { Position } from "../../../interfaces/Position";
import { PieceCode } from "../../../enums/PieceCode";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import {
  INITIAL_BOARD_FEN,
  INITIAL_BOARD_POSITION,
} from "../../../constants/constants";
import { PieceColor } from "../../../enums/PieceColor";
import { ValidMoves } from "../../../types/ValidMoves";

const initialFen: string = "8/4p3/8/5k2/8/3p4/4PP2/4K3 w KQkq - 0 1";

const checkmateFen: string = "4k3/4Q3/4K3/8/8/8/8/8 b - - 0 1";

const initialPosition: Position = {
  e2: PieceCode.WHITE_PAWN,
  f2: PieceCode.WHITE_PAWN,
  e1: PieceCode.WHITE_KING,
  f5: PieceCode.BLACK_KING,
  e7: PieceCode.BLACK_PAWN,
  d3: PieceCode.BLACK_PAWN,
};

const initialPositionValidMoves: ValidMoves = {
  e1: ["d2", "f1", "d1", "g1", "c1"],
  e2: ["e3", "e4", "d3"],
  f2: ["f3", "f4"],
};

// 1. e2-e4
const positionAfterFirstMove: Position = {
  e4: PieceCode.WHITE_PAWN,
  f2: PieceCode.WHITE_PAWN,
  e1: PieceCode.WHITE_KING,
  f5: PieceCode.BLACK_KING,
  e7: PieceCode.BLACK_PAWN,
  d3: PieceCode.BLACK_PAWN,
};

const positionAfterFirstMoveValidMoves: ValidMoves = {
  f5: ["e6", "f6", "g6", "g5", "g4", "f4", "e4", "e5"],
};

const renderWithMoveValidation = (fen?: string) => {
  let callbackProps: WithMoveValidationCallbackProps;

  TestRenderer.create(
    <WithMoveValidation initialFen={fen}>
      {(props) => {
        callbackProps = props;

        return null;
      }}
    </WithMoveValidation>
  );

  return {
    getProps() {
      return callbackProps;
    },
  };
};

jest.useFakeTimers();

describe("WithMoveValidation", () => {
  describe("callback props", () => {
    describe("props.children()", () => {
      it("must be called immediately", () => {
        const childrenCallback = jest.fn();

        TestRenderer.create(
          <WithMoveValidation>
            {(props) => {
              childrenCallback(props);
              return null;
            }}
          </WithMoveValidation>
        );

        expect(childrenCallback).toBeCalled();
      });

      it("props.children({position}) if has not initialPosition prop", () => {
        const { getProps } = renderWithMoveValidation();

        const props = getProps();

        expect(props).toEqual(
          expect.objectContaining({
            position: INITIAL_BOARD_POSITION,
          })
        );
      });

      it("props.children({position}) if has initialPosition prop", () => {
        const { getProps } = renderWithMoveValidation(initialFen);

        const props = getProps();

        expect(props).toEqual(
          expect.objectContaining({
            position: initialPosition,
          })
        );
      });

      it("props.children({check: false})", () => {
        const { getProps } = renderWithMoveValidation();

        let props = getProps();
        TestRenderer.act(() => {
          jest.runAllTimers();
          props = getProps();
        });

        expect(props).toEqual(
          expect.objectContaining({
            check: false,
          })
        );
      });

      it("props.children({check: true})", () => {
        const { getProps } = renderWithMoveValidation(checkmateFen);

        let props = getProps();
        TestRenderer.act(() => {
          jest.runAllTimers();
          props = getProps();
        });

        expect(props).toEqual(
          expect.objectContaining({
            check: true,
          })
        );
      });

      it("props.children({turnColor: PieceColor.WHITE})", () => {
        const { getProps } = renderWithMoveValidation();

        let props = getProps();
        TestRenderer.act(() => {
          jest.runAllTimers();
          props = getProps();
        });

        expect(props).toEqual(
          expect.objectContaining({
            turnColor: PieceColor.WHITE,
          })
        );
      });

      it("props.children({turnColor: PieceColor.BLACK})", () => {
        const { getProps } = renderWithMoveValidation(checkmateFen);

        let props = getProps();
        TestRenderer.act(() => {
          jest.runAllTimers();
          props = getProps();
        });

        expect(props).toEqual(
          expect.objectContaining({
            turnColor: PieceColor.BLACK,
          })
        );
      });

      it("props.children({draggable})", () => {
        const { getProps } = renderWithMoveValidation();

        const props = getProps();

        expect(props).toEqual(
          expect.objectContaining({
            draggable: true,
          })
        );
      });

      it("props.children({validMoves})", () => {
        const { getProps } = renderWithMoveValidation(initialFen);

        let props = getProps();
        TestRenderer.act(() => {
          jest.runAllTimers();
          props = getProps();
        });

        expect(props).toEqual(
          expect.objectContaining({
            validMoves: initialPositionValidMoves,
          })
        );
      });

      it("props.children({lastMoveSquares}) default values", () => {
        const { getProps } = renderWithMoveValidation(initialFen);

        let props = getProps();
        TestRenderer.act(() => {
          jest.runAllTimers();
          props = getProps();
        });

        expect(props).toEqual(
          expect.objectContaining({
            position: initialPosition,
            lastMoveSquares: [],
          })
        );
      });

      describe("props.children({onMove})", () => {
        it("props.children({onMove}) is a function", () => {
          const { getProps } = renderWithMoveValidation();

          const props = getProps();

          expect(props).toEqual(
            expect.objectContaining({
              onMove: expect.any(Function),
            })
          );
        });

        it("props.children({onMove}) do valid move", () => {
          const { getProps } = renderWithMoveValidation(initialFen);

          let props = getProps();
          TestRenderer.act(() => {
            jest.runAllTimers();
            props = getProps();
          });

          TestRenderer.act(() => {
            props.onMove({
              from: "e2",
              to: "e4",
            });
          });

          props = getProps();
          expect(props).toEqual(
            expect.objectContaining({
              position: positionAfterFirstMove,
              validMoves: positionAfterFirstMoveValidMoves,
              lastMoveSquares: ["e2", "e4"],
            })
          );
        });

        it("props.children({onMove}) do invalid move", () => {
          const { getProps } = renderWithMoveValidation(initialFen);

          let props = getProps();
          TestRenderer.act(() => {
            jest.runAllTimers();
            props = getProps();
          });

          TestRenderer.act(() => {
            props.onMove({
              from: "e2",
              to: "e5",
            });
          });

          props = getProps();
          expect(props).toEqual(
            expect.objectContaining({
              position: initialPosition,
              lastMoveSquares: [],
            })
          );
        });
      });

      it("props.children({width})", () => {
        const { getProps } = renderWithMoveValidation();

        const props = getProps();
        expect(props).toEqual(
          expect.objectContaining({
            width: 480,
          })
        );
      });

      it("props.children({onResize}) is a function", () => {
        const { getProps } = renderWithMoveValidation();

        const props = getProps();
        expect(props).toEqual(
          expect.objectContaining({
            onResize: expect.any(Function),
          })
        );
      });

      it("call props.children({onResize}) must change width prop", () => {
        const { getProps } = renderWithMoveValidation();

        let props = getProps();
        expect(props).toEqual(
          expect.objectContaining({
            width: 480,
          })
        );

        TestRenderer.act(() => {
          props.onResize(200);
        });

        props = getProps();
        expect(props).toEqual(
          expect.objectContaining({
            width: 200,
          })
        );

        TestRenderer.act(() => {
          props.onResize(100);
        });

        props = getProps();
        expect(props).toEqual(
          expect.objectContaining({
            width: 100,
          })
        );
      });
    });
  });

  describe("With react-dom", () => {
    describe("DOM structure", () => {
      it("must contain children", () => {
        const { container } = render(
          <WithMoveValidation initialFen={INITIAL_BOARD_FEN}>
            {() => <div data-testid="some-children" />}
          </WithMoveValidation>
        );

        expect(container).toContainHTML(
          '<div data-testid="some-children"></div>'
        );
      });
    });
  });
});
