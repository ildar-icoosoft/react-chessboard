import { Board, getValidMoves, isValidMove } from "../index";

describe("index", () => {
  it("should export modules", () => {
    expect(Board).toBeDefined();
    expect(getValidMoves).toBeDefined();
    expect(isValidMove).toBeDefined();
  });
});
