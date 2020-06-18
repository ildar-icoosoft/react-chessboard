import {
  getColorFromPieceCode,
  getDistanceBetweenSquares,
  getFileIndex,
  getFileNameFromCoordinates,
  getNearestSquare,
  getPieceCoordinatesFromPosition,
  getSquareXYCoordinates,
  getPositionDiff,
  getRankIndex,
  getRankNameFromCoordinates,
  isLightSquare,
  getSquareAlgebraicCoordinates,
  fenToObj,
  validFen,
} from "../chess";
import { PieceColor } from "../../enums/PieceColor";
import { PieceCode } from "../../enums/PieceCode";
import { Position } from "../../interfaces/Position";

describe("Chess utils", () => {
  it("isLightSquare()", () => {
    expect(isLightSquare("a1")).toBeFalsy();
    expect(isLightSquare("b1")).toBeTruthy();
    expect(isLightSquare("d1")).toBeTruthy();
    expect(isLightSquare("e5")).toBeFalsy();
    expect(isLightSquare("d7")).toBeTruthy();
    expect(isLightSquare("f8")).toBeFalsy();
  });

  it("getColorFromPieceCode()", () => {
    expect(getColorFromPieceCode(PieceCode.BLACK_QUEEN)).toBe(PieceColor.BLACK);
    expect(getColorFromPieceCode(PieceCode.WHITE_KING)).toBe(PieceColor.WHITE);
  });

  it("getFileIndex()", () => {
    expect(getFileIndex("a4")).toBe(0);
    expect(getFileIndex("h2")).toBe(7);
  });

  it("getRankIndex()", () => {
    expect(getRankIndex("a4")).toBe(3);
    expect(getRankIndex("h2")).toBe(1);
  });

  it("getFileNameFromCoordinates()", () => {
    expect(getFileNameFromCoordinates("a4")).toBe("a");
    expect(getFileNameFromCoordinates("h2")).toBe("h");
  });

  it("getRankNameFromCoordinates()", () => {
    expect(getRankNameFromCoordinates("a4")).toBe("4");
    expect(getRankNameFromCoordinates("h2")).toBe("2");
  });

  it("getDistanceBetweenSquares()", () => {
    expect(getDistanceBetweenSquares("a4", "c4")).toBe(4);
    expect(getDistanceBetweenSquares("h2", "f3")).toBe(5);
  });

  it("getSingleNearestSquare()", () => {
    expect(getNearestSquare("a4", ["b3", "c5", "h8"])).toBe("b3");

    expect(getNearestSquare("a4", [])).toBeUndefined();
  });

  it("getPieceCoordinatesFromPosition()", () => {
    const position: Position = {
      a4: PieceCode.WHITE_PAWN,
      b4: PieceCode.WHITE_PAWN,
      d8: PieceCode.BLACK_QUEEN,
      e8: PieceCode.BLACK_KING,
    };

    expect(
      getPieceCoordinatesFromPosition(PieceCode.WHITE_PAWN, position)
    ).toEqual(expect.arrayContaining(["a4", "b4"]));

    expect(
      getPieceCoordinatesFromPosition(PieceCode.BLACK_QUEEN, position)
    ).toEqual(expect.arrayContaining(["d8"]));
  });

  it("getPositionDiff()", () => {
    const currentPosition: Position = {
      a4: PieceCode.WHITE_PAWN,
      b4: PieceCode.WHITE_PAWN,
      d8: PieceCode.BLACK_QUEEN,
      e8: PieceCode.BLACK_KING,
      f1: PieceCode.WHITE_BISHOP,
      f4: PieceCode.WHITE_BISHOP,
    };

    const previousPosition: Position = {
      a3: PieceCode.WHITE_PAWN,
      b2: PieceCode.WHITE_PAWN,
      d8: PieceCode.BLACK_QUEEN,
      c1: PieceCode.WHITE_BISHOP,
      f1: PieceCode.WHITE_BISHOP,
    };

    expect(getPositionDiff(currentPosition, previousPosition)).toEqual({
      a4: "a3",
      b4: "b2",
      f4: "c1",
    });
  });

  it("getSquareXYCoordinates()", () => {
    expect(getSquareXYCoordinates("a8", 480, PieceColor.WHITE)).toEqual({
      x: 0,
      y: 0,
    });

    expect(getSquareXYCoordinates("h1", 480, PieceColor.BLACK)).toEqual({
      x: 0,
      y: 0,
    });

    expect(getSquareXYCoordinates("a4", 480, PieceColor.WHITE)).toEqual({
      x: 0,
      y: 240,
    });

    expect(getSquareXYCoordinates("a4", 480, PieceColor.BLACK)).toEqual({
      x: 420,
      y: 180,
    });
  });

  it("getSquareAlgebraicCoordinates()", () => {
    expect(
      getSquareAlgebraicCoordinates({ x: 0, y: 0 }, 480, PieceColor.WHITE)
    ).toBe("a8");

    expect(
      getSquareAlgebraicCoordinates({ x: 0, y: 0 }, 480, PieceColor.BLACK)
    ).toBe("h1");

    expect(
      getSquareAlgebraicCoordinates({ x: 479, y: 0 }, 480, PieceColor.WHITE)
    ).toBe("h8");

    expect(
      getSquareAlgebraicCoordinates({ x: 479, y: 0 }, 480, PieceColor.BLACK)
    ).toBe("a1");

    expect(
      getSquareAlgebraicCoordinates({ x: 150, y: 200 }, 480, PieceColor.WHITE)
    ).toBe("c5");
  });

  it("fenToObj()", () => {
    const fen: string = "8/8/4k3/4P3/4K3/8/8/8 w - -";
    expect(fenToObj(fen)).toEqual({ e4: "wK", e6: "bK", e5: "wP" });

    const invalidFen = "8/8/7/4k3/4P3/4K3/8/8/8 w - -";
    expect(fenToObj(invalidFen)).toBeNull();
  });

  test("validFen()", () => {
    const fen = "8/8/4k3/4P3/4K3/8/8/8 w - -";
    const invalidFen = "8/8/7/4k3/4P3/4K3/8/8/8 w - -";
    const invalidFen2 = "-5/8/4k3/4P3/4K3/8/8/8 w - -";

    expect(validFen(fen)).toBe(true);
    expect(validFen(invalidFen)).toBe(false);
    expect(validFen(invalidFen2)).toBe(false);
  });
});
