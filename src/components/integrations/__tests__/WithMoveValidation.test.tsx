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
import { PromotionChoice } from "../PromotionChoice";

jest.mock("../PromotionChoice");

const initialFen: string = "8/4p3/8/5k2/8/3p4/4PP2/4K3 w KQkq - 0 1";

const checkmateFen: string = "4k3/4Q3/4K3/8/8/8/8/8 b - - 0 1";

const prePromotionFen: string = "k7/4P3/4K3/8/8/8/8/8 w - - 0 1";

const prePromotionPosition: Position = {
  a8: PieceCode.BLACK_KING,
  e7: PieceCode.WHITE_PAWN,
  e6: PieceCode.WHITE_KING,
};

const promotionPosition: Position = {
  a8: PieceCode.BLACK_KING,
  e8: PieceCode.WHITE_BISHOP,
  e6: PieceCode.WHITE_KING,
};

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

const renderWithMoveValidation = (
  fen?: string,
  playerVsCompMode: boolean = false
) => {
  let callbackProps: WithMoveValidationCallbackProps;

  const testRenderer = TestRenderer.create(
    <WithMoveValidation initialFen={fen} playerVsCompMode={playerVsCompMode}>
      {(props) => {
        callbackProps = props;

        return null;
      }}
    </WithMoveValidation>
  );
  const testInstance = testRenderer.root;

  return {
    getProps() {
      return callbackProps;
    },
    testRenderer,
    testInstance,
  };
};

jest.useFakeTimers();

