import { renderHook } from "@testing-library/react-hooks";
import {
  useTransitionPieces,
  useTransitionPiecesResult,
} from "../useTransitionPieces";
import { Position } from "../../interfaces/Position";
import { PieceCode } from "../../enums/PieceCode";
import { XYCoordinates } from "../../interfaces/XYCoordinates";

describe("useTransitionPieces()", () => {
  it("should return transition pieces", () => {
    const position: Position = {
      e2: PieceCode.WHITE_PAWN,
    };

    const getSquareXYCoordinates = (): XYCoordinates => ({
      x: 0,
      y: 0,
    });

    const { result, rerender } = renderHook<
      Position,
      useTransitionPiecesResult
    >((position) => useTransitionPieces(position, getSquareXYCoordinates), {
      initialProps: position,
    });

    const [transitionPieces] = result.current;
    expect(transitionPieces).toEqual({});

    // change position to position2
    rerender({
      e4: PieceCode.WHITE_PAWN,
    });
    const [transitionPieces2] = result.current;
    expect(transitionPieces2).toEqual({
      e4: {
        algebraic: "e2",
        x: 0,
        y: 0,
      },
    });

    // rerender without position changing
    rerender({
      e4: PieceCode.WHITE_PAWN,
    });
    const [transitionPieces3] = result.current;
    expect(transitionPieces3).toEqual({
      e4: {
        algebraic: "e2",
        x: 0,
        y: 0,
      },
    });
  });

  it("should return empty transition pieces if disableTransitionInNextPosition() is called", () => {
    const position: Position = {
      e2: PieceCode.WHITE_PAWN,
    };

    const getSquareXYCoordinates = (): XYCoordinates => ({
      x: 0,
      y: 0,
    });

    const { result, rerender } = renderHook<
      Position,
      useTransitionPiecesResult
    >((position) => useTransitionPieces(position, getSquareXYCoordinates), {
      initialProps: position,
    });

    // position is not changed
    rerender({
      e2: PieceCode.WHITE_PAWN,
    });

    const [, disableTransitionInNextPosition] = result.current;

    disableTransitionInNextPosition();

    // position is not changed
    rerender({
      e2: PieceCode.WHITE_PAWN,
    });

    // change position to e4 position. Transition pieces must be empty because we called disableTransitionInNextPosition()
    rerender({
      e4: PieceCode.WHITE_PAWN,
    });

    const [transitionPieces2] = result.current;
    expect(transitionPieces2).toEqual({});

    // rerender without position changing. Transition pieces still must be empty
    rerender({
      e4: PieceCode.WHITE_PAWN,
    });
    const [transitionPieces3] = result.current;
    expect(transitionPieces3).toEqual({});
  });

  it("enableTransitionInNextPosition() should cancel disableTransitionInNextPosition effect", () => {
    const position: Position = {
      e2: PieceCode.WHITE_PAWN,
    };

    const getSquareXYCoordinates = (): XYCoordinates => ({
      x: 0,
      y: 0,
    });

    const { result, rerender } = renderHook<
      Position,
      useTransitionPiecesResult
    >((position) => useTransitionPieces(position, getSquareXYCoordinates), {
      initialProps: position,
    });

    const [
      ,
      disableTransitionInNextPosition,
      enableTransitionInNextPosition,
    ] = result.current;

    disableTransitionInNextPosition();
    enableTransitionInNextPosition();

    // change position to position2
    rerender({
      e4: PieceCode.WHITE_PAWN,
    });
    const [transitionPieces2] = result.current;
    expect(transitionPieces2).toEqual({
      e4: {
        algebraic: "e2",
        x: 0,
        y: 0,
      },
    });

    // rerender without position changing
    rerender({
      e4: PieceCode.WHITE_PAWN,
    });
    const [transitionPieces3] = result.current;
    expect(transitionPieces3).toEqual({
      e4: {
        algebraic: "e2",
        x: 0,
        y: 0,
      },
    });
  });

  it("disableTransitionInNextPosition() should not affect the positions following the next position", () => {
    const position: Position = {
      e2: PieceCode.WHITE_PAWN,
    };

    const getSquareXYCoordinates = (): XYCoordinates => ({
      x: 0,
      y: 0,
    });

    const { result, rerender } = renderHook<
      Position,
      useTransitionPiecesResult
    >((position) => useTransitionPieces(position, getSquareXYCoordinates), {
      initialProps: position,
    });

    const [, disableTransitionInNextPosition] = result.current;

    disableTransitionInNextPosition();

    rerender({
      e4: PieceCode.WHITE_PAWN,
    });

    // change position second time. disableTransitionInNextPosition() should not affect on transition pieces
    rerender({
      e5: PieceCode.WHITE_PAWN,
    });
    const [transitionPieces4] = result.current;
    expect(transitionPieces4).toEqual({
      e5: {
        algebraic: "e4",
        x: 0,
        y: 0,
      },
    });

    // repeat first move which was with disabled transition. But now the transition must be enabled
    rerender(position);
    rerender({
      e4: PieceCode.WHITE_PAWN,
    });
    const [transitionPieces5] = result.current;
    expect(transitionPieces5).toEqual({
      e4: {
        algebraic: "e2",
        x: 0,
        y: 0,
      },
    });
  });
});
