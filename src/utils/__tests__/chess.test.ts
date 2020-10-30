import {
  convertFenToPositionObject,
  getColorFromPieceCode,
  getDistanceBetweenSquares,
  getFileIndex,
  getFileNameFromCoordinates,
  getKingSquare,
  getNearestSquare,
  getOccupationSquares,
  getPieceCoordinatesFromPosition,
  getPositionDiff,
  getRankIndex,
  getRankNameFromCoordinates,
  getSquareAlgebraicCoordinates,
  getSquareXYCoordinates,
  getTurnColor,
  getValidMoves,
  isLightSquare,
  isValidFen,
  isValidMove,
  isValidPositionObject,
} from "../chess";
import { PieceCode } from "../../enums/PieceCode";
import { Position } from "../../interfaces/Position";
import { Chess, ChessInstance } from "chess.js";

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
    expect(getColorFromPieceCode(PieceCode.BLACK_QUEEN)).toBe("black");
    expect(getColorFromPieceCode(PieceCode.WHITE_KING)).toBe("white");
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
    expect(getSquareXYCoordinates("a8", 480, "white")).toEqual({
      x: 0,
      y: 0,
    });

    expect(getSquareXYCoordinates("h1", 480, "black")).toEqual({
      x: 0,
      y: 0,
    });

    expect(getSquareXYCoordinates("a4", 480, "white")).toEqual({
      x: 0,
      y: 240,
    });

    expect(getSquareXYCoordinates("a4", 480, "black")).toEqual({
      x: 420,
      y: 180,
    });
  });

  it("getSquareAlgebraicCoordinates()", () => {
    expect(getSquareAlgebraicCoordinates({ x: 0, y: 0 }, 480, "white")).toBe(
      "a8"
    );

    expect(getSquareAlgebraicCoordinates({ x: 0, y: 0 }, 480, "black")).toBe(
      "h1"
    );

    expect(getSquareAlgebraicCoordinates({ x: 479, y: 0 }, 480, "white")).toBe(
      "h8"
    );

    expect(getSquareAlgebraicCoordinates({ x: 479, y: 0 }, 480, "black")).toBe(
      "a1"
    );

    expect(
      getSquareAlgebraicCoordinates({ x: 150, y: 200 }, 480, "white")
    ).toBe("c5");
  });

  it("convertFenToPositionObject()", () => {
    const fen: string = "8/8/4k3/4P3/4K3/8/8/8 w - -";
    expect(convertFenToPositionObject(fen)).toEqual({
      e4: PieceCode.WHITE_KING,
      e6: PieceCode.BLACK_KING,
      e5: PieceCode.WHITE_PAWN,
    });

    const invalidFen = "8/8/7/4k3/4P3/4K3/8/8/8 w - -";
    expect(() => convertFenToPositionObject(invalidFen)).toThrow();
  });

  it("isValidFen()", () => {
    const fen = "8/8/4k3/4P3/4K3/8/8/8 w - -";
    const invalidFen = "8/8/7/4k3/4P3/4K3/8/8/8 w - -";
    const invalidFen2 = "-5/8/4k3/4P3/4K3/8/8/8 w - -";

    expect(isValidFen(fen)).toBe(true);
    expect(isValidFen(invalidFen)).toBe(false);
    expect(isValidFen(invalidFen2)).toBe(false);
  });

  it("isValidPositionObject()", () => {
    expect(
      isValidPositionObject({
        e4: PieceCode.WHITE_KING,
        e6: PieceCode.BLACK_KING,
        e5: PieceCode.WHITE_PAWN,
      })
    ).toBe(true);
    expect(
      isValidPositionObject({
        e4: PieceCode.WHITE_KING,
        e6: PieceCode.BLACK_KING,
        e5: PieceCode.WHITE_PAWN,
        f9: PieceCode.WHITE_PAWN,
      })
    ).toBe(false);

    expect(
      // @ts-ignore
      isValidPositionObject({ e4: "wK", e6: "bK", e5: "wP", e1: "bM" })
    ).toBe(false);

    // prototype should be ignored
    const positionWithPrototype: any = Object.create({
      e1: "bM",
    });
    Object.assign(positionWithPrototype, {
      e4: PieceCode.WHITE_KING,
      e6: PieceCode.BLACK_KING,
      e5: PieceCode.WHITE_PAWN,
    });
    expect(isValidPositionObject(positionWithPrototype)).toBe(true);
  });

  it("getValidMoves()", () => {
    const initialFen: string = "8/4p3/8/5k2/8/3p4/4PP2/4K3 w KQkq - 0 1";

    const game: ChessInstance = new Chess(initialFen);

    expect(getValidMoves(game)).toEqual({
      e1: ["d2", "f1", "d1", "g1", "c1"],
      e2: ["e3", "e4", "d3"],
      f2: ["f3", "f4"],
    });
  });

  it("isValidMove()", () => {
    const initialFen: string = "8/4p3/8/5k2/8/3p4/4PP2/4K3 w KQkq - 0 1";

    const game: ChessInstance = new Chess(initialFen);

    expect(
      isValidMove(game, {
        from: "d1",
        to: "d2",
      })
    ).toBeFalsy();

    expect(
      isValidMove(game, {
        from: "e1",
        to: "d3",
      })
    ).toBeFalsy();

    expect(
      isValidMove(game, {
        from: "e1",
        to: "d2",
      })
    ).toBeTruthy();
  });

  it("getTurnColor()", () => {
    expect(getTurnColor(null)).toBe("white");

    const initialFen: string = "8/4p3/8/5k2/8/3p4/4PP2/4K3 w KQkq - 0 1";

    const game: ChessInstance = new Chess(initialFen);

    expect(getTurnColor(game)).toBe("white");

    game.move({
      from: "e2",
      to: "e4",
    });

    expect(getTurnColor(game)).toBe("black");
  });

  it("getKingSquare()", () => {
    const position: Position = {
      e1: PieceCode.WHITE_KING,
      e6: PieceCode.BLACK_KING,
      e5: PieceCode.WHITE_PAWN,
    };

    expect(getKingSquare(position, "white")).toBe("e1");
    expect(getKingSquare(position, "black")).toBe("e6");

    // prototype should be ignored
    const positionWithPrototype: any = Object.create({
      e1: PieceCode.WHITE_KING,
    });
    Object.assign(positionWithPrototype, {
      e6: PieceCode.BLACK_KING,
      e5: PieceCode.WHITE_PAWN,
    });

    expect(getKingSquare(positionWithPrototype, "white")).toBeUndefined();
    expect(getKingSquare(positionWithPrototype, "black")).toBe("e6");
  });

  it("getOccupationSquares()", () => {
    const position: Position = {
      e1: PieceCode.WHITE_KING,
      e6: PieceCode.BLACK_KING,
      e5: PieceCode.WHITE_PAWN,
    };

    expect(getOccupationSquares(position, ["e5", "e6", "e8"])).toEqual(
      expect.arrayContaining(["e5", "e6"])
    );
  });
});
