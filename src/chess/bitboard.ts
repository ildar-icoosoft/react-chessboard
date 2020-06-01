import { Bitboard } from "../interfaces/Bitboard";

/**
 * @param low Lower 32 bits of the 64 bit value
 * @param high Upper 32 bits of the 64 bit value
 * @return bitboard
 */
export const makeBitboard = (low: number, high: number): Bitboard => {
  return {
    low,
    high,
  };
};

/**
 * @return bitboard of all zeros
 */
export const makeZeroBitboard = (): Bitboard => {
  return makeBitboard(0, 0);
};

/**
 * @param bitboard
 * @return true if all the bits in this Bitboard are zero *!/
 */
export const isBitboardEmpty = (bitboard: Bitboard): boolean =>
  !bitboard.low && !bitboard.high;

/**
 * @param bitboard
 * @param index 0-63
 * @return true if the bit at index is 0
 */
export const isBitClear = (bitboard: Bitboard, index: number): boolean => {
  index >>>= 0;

  if (index < 32) {
    return !(bitboard.low & (1 << index));
  }

  return !(bitboard.high & (1 << (index - 32)));
};

/**
 * @param bitboard
 * @param index 0-63
 * @return true if the bit at index is 1
 */
export const isBitSet = (bitboard: Bitboard, index: number): boolean => {
  return !isBitClear(bitboard, index);
};

/**
 * @param bitboard
 * @param index 0-63
 * @return this or 1 << index
 */
export const setBit = (bitboard: Bitboard, index: number): Bitboard => {
  index >>>= 0;

  const result: Bitboard = Object.assign({}, bitboard);

  if (index < 32) {
    result.low = (bitboard.low | (1 << index)) >>> 0;
  } else {
    result.high = (bitboard.high | (1 << (index - 32))) >>> 0;
  }

  return result;
};

/**
 * @param bitboard
 * @param index 0-63
 * @return this and not 1 << index
 */
export const clearBit = (bitboard: Bitboard, index: number) => {
  index >>>= 0;

  const result: Bitboard = Object.assign({}, bitboard);

  if (index < 32) {
    result.low = (bitboard.low & ~(1 << index)) >>> 0;
  } else {
    result.high = (bitboard.high & ~(1 << (index - 32))) >>> 0;
  }

  return result;
};

/**
 * @param bitboard
 * @param other
 * @return this and other
 */
export const and = (bitboard: Bitboard, other: Bitboard): Bitboard => {
  return {
    low: (bitboard.low & other.low) >>> 0,
    high: (bitboard.high & other.high) >>> 0,
  };
};

/**
 * @param bitboard
 * @param other
 * @return this and not other
 */
export const andNot = (bitboard: Bitboard, other: Bitboard): Bitboard => {
  return {
    low: (bitboard.low & ~other.low) >>> 0,
    high: (bitboard.high & ~other.high) >>> 0,
  };
};

/**
 * @param bitboard
 * @param other
 * @return this or other
 */
export const or = (bitboard: Bitboard, other: Bitboard): Bitboard => {
  return {
    low: (bitboard.low | other.low) >>> 0,
    high: (bitboard.high | other.high) >>> 0,
  };
};

/**
 * @param bitboard
 * @param other
 * @return this xor other
 */
export const xor = (bitboard: Bitboard, other: Bitboard): Bitboard => {
  return {
    low: (bitboard.low ^ other.low) >>> 0,
    high: (bitboard.high ^ other.high) >>> 0,
  };
};

/**
 * @param bitboard
 * @return not this
 */
export const not = (bitboard: Bitboard): Bitboard => {
  return {
    low: ~bitboard.low >>> 0,
    high: ~bitboard.high >>> 0,
  };
};

/**
 * @param bitboard
 * @param other
 * @return 'this' equals 'other'
 */
export const isEqual = (bitboard: Bitboard, other: Bitboard): boolean => {
  return bitboard.low === other.low && bitboard.high === other.high;
};

/**
 * @param bitboard
 * @return copy of this
 */
export const copy = (bitboard: Bitboard): Bitboard => {
  return makeBitboard(bitboard.low, bitboard.high);
};
