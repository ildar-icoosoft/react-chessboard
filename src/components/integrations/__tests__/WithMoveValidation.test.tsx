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

const initialFen: string = "4k3/4p3/8/8/8/3p4/4PP2/4K3 w KQkq - 0 1";

const checkmateFen: string = "4k3/4Q3/4K3/8/8/8/8/8 b - - 0 1";
const insufficientMaterialFen: string = "4k3/8/4K3/8/8/8/8/8 b - - 0 1";
const staleMateFen: string = "4k3/8/3RKR2/8/8/8/8/8 b - - 0 1";
const drawBy50MoveRuleFen: string = "4k3/8/4K3/8/8/8/4P3/8 b - - 100 100";

const initialPosition: Position = {
  e2: PieceCode.WHITE_PAWN,
  f2: PieceCode.WHITE_PAWN,
  e1: PieceCode.WHITE_KING,
  e8: PieceCode.BLACK_KING,
  e7: PieceCode.BLACK_PAWN,
  d3: PieceCode.BLACK_PAWN,
};

// 1. e2-e4
const positionAfterFirstMove: Position = {
  e4: PieceCode.WHITE_PAWN,
  f2: PieceCode.WHITE_PAWN,
  e1: PieceCode.WHITE_KING,
  e8: PieceCode.BLACK_KING,
  e7: PieceCode.BLACK_PAWN,
  d3: PieceCode.BLACK_PAWN,
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

      it("props.children({allowDrag}) returns true if it's turn to move", () => {
        const { getProps } = renderWithMoveValidation();

        const props = getProps();

        expect(props).toEqual(
          expect.objectContaining({
            allowDrag: expect.any(Function),
          })
        );

        expect(props.allowDrag(PieceCode.WHITE_PAWN, "e2")).toBeTruthy();

        expect(props.allowDrag(PieceCode.BLACK_PAWN, "e7")).toBeFalsy();
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

      describe("Drag and Drop Move", () => {
        describe("drag start", () => {
          const { getProps } = renderWithMoveValidation(initialFen);

          let props = getProps();
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
              position: initialPosition,
              selectionSquares: ["e2"],
              destinationSquares: ["e3", "e4", "d3"],
              occupationSquares: ["d3"],
              lastMoveSquares: [],
            })
          );
        });

        describe("Drop", () => {
          it("e2-e4 (valid move)", () => {
            const { getProps } = renderWithMoveValidation(initialFen);

            let props = getProps();
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
                selectionSquares: [],
                destinationSquares: [],
                lastMoveSquares: ["e2", "e4"],
              })
            );

            // blacks turn to move
            expect(props.allowDrag(PieceCode.WHITE_PAWN, "e4")).toBeFalsy();
            expect(props.allowDrag(PieceCode.BLACK_PAWN, "e7")).toBeTruthy();
          });

          it("e2-e2", () => {
            const { getProps } = renderWithMoveValidation(initialFen);
            const cancelMove = jest.fn();

            let props = getProps();
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
                selectionSquares: [],
                occupationSquares: [],
                destinationSquares: [],
                lastMoveSquares: [],
              })
            );

            expect(cancelMove).toBeCalledTimes(1);

            // whites turn to move
            expect(props.allowDrag(PieceCode.WHITE_PAWN, "e2")).toBeTruthy();
            expect(props.allowDrag(PieceCode.BLACK_PAWN, "e7")).toBeFalsy();
          });

          it("e2-e7 (source - valid, target - invalid)", () => {
            const { getProps } = renderWithMoveValidation(initialFen);
            const cancelMove = jest.fn();

            let props = getProps();
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

            TestRenderer.act(() => {
              props.onDrop({
                sourceCoordinates: "e2",
                targetCoordinates: "e7",
                pieceCode: PieceCode.WHITE_PAWN,
                cancelMove,
              });
            });

            props = getProps();
            expect(props).toEqual(
              expect.objectContaining({
                position: initialPosition,
                selectionSquares: [],
                occupationSquares: [],
                destinationSquares: [],
                lastMoveSquares: [],
              })
            );

            expect(cancelMove).toBeCalledTimes(1);

            // whites turn to move
            expect(props.allowDrag(PieceCode.WHITE_PAWN, "e2")).toBeTruthy();
            expect(props.allowDrag(PieceCode.BLACK_PAWN, "e7")).toBeFalsy();
          });
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

      describe("Click-click move", () => {
        describe("first click", () => {
          it("e2 (valid square)", () => {
            const { getProps } = renderWithMoveValidation(initialFen);

            let props = getProps();
            TestRenderer.act(() => {
              jest.runAllTimers();
              props = getProps();
            });

            TestRenderer.act(() => {
              props.onSquareClick("e2");
            });

            props = getProps();
            expect(props).toEqual(
              expect.objectContaining({
                position: initialPosition,
                selectionSquares: ["e2"],
                destinationSquares: ["e3", "e4", "d3"],
                occupationSquares: ["d3"],
                lastMoveSquares: [],
              })
            );
          });

          it("e4 (empty square)", () => {
            const { getProps } = renderWithMoveValidation(initialFen);

            let props = getProps();
            TestRenderer.act(() => {
              jest.runAllTimers();
              props = getProps();
            });

            TestRenderer.act(() => {
              props.onSquareClick("e4");
            });

            props = getProps();
            expect(props).toEqual(
              expect.objectContaining({
                position: initialPosition,
                selectionSquares: [],
              })
            );
          });

          it("e7 (invalid square, with opposite side piece)", () => {
            const { getProps } = renderWithMoveValidation(initialFen);

            let props = getProps();
            TestRenderer.act(() => {
              jest.runAllTimers();
              props = getProps();
            });

            TestRenderer.act(() => {
              props.onSquareClick("e7");
            });

            props = getProps();
            expect(props).toEqual(
              expect.objectContaining({
                position: initialPosition,
                selectionSquares: [],
              })
            );
          });
        });

        describe("second click", () => {
          it("e2-e4", () => {
            const { getProps } = renderWithMoveValidation(initialFen);

            let props = getProps();
            TestRenderer.act(() => {
              jest.runAllTimers();
              props = getProps();
            });

            TestRenderer.act(() => {
              props.onSquareClick("e2");
            });

            props = getProps();
            TestRenderer.act(() => {
              props.onSquareClick("e4");
            });

            props = getProps();
            expect(props).toEqual(
              expect.objectContaining({
                position: positionAfterFirstMove,
                selectionSquares: [],
                occupationSquares: [],
                destinationSquares: [],
                lastMoveSquares: ["e2", "e4"],
              })
            );

            // blacks turn to move
            expect(props.allowDrag(PieceCode.WHITE_PAWN, "e4")).toBeFalsy();
            expect(props.allowDrag(PieceCode.BLACK_PAWN, "e7")).toBeTruthy();
          });

          it("e2-e2", () => {
            const { getProps } = renderWithMoveValidation(initialFen);

            let props = getProps();
            TestRenderer.act(() => {
              jest.runAllTimers();
              props = getProps();
            });

            // from e2
            TestRenderer.act(() => {
              props.onSquareClick("e2");
            });

            // to e2
            props = getProps();
            TestRenderer.act(() => {
              props.onSquareClick("e2");
            });

            // do not change position
            props = getProps();
            expect(props).toEqual(
              expect.objectContaining({
                position: initialPosition,
                selectionSquares: [],
                occupationSquares: [],
                destinationSquares: [],
              })
            );
          });

          it("e2-f2 (both clicks to white pieces)", () => {
            const { getProps } = renderWithMoveValidation(initialFen);

            let props = getProps();
            TestRenderer.act(() => {
              jest.runAllTimers();
              props = getProps();
            });

            // from e2
            TestRenderer.act(() => {
              props.onSquareClick("e2");
            });

            // to f2
            props = getProps();
            TestRenderer.act(() => {
              props.onSquareClick("f2");
            });

            props = getProps();
            expect(props).toEqual(
              expect.objectContaining({
                position: initialPosition,
                selectionSquares: ["f2"],
                occupationSquares: [],
                destinationSquares: ["f3", "f4"],
              })
            );
          });

          it("e2-e7 (source - valid, target - invalid)", () => {
            const { getProps } = renderWithMoveValidation(initialFen);

            let props = getProps();
            TestRenderer.act(() => {
              jest.runAllTimers();
              props = getProps();
            });

            TestRenderer.act(() => {
              props.onSquareClick("e2");
            });

            props = getProps();
            TestRenderer.act(() => {
              props.onSquareClick("e7");
            });

            props = getProps();
            expect(props).toEqual(
              expect.objectContaining({
                position: initialPosition,
                selectionSquares: [],
                occupationSquares: [],
                destinationSquares: [],
              })
            );
          });
        });
      });

      it("ignore square clicks and drag if checkmate", () => {
        const { getProps } = renderWithMoveValidation(checkmateFen);

        let props = getProps();
        TestRenderer.act(() => {
          jest.runAllTimers();
          props = getProps();
        });

        // must ignore this click because of checkmate
        TestRenderer.act(() => {
          props.onSquareClick("e8");
        });

        props = getProps();
        expect(props).toEqual(
          expect.objectContaining({
            selectionSquares: [],
          })
        );

        expect(props.allowDrag(PieceCode.BLACK_KING, "e8")).toBeFalsy();
      });

      describe("ignore square clicks and drag if draw", () => {
        it("insufficientMaterial", () => {
          const { getProps } = renderWithMoveValidation(
            insufficientMaterialFen
          );

          let props = getProps();
          TestRenderer.act(() => {
            jest.runAllTimers();
            props = getProps();
          });

          // must ignore this click because of draw
          TestRenderer.act(() => {
            props.onSquareClick("e8");
          });

          props = getProps();
          expect(props).toEqual(
            expect.objectContaining({
              selectionSquares: [],
            })
          );

          expect(props.allowDrag(PieceCode.BLACK_KING, "e8")).toBeFalsy();
        });

        it("staleMate", () => {
          const { getProps } = renderWithMoveValidation(staleMateFen);

          let props = getProps();
          TestRenderer.act(() => {
            jest.runAllTimers();
            props = getProps();
          });

          // must ignore this click because of draw
          TestRenderer.act(() => {
            props.onSquareClick("e8");
          });

          props = getProps();
          expect(props).toEqual(
            expect.objectContaining({
              selectionSquares: [],
            })
          );

          expect(props.allowDrag(PieceCode.BLACK_KING, "e8")).toBeFalsy();
        });

        it("drawBy50MoveRule", () => {
          const { getProps } = renderWithMoveValidation(drawBy50MoveRuleFen);

          let props = getProps();
          TestRenderer.act(() => {
            jest.runAllTimers();
            props = getProps();
          });

          // must ignore this click because of draw
          TestRenderer.act(() => {
            props.onSquareClick("e8");
          });

          props = getProps();
          expect(props).toEqual(
            expect.objectContaining({
              selectionSquares: [],
            })
          );

          expect(props.allowDrag(PieceCode.BLACK_KING, "e8")).toBeFalsy();
        });

        it("drawByThreefoldRepetition", () => {
          const { getProps } = renderWithMoveValidation(INITIAL_BOARD_FEN);

          let props = getProps();
          TestRenderer.act(() => {
            jest.runAllTimers();
            props = getProps();
          });

          // prettier-ignore
          [
            "g1", "f3", "b8", "c6",
            "f3", "g1", "c6", "b8", // twofold repetition
            "g1", "f3", "b8", "c6",
            "f3", "g1", "c6", "b8", // threefold repetition
          ].forEach((item) => {
            TestRenderer.act(() => {
              props.onSquareClick(item);
            });
            props = getProps();
          });

          // must ignore this click because of draw
          TestRenderer.act(() => {
            props.onSquareClick("g1");
          });

          props = getProps();
          expect(props).toEqual(
            expect.objectContaining({
              selectionSquares: [],
            })
          );

          expect(props.allowDrag(PieceCode.WHITE_KNIGHT, "g1")).toBeFalsy();
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
