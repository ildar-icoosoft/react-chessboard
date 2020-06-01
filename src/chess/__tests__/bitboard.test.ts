import {
  and,
  andNot,
  clearBit,
  copy,
  isBitboardEmpty,
  isBitClear,
  isBitSet,
  isEqual,
  makeBitboard,
  makeZeroBitboard,
  not,
  or,
  setBit,
  xor,
} from "../bitboard";
import { Bitboard } from "../../interfaces/Bitboard";

describe("Bitboard", () => {
  it("makeBitboard()", () => {
    expect(makeBitboard(10, 20)).toEqual({
      low: 10,
      high: 20,
    });
  });

  it("makeZeroBitboard()", () => {
    expect(makeZeroBitboard()).toEqual({
      low: 0,
      high: 0,
    });
  });

  it("isBitboardEmpty()", () => {
    expect(
      isBitboardEmpty({
        low: 0,
        high: 0,
      })
    ).toBeTruthy();

    expect(
      isBitboardEmpty({
        low: 2,
        high: 1,
      })
    ).toBeFalsy();
  });

  it("isBitClear()", () => {
    const bitboard: Bitboard = {
      low: 4,
      high: 0,
    };

    expect(isBitClear(bitboard, 2)).toBeFalsy();
    expect(isBitClear(bitboard, 40)).toBeTruthy();
  });

  it("isBitSet()", () => {
    const bitboard: Bitboard = {
      low: 4,
      high: 0,
    };

    expect(isBitSet(bitboard, 2)).toBeTruthy();
    expect(isBitSet(bitboard, 40)).toBeFalsy();
  });

  it("setBit()", () => {
    const bitboard: Bitboard = setBit(
      {
        low: 4,
        high: 0,
      },
      5
    );

    expect(isBitSet(bitboard, 2)).toBeTruthy();
    expect(isBitSet(bitboard, 5)).toBeTruthy();
    expect(isBitSet(bitboard, 40)).toBeFalsy();

    const bitboard2: Bitboard = setBit(
      {
        low: 0,
        high: 2,
      },
      40
    );

    expect(isBitSet(bitboard2, 2)).toBeFalsy();
    expect(isBitSet(bitboard2, 33)).toBeTruthy();
    expect(isBitSet(bitboard2, 40)).toBeTruthy();
  });

  it("clearBit()", () => {
    const bitboard: Bitboard = clearBit(
      {
        low: 4,
        high: 0,
      },
      2
    );
    expect(isBitSet(bitboard, 2)).toBeFalsy();

    const bitboard2: Bitboard = clearBit(
      {
        low: 0,
        high: 2,
      },
      33
    );
    expect(isBitSet(bitboard2, 33)).toBeFalsy();
  });

  it("and()", () => {
    const bitboard: Bitboard = and(
      {
        low: 14,
        high: 5,
      },
      {
        low: 28,
        high: 5,
      }
    );

    expect(isBitSet(bitboard, 0)).toBeFalsy();
    expect(isBitSet(bitboard, 1)).toBeFalsy();
    expect(isBitSet(bitboard, 2)).toBeTruthy();
    expect(isBitSet(bitboard, 3)).toBeTruthy();
    expect(isBitSet(bitboard, 4)).toBeFalsy();
  });

  it("andNot()", () => {
    const bitboard: Bitboard = andNot(
      {
        low: 14,
        high: 5,
      },
      {
        low: 28,
        high: 5,
      }
    );

    expect(isBitSet(bitboard, 0)).toBeFalsy();
    expect(isBitSet(bitboard, 1)).toBeTruthy();
    expect(isBitSet(bitboard, 2)).toBeFalsy();
    expect(isBitSet(bitboard, 3)).toBeFalsy();
    expect(isBitSet(bitboard, 4)).toBeFalsy();
  });

  it("or()", () => {
    const bitboard: Bitboard = or(
      {
        low: 14,
        high: 5,
      },
      {
        low: 28,
        high: 5,
      }
    );

    expect(isBitSet(bitboard, 0)).toBeFalsy();
    expect(isBitSet(bitboard, 1)).toBeTruthy();
    expect(isBitSet(bitboard, 2)).toBeTruthy();
    expect(isBitSet(bitboard, 3)).toBeTruthy();
    expect(isBitSet(bitboard, 4)).toBeTruthy();
  });

  it("xor()", () => {
    const bitboard: Bitboard = xor(
      {
        low: 14,
        high: 5,
      },
      {
        low: 28,
        high: 5,
      }
    );

    expect(isBitSet(bitboard, 0)).toBeFalsy();
    expect(isBitSet(bitboard, 1)).toBeTruthy();
    expect(isBitSet(bitboard, 2)).toBeFalsy();
    expect(isBitSet(bitboard, 3)).toBeFalsy();
    expect(isBitSet(bitboard, 4)).toBeTruthy();
  });

  it("not()", () => {
    const bitboard: Bitboard = not({
      low: 14,
      high: 5,
    });

    expect(isBitSet(bitboard, 0)).toBeTruthy();
    expect(isBitSet(bitboard, 1)).toBeFalsy();
    expect(isBitSet(bitboard, 2)).toBeFalsy();
    expect(isBitSet(bitboard, 3)).toBeFalsy();
    expect(isBitSet(bitboard, 4)).toBeTruthy();
  });

  it("isEqual()", () => {
    expect(
      isEqual(
        {
          low: 14,
          high: 5,
        },
        {
          low: 14,
          high: 5,
        }
      )
    ).toBeTruthy();

    expect(
      isEqual(
        {
          low: 10,
          high: 8,
        },
        {
          low: 14,
          high: 5,
        }
      )
    ).toBeFalsy();
  });

  it("copy()", () => {
    const bitboard: Bitboard = {
      low: 14,
      high: 5,
    };

    const bitboardCopy: Bitboard = copy(bitboard);

    expect(bitboard).not.toBe(bitboardCopy);
    expect(bitboard).toEqual(bitboardCopy);
  });
});
