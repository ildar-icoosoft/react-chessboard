import React, { createRef } from "react";
import TestRenderer from "react-test-renderer";
import { Board, BoardRef } from "../Board";
import { Rank } from "../Rank";
import { PieceColor } from "../../enums/PieceColor";
import { PieceCode } from "../../enums/PieceCode";
import { Position } from "../../interfaces/Position";
import { SquareCssClasses } from "../../interfaces/SquareCssClasses";
import { PieceDropEvent } from "../../interfaces/PieceDropEvent";
import { PieceDragStartEvent } from "../../interfaces/PieceDragStartEvent";
import { PieceDragLayer } from "../PieceDragLayer";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BoardDropEvent } from "../../interfaces/BoardDropEvent";
import { Coords } from "../Coords";

jest.useFakeTimers();

describe("Board", () => {
  it("Snapshot", () => {
    const tree = TestRenderer.create(<Board />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe("children components", () => {
    it("contains 8 Ranks", () => {
      const testInstance = TestRenderer.create(<Board />).root;

      expect(testInstance.findAllByType(Rank).length).toBe(8);
    });

    it("contains 1 PieceDragLayer", () => {
      const testInstance = TestRenderer.create(<Board />).root;

      expect(testInstance.findAllByType(PieceDragLayer).length).toBe(1);
    });

    it("contains 1 Coords", () => {
      const testInstance = TestRenderer.create(<Board />).root;

      expect(testInstance.findAllByType(Coords).length).toBe(1);
    });
  });

  describe("children components props", () => {
    describe("Rank", () => {
      it("rankName in white orientation", () => {
        const testInstance = TestRenderer.create(
          <Board orientation={PieceColor.WHITE} />
        ).root;

        const ranks: TestRenderer.ReactTestInstance[] = testInstance.findAllByType(
          Rank
        );

        for (let i = 0; i < 8; i++) {
          expect(ranks[i].props.rankName).toBe(String(8 - i));
        }
      });

      it("rankName in black orientation", () => {
        const testInstance = TestRenderer.create(
          <Board orientation={PieceColor.BLACK} />
        ).root;

        const ranks: TestRenderer.ReactTestInstance[] = testInstance.findAllByType(
          Rank
        );

        for (let i = 0; i < 8; i++) {
          expect(ranks[i].props.rankName).toBe(String(i + 1));
        }
      });

      it("position", () => {
        const position: Position = {
          a1: PieceCode.WHITE_BISHOP,
          b2: PieceCode.WHITE_KING,
          c3: PieceCode.WHITE_PAWN,
        };

        const testInstance = TestRenderer.create(<Board position={position} />)
          .root;

        const rank: TestRenderer.ReactTestInstance = testInstance.findByProps({
          rankName: "2",
        });

        expect(rank.props.position).toBe(position);
      });

      it("squareCssClasses", () => {
        const squareCssClasses: SquareCssClasses = {
          a1: ["class1", "class2"],
        };

        const testInstance = TestRenderer.create(
          <Board squareCssClasses={squareCssClasses} />
        ).root;

        const rank: TestRenderer.ReactTestInstance = testInstance.findByProps({
          rankName: "2",
        });

        expect(rank.props.squareCssClasses).toEqual({
          a1: ["class1", "class2"],
        });
      });

      it("dragStartCssClass", () => {
        const dragStartCssClass: string[] = ["class1", "class2"];

        const testInstance = TestRenderer.create(
          <Board dragStartCssClass={dragStartCssClass} />
        ).root;

        const rank: TestRenderer.ReactTestInstance = testInstance.findByProps({
          rankName: "2",
        });

        expect(rank.props.dragStartCssClass).toEqual(["class1", "class2"]);
      });

      it("dragEnterSquareCssClass", () => {
        const dragEnterSquareCssClass: string[] = ["class1", "class2"];

        const testInstance = TestRenderer.create(
          <Board dragEnterSquareCssClass={dragEnterSquareCssClass} />
        ).root;

        const rank: TestRenderer.ReactTestInstance = testInstance.findByProps({
          rankName: "2",
        });

        expect(rank.props.dragEnterSquareCssClass).toEqual([
          "class1",
          "class2",
        ]);
      });

      it("draggable", () => {
        const testRenderer = TestRenderer.create(<Board draggable={true} />);
        const testInstance = testRenderer.root;

        const rank: TestRenderer.ReactTestInstance = testInstance.findByProps({
          rankName: "2",
        });

        expect(rank.props.draggable).toBeTruthy();

        testRenderer.update(<Board />);

        expect(rank.props.draggable).toBeFalsy();
      });

      it("allowDrag", () => {
        const allowDrag = jest.fn(() => true);

        const testRenderer = TestRenderer.create(
          <Board allowDrag={allowDrag} />
        );
        const testInstance = testRenderer.root;

        const rank: TestRenderer.ReactTestInstance = testInstance.findByProps({
          rankName: "2",
        });

        expect(rank.props.allowDrag).toBe(allowDrag);

        testRenderer.update(<Board />);

        expect(rank.props.allowDrag).toBeUndefined();
      });

      it("orientation", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const rank: TestRenderer.ReactTestInstance = testInstance.findByProps({
          rankName: "2",
        });

        expect(rank.props.orientation).toBe(PieceColor.WHITE);

        testRenderer.update(<Board orientation={PieceColor.BLACK} />);

        expect(rank.props.orientation).toBe(PieceColor.BLACK);
      });

      it("showNotation", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const ranks: TestRenderer.ReactTestInstance[] = testInstance.findAllByType(
          Rank
        );

        for (let i = 0; i < 8; i++) {
          expect(ranks[i].props.showNotation).toBeTruthy();
        }

        testRenderer.update(<Board showNotation={false} />);

        for (let i = 0; i < 8; i++) {
          expect(ranks[i].props.showNotation).toBeFalsy();
        }
      });

      it("width", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const ranks: TestRenderer.ReactTestInstance[] = testInstance.findAllByType(
          Rank
        );

        for (let i = 0; i < 8; i++) {
          expect(ranks[i].props.width).toBe(480);
        }

        testRenderer.update(<Board width={200} />);

        for (let i = 0; i < 8; i++) {
          expect(ranks[i].props.width).toBe(200);
        }
      });

      it("transitionDuration", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const rank: TestRenderer.ReactTestInstance = testInstance.findByProps({
          rankName: "2",
        });

        expect(rank.props.transitionDuration).toBe(300);

        testRenderer.update(<Board transitionDuration={600} />);

        expect(rank.props.transitionDuration).toBe(600);
      });

      describe("transitionPieces", () => {
        it("Moves with transition", () => {
          const testRenderer = TestRenderer.create(
            <Board
              position={{
                a1: PieceCode.WHITE_BISHOP,
                b2: PieceCode.WHITE_KING,
                c3: PieceCode.WHITE_PAWN,
              }}
            />
          );
          const testInstance = testRenderer.root;

          const rank: TestRenderer.ReactTestInstance = testInstance.findByProps(
            {
              rankName: "2",
            }
          );
          expect(rank.props.transitionPieces).toEqual({});

          // b2-b4
          testRenderer.update(
            <Board
              position={{
                a1: PieceCode.WHITE_BISHOP,
                b4: PieceCode.WHITE_KING,
                c3: PieceCode.WHITE_PAWN,
              }}
            />
          );
          expect(rank.props.transitionPieces).toEqual({
            b4: {
              algebraic: "b2",
              x: 0,
              y: 0,
            },
          });

          // position did not changed. Transition pieces still should contain the difference between b2 and b4 positions
          testRenderer.update(
            <Board
              position={{
                a1: PieceCode.WHITE_BISHOP,
                b4: PieceCode.WHITE_KING,
                c3: PieceCode.WHITE_PAWN,
              }}
            />
          );
          expect(rank.props.transitionPieces).toEqual({
            b4: {
              algebraic: "b2",
              x: 0,
              y: 0,
            },
          });

          // a1xc3
          testRenderer.update(
            <Board
              position={{
                c3: PieceCode.WHITE_BISHOP,
                b4: PieceCode.WHITE_KING,
              }}
            />
          );

          expect(rank.props.transitionPieces).toEqual({
            c3: {
              algebraic: "a1",
              x: 0,
              y: 0,
              phantomPiece: PieceCode.WHITE_PAWN,
            },
          });
        });

        describe("Transition on drag drop moves", () => {
          it("enabled transition if no onDrop callback", () => {
            const testRenderer = TestRenderer.create(
              <Board
                position={{
                  d1: PieceCode.WHITE_QUEEN,
                  e2: PieceCode.WHITE_PAWN,
                  e1: PieceCode.WHITE_KING,
                }}
              />
            );
            const testInstance = testRenderer.root;

            const rank: TestRenderer.ReactTestInstance = testInstance.findByProps(
              {
                rankName: "2",
              }
            );
            expect(rank.props.transitionPieces).toEqual({});

            const dropEvent: PieceDropEvent = {
              sourceCoordinates: "e2",
              targetCoordinates: "e4",
              pieceCode: PieceCode.WHITE_PAWN,
            };

            TestRenderer.act(() => {
              rank.props.onDrop(dropEvent);
            });

            testRenderer.update(
              <Board
                position={{
                  d1: PieceCode.WHITE_QUEEN,
                  e4: PieceCode.WHITE_PAWN,
                  e1: PieceCode.WHITE_KING,
                }}
              />
            );

            expect(rank.props.transitionPieces).toEqual({
              e4: {
                algebraic: "e2",
                x: 0,
                y: 0,
              },
            });
          });

          it("enabled transition if event.cancelMove() was called", () => {
            const onDrop = jest.fn((event: BoardDropEvent) => {
              event.cancelMove();
            });

            const testRenderer = TestRenderer.create(
              <Board
                onDrop={onDrop}
                position={{
                  d1: PieceCode.WHITE_QUEEN,
                  e2: PieceCode.WHITE_PAWN,
                  e1: PieceCode.WHITE_KING,
                }}
              />
            );
            const testInstance = testRenderer.root;

            const rank: TestRenderer.ReactTestInstance = testInstance.findByProps(
              {
                rankName: "2",
              }
            );
            expect(rank.props.transitionPieces).toEqual({});

            const dropEvent: PieceDropEvent = {
              sourceCoordinates: "e2",
              targetCoordinates: "e4",
              pieceCode: PieceCode.WHITE_PAWN,
            };

            TestRenderer.act(() => {
              rank.props.onDrop(dropEvent);
            });

            testRenderer.update(
              <Board
                position={{
                  d1: PieceCode.WHITE_QUEEN,
                  e4: PieceCode.WHITE_PAWN,
                  e1: PieceCode.WHITE_KING,
                }}
              />
            );

            expect(rank.props.transitionPieces).toEqual({
              e4: {
                algebraic: "e2",
                x: 0,
                y: 0,
              },
            });
          });

          it("disabled transition if has onDrop callback and event.cancelMove() was not called", () => {
            const onDrop = jest.fn();

            const testRenderer = TestRenderer.create(
              <Board
                onDrop={onDrop}
                position={{
                  d1: PieceCode.WHITE_QUEEN,
                  e2: PieceCode.WHITE_PAWN,
                  e1: PieceCode.WHITE_KING,
                }}
              />
            );
            const testInstance = testRenderer.root;

            const rank: TestRenderer.ReactTestInstance = testInstance.findByProps(
              {
                rankName: "2",
              }
            );
            expect(rank.props.transitionPieces).toEqual({});

            const dropEvent: PieceDropEvent = {
              sourceCoordinates: "e2",
              targetCoordinates: "e4",
              pieceCode: PieceCode.WHITE_PAWN,
            };

            TestRenderer.act(() => {
              rank.props.onDrop(dropEvent);
            });

            testRenderer.update(
              <Board
                position={{
                  d1: PieceCode.WHITE_QUEEN,
                  e4: PieceCode.WHITE_PAWN,
                  e1: PieceCode.WHITE_KING,
                }}
              />
            );
            expect(rank.props.transitionPieces).toEqual({});

            // position did not changed. Transition pieces still must be empty
            testRenderer.update(
              <Board
                position={{
                  d1: PieceCode.WHITE_QUEEN,
                  e4: PieceCode.WHITE_PAWN,
                  e1: PieceCode.WHITE_KING,
                }}
              />
            );
            expect(rank.props.transitionPieces).toEqual({});
          });
        });
      });
    });

    describe("PieceDragLayer", () => {
      it("width", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const pieceDragLayer: TestRenderer.ReactTestInstance = testInstance.findByType(
          PieceDragLayer
        );

        expect(pieceDragLayer.props.width).toBe(480 / 8);

        testRenderer.update(<Board width={240} />);

        expect(pieceDragLayer.props.width).toBe(240 / 8);
      });
    });

    describe("Coords", () => {
      it("orientation", () => {
        const testRenderer = TestRenderer.create(<Board />);
        const testInstance = testRenderer.root;

        const coords: TestRenderer.ReactTestInstance = testInstance.findByType(
          Coords
        );

        expect(coords.props.orientation).toBe(PieceColor.WHITE);

        testRenderer.update(<Board orientation={PieceColor.BLACK} />);

        expect(coords.props.orientation).toBe(PieceColor.BLACK);
      });
    });
  });

  describe("Events", () => {
    it("onSquareClick", () => {
      const onSquareClick = jest.fn();

      const testInstance = TestRenderer.create(
        <Board onSquareClick={onSquareClick} />
      ).root;

      const rank: TestRenderer.ReactTestInstance = testInstance.findByProps({
        rankName: "2",
      });

      TestRenderer.act(() => {
        rank.props.onSquareClick("e2");
      });

      expect(onSquareClick).toHaveBeenCalledTimes(1);

      expect(onSquareClick).toBeCalledWith("e2");
    });

    it("onSquareRightClick", () => {
      const onSquareRightClick = jest.fn();

      const testInstance = TestRenderer.create(
        <Board onSquareRightClick={onSquareRightClick} />
      ).root;

      const rank: TestRenderer.ReactTestInstance = testInstance.findByProps({
        rankName: "2",
      });

      TestRenderer.act(() => {
        rank.props.onSquareRightClick("e2");
      });

      expect(onSquareRightClick).toHaveBeenCalledTimes(1);

      expect(onSquareRightClick).toBeCalledWith("e2");
    });

    it("onDragStart", () => {
      const onDragStart = jest.fn();

      const testInstance = TestRenderer.create(
        <Board onDragStart={onDragStart} />
      ).root;

      const rank: TestRenderer.ReactTestInstance = testInstance.findByProps({
        rankName: "2",
      });

      const dragStartEvent: PieceDragStartEvent = {
        coordinates: "e2",
        pieceCode: PieceCode.WHITE_PAWN,
      };

      TestRenderer.act(() => {
        rank.props.onDragStart(dragStartEvent);
      });

      expect(onDragStart).toHaveBeenCalledTimes(1);

      expect(onDragStart).toBeCalledWith(dragStartEvent);
    });

    it("onDragEnterSquare", () => {
      const onDragEnterSquare = jest.fn();

      const testInstance = TestRenderer.create(
        <Board onDragEnterSquare={onDragEnterSquare} />
      ).root;

      const rank: TestRenderer.ReactTestInstance = testInstance.findByProps({
        rankName: "2",
      });

      TestRenderer.act(() => {
        rank.props.onDragEnterSquare("e2");
      });

      expect(onDragEnterSquare).toHaveBeenCalledTimes(1);

      expect(onDragEnterSquare).toBeCalledWith("e2");
    });

    it("onDrop", () => {
      const onDrop = jest.fn();

      const testInstance = TestRenderer.create(<Board onDrop={onDrop} />).root;

      const rank: TestRenderer.ReactTestInstance = testInstance.findByProps({
        rankName: "2",
      });

      const dropEvent: PieceDropEvent = {
        sourceCoordinates: "e2",
        targetCoordinates: "e4",
        pieceCode: PieceCode.WHITE_PAWN,
      };

      TestRenderer.act(() => {
        rank.props.onDrop(dropEvent);
      });

      expect(onDrop).toHaveBeenCalledTimes(1);

      expect(onDrop).toBeCalledWith(expect.objectContaining(dropEvent));
    });

    it("onMouseEnterSquare", () => {
      const onMouseEnterSquare = jest.fn();

      const testInstance = TestRenderer.create(
        <Board onMouseEnterSquare={onMouseEnterSquare} />
      ).root;

      const rank: TestRenderer.ReactTestInstance = testInstance.findByProps({
        rankName: "2",
      });

      TestRenderer.act(() => {
        rank.props.onMouseEnterSquare("e2");
      });

      expect(onMouseEnterSquare).toHaveBeenCalledTimes(1);

      expect(onMouseEnterSquare).toBeCalledWith("e2");
    });

    it("onMouseLeaveSquare", () => {
      const onMouseLeaveSquare = jest.fn();

      const testInstance = TestRenderer.create(
        <Board onMouseLeaveSquare={onMouseLeaveSquare} />
      ).root;

      const rank: TestRenderer.ReactTestInstance = testInstance.findByProps({
        rankName: "2",
      });

      TestRenderer.act(() => {
        rank.props.onMouseLeaveSquare("e2");
      });

      expect(onMouseLeaveSquare).toHaveBeenCalledTimes(1);

      expect(onMouseLeaveSquare).toBeCalledWith("e2");
    });
  });

  describe("methods", () => {
    it("getSquareXYCoordinates()", () => {
      const ref = createRef<BoardRef>();

      render(<Board ref={ref} />);

      const boardRef: BoardRef = ref.current as BoardRef;

      expect(boardRef.getSquareXYCoordinates("b2")).toEqual({
        x: 0,
        y: 0,
      });
    });

    it("getSquareXYCoordinates() throws Error", () => {
      const ref = createRef<BoardRef>();

      render(<Board ref={ref} />);

      const boardRef: BoardRef = ref.current as BoardRef;

      expect(() => boardRef.getSquareXYCoordinates("a9")).toThrow();
    });
  });

  describe("DOM structure", () => {
    it("should contain data-testid board-wrapper", () => {
      const { queryByTestId } = render(<Board />);
      expect(queryByTestId("board-wrapper")).toBeInTheDocument();
    });
  });
});