describe("WithMoveValidation", () => {
  describe("children components", () => {
    it("contains 1 PromotionChoice", () => {
      const { testInstance } = renderWithMoveValidation();

      expect(testInstance.findAllByType(PromotionChoice).length).toBe(1);
    });
  });

  describe("children components props", () => {
    it("PromotionChoice", () => {
      const { testInstance, getProps } = renderWithMoveValidation(
        prePromotionFen
      );

      let props = getProps();
      TestRenderer.act(() => {
        jest.runAllTimers();
        props = getProps();
      });

      const promotionChoice: TestRenderer.ReactTestInstance = testInstance.findByType(
        PromotionChoice
      );

      expect(props.position).toEqual(prePromotionPosition);

      expect(promotionChoice.props.showPromotionChoice).toBe(false);
      expect(promotionChoice.props.turnColor).toBe(PieceColor.WHITE);

      TestRenderer.act(() => {
        props.onMove({
          from: "e7",
          to: "e8",
        });
      });

      props = getProps();
      expect(props.position).toEqual(prePromotionPosition);

      expect(promotionChoice.props.showPromotionChoice).toBe(true);
      expect(promotionChoice.props.turnColor).toBe(PieceColor.WHITE);

      TestRenderer.act(() => {
        promotionChoice.props.onPromotion("b");
      });

      props = getProps();
      expect(props.position).toEqual(promotionPosition);

      expect(promotionChoice.props.showPromotionChoice).toBe(false);
      expect(promotionChoice.props.turnColor).toBe(PieceColor.BLACK);
    });
  });

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

      it("props.children({viewOnly}) default value", () => {
        const { getProps } = renderWithMoveValidation(initialFen);

        let props = getProps();
        TestRenderer.act(() => {
          jest.runAllTimers();
          props = getProps();
        });

        expect(props).toEqual(
          expect.objectContaining({
            viewOnly: false,
          })
        );
      });

      it("props.children({viewOnly}) if game is over", () => {
        const { getProps } = renderWithMoveValidation(checkmateFen);

        let props = getProps();
        TestRenderer.act(() => {
          jest.runAllTimers();
          props = getProps();
        });

        expect(props).toEqual(
          expect.objectContaining({
            viewOnly: true,
          })
        );
      });

      it("props.children({allowMarkers})", () => {
        const { getProps } = renderWithMoveValidation();

        const props = getProps();

        expect(props).toEqual(
          expect.objectContaining({
            allowMarkers: true,
          })
        );
      });

      it("props.children({clickable})", () => {
        const { getProps } = renderWithMoveValidation();

        const props = getProps();

        expect(props).toEqual(
          expect.objectContaining({
            clickable: true,
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

      it("props.children({movableColor} playerVsPlayer)", () => {
        const { getProps } = renderWithMoveValidation();

        const props = getProps();

        expect(props).toEqual(
          expect.objectContaining({
            movableColor: "both",
          })
        );
      });

      it("props.children({movableColor} playerVsComp)", () => {
        const { getProps } = renderWithMoveValidation(undefined, true);

        const props = getProps();

        expect(props).toEqual(
          expect.objectContaining({
            movableColor: PieceColor.WHITE,
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

        it("computer move after props.children({onMove}) in playerVsComp mode", () => {
          const { getProps } = renderWithMoveValidation(initialFen, true);

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
              turnColor: PieceColor.BLACK,
            })
          );

          TestRenderer.act(() => {
            jest.advanceTimersByTime(3000);
          });

          props = getProps();
          expect(props).toEqual(
            expect.not.objectContaining({
              position: positionAfterFirstMove,
              validMoves: positionAfterFirstMoveValidMoves,
              lastMoveSquares: ["e2", "e4"],
            })
          );
          expect(props).toEqual(
            expect.objectContaining({
              turnColor: PieceColor.WHITE,
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

      describe("props.children({onSetPremove})", () => {
        it("must call playPremove() if onSetPremove was called", () => {
          const playPremove = jest.fn();
          const cancelPremove = jest.fn();

          const { getProps } = renderWithMoveValidation(initialFen, true);

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
          TestRenderer.act(() => {
            props.onSetPremove(
              {
                from: "g1",
                to: "f3",
              },
              playPremove,
              cancelPremove
            );
          });

          props = getProps();
          expect(props).toEqual(
            expect.objectContaining({
              position: positionAfterFirstMove,
              validMoves: positionAfterFirstMoveValidMoves,
              lastMoveSquares: ["e2", "e4"],
              turnColor: PieceColor.BLACK,
            })
          );

          TestRenderer.act(() => {
            jest.advanceTimersByTime(3000);
          });

          props = getProps();
          expect(props).toEqual(
            expect.not.objectContaining({
              position: positionAfterFirstMove,
              validMoves: positionAfterFirstMoveValidMoves,
              lastMoveSquares: ["e2", "e4"],
            })
          );
          expect(props).toEqual(
            expect.objectContaining({
              turnColor: PieceColor.WHITE,
            })
          );

          TestRenderer.act(() => {
            jest.advanceTimersByTime(100);
          });

          expect(playPremove).toBeCalledTimes(1);
          expect(playPremove).toBeCalledWith();
        });

        it("must not call playPremove() if onUnsetPremove was called", () => {
          const playPremove = jest.fn();
          const cancelPremove = jest.fn();

          const { getProps } = renderWithMoveValidation(initialFen, true);

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
          TestRenderer.act(() => {
            props.onSetPremove(
              {
                from: "g1",
                to: "f3",
              },
              playPremove,
              cancelPremove
            );
          });

          props = getProps();
          expect(props).toEqual(
            expect.objectContaining({
              position: positionAfterFirstMove,
              validMoves: positionAfterFirstMoveValidMoves,
              lastMoveSquares: ["e2", "e4"],
              turnColor: PieceColor.BLACK,
            })
          );

          TestRenderer.act(() => {
            props.onUnsetPremove();
          });

          TestRenderer.act(() => {
            jest.advanceTimersByTime(3000);
          });

          props = getProps();
          expect(props).toEqual(
            expect.not.objectContaining({
              position: positionAfterFirstMove,
              validMoves: positionAfterFirstMoveValidMoves,
              lastMoveSquares: ["e2", "e4"],
            })
          );
          expect(props).toEqual(
            expect.objectContaining({
              turnColor: PieceColor.WHITE,
            })
          );

          TestRenderer.act(() => {
            jest.advanceTimersByTime(100);
          });

          expect(playPremove).toBeCalledTimes(0);
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
