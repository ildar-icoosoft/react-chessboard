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

export const initialFen: string = "4k3/8/8/8/8/8/4PP2/4K3";

const initialPosition: Position = {
  e2: PieceCode.WHITE_PAWN,
  f2: PieceCode.WHITE_PAWN,
  e1: PieceCode.WHITE_KING,
  e8: PieceCode.BLACK_KING,
};

// 1. e2-e4
const positionAfterFirstMove: Position = {
  e4: PieceCode.WHITE_PAWN,
  f2: PieceCode.WHITE_PAWN,
  e1: PieceCode.WHITE_KING,
  e8: PieceCode.BLACK_KING,
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

      it("props.children({draggable})", () => {
        const { getProps } = renderWithMoveValidation();

        const props = getProps();

        expect(props).toEqual(
          expect.objectContaining({
            draggable: true,
          })
        );
      });

      it("props.children({onDragStart}) is a function", () => {
        const { getProps } = renderWithMoveValidation();

        const props = getProps();

        expect(props).toEqual(
          expect.objectContaining({
            onDragStart: expect.any(Function),
          })
        );
      });

      it("props.children({onDrop}) is a function", () => {
        const { getProps } = renderWithMoveValidation();

        const props = getProps();

        expect(props).toEqual(
          expect.objectContaining({
            onDrop: expect.any(Function),
          })
        );
      });

      describe("Move by drag and drop", () => {
        it("call props.children({onDragStart}) affects selectionSquares, destinationSquares", () => {
          const { getProps } = renderWithMoveValidation(initialFen);

          let props = getProps();
          expect(props).toEqual(
            expect.objectContaining({
              selectionSquares: [],
              destinationSquares: [],
            })
          );

          TestRenderer.act(() => {
            jest.runAllTimers();
            props = getProps();
          });

          TestRenderer.act(() => {
            props.onDragStart({
              coordinates: "e2",
              pieceCode: PieceCode.WHITE_PAWN,
            });
          });

          props = getProps();
          expect(props).toEqual(
            expect.objectContaining({
              selectionSquares: ["e2"],
              destinationSquares: ["e3", "e4"],
            })
          );
        });

        it("call props.children({onDrop}) e2-e4 affects position and lastMoveSquares", () => {
          const { getProps } = renderWithMoveValidation(initialFen);

          let props = getProps();

          expect(props).toEqual(
            expect.objectContaining({
              position: initialPosition,
              lastMoveSquares: [],
            })
          );

          TestRenderer.act(() => {
            props.onDrop({
              sourceCoordinates: "e2",
              targetCoordinates: "e4",
              pieceCode: PieceCode.WHITE_PAWN,
              cancelMove() {},
            });
          });

          props = getProps();

          expect(props).toEqual(
            expect.objectContaining({
              position: positionAfterFirstMove,
              lastMoveSquares: ["e2", "e4"],
            })
          );
        });

        it("call props.children({onDragStart}) and props.children({onDrop}) e2-e4 affects selectionSquares, destinationSquares", () => {
          const { getProps } = renderWithMoveValidation(initialFen);

          let props = getProps();

          expect(props).toEqual(
            expect.objectContaining({
              selectionSquares: [],
              destinationSquares: [],
            })
          );

          TestRenderer.act(() => {
            jest.runAllTimers();
            props = getProps();
          });

          TestRenderer.act(() => {
            props.onDragStart({
              coordinates: "e2",
              pieceCode: PieceCode.WHITE_PAWN,
            });
          });

          props = getProps();

          expect(props).toEqual(
            expect.objectContaining({
              selectionSquares: ["e2"],
              destinationSquares: ["e3", "e4"],
            })
          );

          TestRenderer.act(() => {
            props.onDrop({
              sourceCoordinates: "e2",
              targetCoordinates: "e4",
              pieceCode: PieceCode.WHITE_PAWN,
              cancelMove() {},
            });
          });

          props = getProps();

          expect(props).toEqual(
            expect.objectContaining({
              selectionSquares: [],
              destinationSquares: [],
            })
          );
        });

        it("call props.children({onDrop}) e2-e2 affects position, lastMoveSquares and cancelMove() must be called", () => {
          const { getProps } = renderWithMoveValidation(initialFen);
          const cancelMove = jest.fn();

          let props = getProps();

          expect(props).toEqual(
            expect.objectContaining({
              position: initialPosition,
              lastMoveSquares: [],
            })
          );

          TestRenderer.act(() => {
            props.onDrop({
              sourceCoordinates: "e2",
              targetCoordinates: "e2",
              pieceCode: PieceCode.WHITE_PAWN,
              cancelMove,
            });
          });

          props = getProps();

          expect(props).toEqual(
            expect.objectContaining({
              position: initialPosition,
              lastMoveSquares: [],
            })
          );

          expect(cancelMove).toBeCalledTimes(1);
        });
      });

      it("props.children({onSquareClick}) is a function", () => {
        const { getProps } = renderWithMoveValidation();

        const props = getProps();

        expect(props).toEqual(
          expect.objectContaining({
            onSquareClick: expect.any(Function),
          })
        );
      });

      describe("Move by click", () => {
        it("props.children({onSquareClick}) e2-e4 affects position, selectionSquares, destinationSquares, lastMoveSquares", () => {
          const { getProps } = renderWithMoveValidation(initialFen);

          let props = getProps();

          expect(props).toEqual(
            expect.objectContaining({
              position: initialPosition,
              selectionSquares: [],
              destinationSquares: [],
              lastMoveSquares: [],
            })
          );

          TestRenderer.act(() => {
            props.onSquareClick("e2");
          });

          props = getProps();

          expect(props).toEqual(
            expect.objectContaining({
              position: initialPosition,
              selectionSquares: ["e2"],
              destinationSquares: ["e3", "e4"],
              lastMoveSquares: [],
            })
          );

          TestRenderer.act(() => {
            props.onSquareClick("e4");
          });

          props = getProps();

          expect(props).toEqual(
            expect.objectContaining({
              position: positionAfterFirstMove,
              selectionSquares: [],
              destinationSquares: [],
              lastMoveSquares: ["e2", "e4"],
            })
          );
        });

        it("props.children({onSquareClick}) e4-e2 (e4 is empty square) affects position, selectionSquares, destinationSquares", () => {
          const { getProps } = renderWithMoveValidation(initialFen);

          let props = getProps();
          expect(props).toEqual(
            expect.objectContaining({
              position: initialPosition,
              selectionSquares: [],
              destinationSquares: [],
            })
          );

          TestRenderer.act(() => {
            props.onSquareClick("e4");
          });

          props = getProps();
          expect(props).toEqual(
            expect.objectContaining({
              position: initialPosition,
              selectionSquares: [],
              destinationSquares: [],
            })
          );

          TestRenderer.act(() => {
            props.onSquareClick("e2");
          });

          props = getProps();
          expect(props).toEqual(
            expect.objectContaining({
              position: initialPosition,
              selectionSquares: ["e2"],
              destinationSquares: ["e3", "e4"],
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
            {() => <div data-testid="some-children"></div>}
          </WithMoveValidation>
        );

        expect(container).toContainHTML(
          '<div data-testid="some-children"></div>'
        );
      });
    });
  });
});
