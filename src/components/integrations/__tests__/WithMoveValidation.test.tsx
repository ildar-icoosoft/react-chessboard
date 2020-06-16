import TestRenderer from "react-test-renderer";
import React from "react";
import { WithMoveValidation } from "../WithMoveValidation";
import { Position } from "../../../interfaces/Position";
import { PieceCode } from "../../../enums/PieceCode";
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

        expect(childrenCallback).toBeCalledTimes(1);
      });

      it("props.children({position}) if has not initialPosition prop", () => {
        const childrenCallback = jest.fn();

        TestRenderer.create(
          <WithMoveValidation>
            {(props) => {
              childrenCallback(props);
              return null;
            }}
          </WithMoveValidation>
        );

        expect(childrenCallback).toBeCalledWith(
          expect.objectContaining({
            position: {},
          })
        );
      });

      it("props.children({position}) if has initialPosition prop", () => {
        const childrenCallback = jest.fn();

        TestRenderer.create(
          <WithMoveValidation initialPosition={initialPosition}>
            {(props) => {
              childrenCallback(props);
              return null;
            }}
          </WithMoveValidation>
        );

        expect(childrenCallback).toBeCalledWith(
          expect.objectContaining({
            position: initialPosition,
          })
        );
      });

      it("props.children({draggable})", () => {
        const childrenCallback = jest.fn();

        TestRenderer.create(
          <WithMoveValidation>
            {(props) => {
              childrenCallback(props);
              return null;
            }}
          </WithMoveValidation>
        );

        expect(childrenCallback).toBeCalledWith(
          expect.objectContaining({
            draggable: true,
          })
        );
      });

      it("props.children({onDragStart}) is a function", () => {
        const childrenCallback = jest.fn();

        TestRenderer.create(
          <WithMoveValidation>
            {(props) => {
              childrenCallback(props);
              return null;
            }}
          </WithMoveValidation>
        );

        expect(childrenCallback).toBeCalledWith(
          expect.objectContaining({
            onDragStart: expect.any(Function),
          })
        );
      });

      it("props.children({onDrop}) is a function", () => {
        const childrenCallback = jest.fn();

        TestRenderer.create(
          <WithMoveValidation>
            {(props) => {
              childrenCallback(props);
              return null;
            }}
          </WithMoveValidation>
        );

        expect(childrenCallback).toBeCalledWith(
          expect.objectContaining({
            onDrop: expect.any(Function),
          })
        );
      });

      describe("Move by drag and drop", () => {
        it("call props.children({onDragStart}) affects selectionSquares", () => {
          const childrenCallback = jest.fn();
          let isFirstCallbackCall: boolean = true;

          TestRenderer.create(
            <WithMoveValidation initialPosition={initialPosition}>
              {(props) => {
                childrenCallback(props);

                if (isFirstCallbackCall) {
                  isFirstCallbackCall = false;

                  props.onDragStart({
                    coordinates: "e2",
                    pieceCode: PieceCode.WHITE_PAWN,
                  });
                }

                return null;
              }}
            </WithMoveValidation>
          );

          expect(childrenCallback).toBeCalledTimes(2);

          expect(childrenCallback).nthCalledWith(
            1,
            expect.objectContaining({
              selectionSquares: [],
            })
          );
          expect(childrenCallback).nthCalledWith(
            2,
            expect.objectContaining({
              selectionSquares: ["e2"],
            })
          );
        });

        it("call props.children({onDrop}) e2-e4 affects position and lastMoveSquares", () => {
          const childrenCallback = jest.fn();
          let isFirstCallbackCall: boolean = true;

          TestRenderer.create(
            <WithMoveValidation initialPosition={initialPosition}>
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
            </WithMoveValidation>
          );

          expect(childrenCallback).toBeCalledTimes(2);

          expect(childrenCallback).nthCalledWith(
            1,
            expect.objectContaining({
              position: initialPosition,
              lastMoveSquares: [],
            })
          );
          expect(childrenCallback).nthCalledWith(
            2,
            expect.objectContaining({
              position: positionAfterFirstMove,
              lastMoveSquares: ["e2", "e4"],
            })
          );
        });

        it("call props.children({onDragStart}) and props.children({onDrop}) e2-e4 affects selectionSquares", () => {
          const childrenCallback = jest.fn();
          let callbackCounter: number = 0;

          TestRenderer.create(
            <WithMoveValidation initialPosition={initialPosition}>
              {(props) => {
                childrenCallback(props);

                callbackCounter++;

                if (callbackCounter === 1) {
                  props.onDragStart({
                    coordinates: "e2",
                    pieceCode: PieceCode.WHITE_PAWN,
                  });
                }
                if (callbackCounter === 2) {
                  props.onDrop({
                    sourceCoordinates: "e2",
                    targetCoordinates: "e4",
                    pieceCode: PieceCode.WHITE_PAWN,
                    cancelMove() {},
                  });
                }

                return null;
              }}
            </WithMoveValidation>
          );

          expect(childrenCallback).toBeCalledTimes(3);

          expect(childrenCallback).nthCalledWith(
            1,
            expect.objectContaining({
              selectionSquares: [],
            })
          );
          expect(childrenCallback).nthCalledWith(
            2,
            expect.objectContaining({
              selectionSquares: ["e2"],
            })
          );
          expect(childrenCallback).nthCalledWith(
            3,
            expect.objectContaining({
              selectionSquares: [],
            })
          );
        });

        it("call props.children({onDrop}) e2-e2 affects position, lastMoveSquares and cancelMove() must be called", () => {
          const childrenCallback = jest.fn();
          const cancelMove = jest.fn();
          let isFirstCallbackCall: boolean = true;

          TestRenderer.create(
            <WithMoveValidation initialPosition={initialPosition}>
              {(props) => {
                childrenCallback(props);

                if (isFirstCallbackCall) {
                  isFirstCallbackCall = false;

                  props.onDrop({
                    sourceCoordinates: "e2",
                    targetCoordinates: "e2",
                    pieceCode: PieceCode.WHITE_PAWN,
                    cancelMove,
                  });
                }

                return null;
              }}
            </WithMoveValidation>
          );

          expect(childrenCallback).toBeCalledTimes(2);

          expect(childrenCallback).nthCalledWith(
            1,
            expect.objectContaining({
              position: initialPosition,
              lastMoveSquares: [],
            })
          );
          expect(childrenCallback).nthCalledWith(
            2,
            expect.objectContaining({
              position: initialPosition,
              lastMoveSquares: [],
            })
          );

          expect(cancelMove).toBeCalledTimes(1);
        });
      });

      it("props.children({onSquareClick}) is a function", () => {
        const childrenCallback = jest.fn();

        TestRenderer.create(
          <WithMoveValidation>
            {(props) => {
              childrenCallback(props);
              return null;
            }}
          </WithMoveValidation>
        );

        expect(childrenCallback).toBeCalledWith(
          expect.objectContaining({
            onSquareClick: expect.any(Function),
          })
        );
      });

      describe("Move by click", () => {
        it("props.children({onSquareClick}) e2-e4 affects position, selectionSquares, lastMoveSquares", () => {
          const childrenCallback = jest.fn();
          let callbackCounter: number = 0;

          TestRenderer.create(
            <WithMoveValidation initialPosition={initialPosition}>
              {(props) => {
                childrenCallback(props);

                callbackCounter++;

                if (callbackCounter === 1) {
                  props.onSquareClick("e2");
                }
                if (callbackCounter === 2) {
                  props.onSquareClick("e4");
                }

                return null;
              }}
            </WithMoveValidation>
          );

          expect(childrenCallback).toBeCalledTimes(3);

          expect(childrenCallback).nthCalledWith(
            1,
            expect.objectContaining({
              position: initialPosition,
              selectionSquares: [],
              lastMoveSquares: [],
            })
          );
          expect(childrenCallback).nthCalledWith(
            2,
            expect.objectContaining({
              position: initialPosition,
              selectionSquares: ["e2"],
              lastMoveSquares: [],
            })
          );

          expect(childrenCallback).nthCalledWith(
            3,
            expect.objectContaining({
              position: positionAfterFirstMove,
              selectionSquares: [],
              lastMoveSquares: ["e2", "e4"],
            })
          );
        });

        it("props.children({onSquareClick}) e4-e2 (e4 is empty square) affects position, selectionSquares", () => {
          const childrenCallback = jest.fn();
          let callbackCounter: number = 0;

          TestRenderer.create(
            <WithMoveValidation initialPosition={initialPosition}>
              {(props) => {
                childrenCallback(props);

                callbackCounter++;

                if (callbackCounter === 1) {
                  props.onSquareClick("e4");
                  props.onSquareClick("e2");
                }

                return null;
              }}
            </WithMoveValidation>
          );

          expect(childrenCallback).toBeCalledTimes(2);

          expect(childrenCallback).nthCalledWith(
            1,
            expect.objectContaining({
              position: initialPosition,
              selectionSquares: [],
            })
          );
          expect(childrenCallback).nthCalledWith(
            2,
            expect.objectContaining({
              position: initialPosition,
              selectionSquares: ["e2"],
            })
          );
        });
      });

      it("props.children({width})", () => {
        const childrenCallback = jest.fn();

        TestRenderer.create(
          <WithMoveValidation>
            {(props) => {
              childrenCallback(props);
              return null;
            }}
          </WithMoveValidation>
        );

        expect(childrenCallback).toBeCalledWith(
          expect.objectContaining({
            width: 480,
          })
        );
      });

      it("props.children({onResize}) is a function", () => {
        const childrenCallback = jest.fn();

        TestRenderer.create(
          <WithMoveValidation>
            {(props) => {
              childrenCallback(props);
              return null;
            }}
          </WithMoveValidation>
        );

        expect(childrenCallback).toBeCalledWith(
          expect.objectContaining({
            onResize: expect.any(Function),
          })
        );
      });

      it("call props.children({onResize}) must change width prop", () => {
        const childrenCallback = jest.fn();
        let callbackCounter: number = 0;

        TestRenderer.create(
          <WithMoveValidation initialPosition={initialPosition}>
            {(props) => {
              childrenCallback(props);

              callbackCounter++;

              if (callbackCounter === 1) {
                props.onResize(200);
              }
              if (callbackCounter === 2) {
                props.onResize(100);
              }

              return null;
            }}
          </WithMoveValidation>
        );

        expect(childrenCallback).toBeCalledTimes(3);

        expect(childrenCallback).nthCalledWith(
          1,
          expect.objectContaining({
            width: 480,
          })
        );
        expect(childrenCallback).nthCalledWith(
          2,
          expect.objectContaining({
            width: 200,
          })
        );
        expect(childrenCallback).nthCalledWith(
          3,
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
          <WithMoveValidation>
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
