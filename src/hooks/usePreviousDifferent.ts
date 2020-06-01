import { useEffect, useRef } from "react";
import { isEqual as _isEqual } from "lodash";

const isEqual = (value1: any, value2: any, deepEquality: boolean): boolean => {
  if (deepEquality) {
    return _isEqual(value1, value2);
  }
  return Object.is(value1, value2);
};

/**
 *
 * @param value
 * @param deepEquality if true uses lodash.isEqual, if false uses Object.is
 */
export const usePreviousDifferent = <T>(
  value: T,
  deepEquality: boolean = false
): T | undefined => {
  const refPrev = useRef<T>();
  const refCurrent = useRef<T>();

  useEffect(() => {
    if (!isEqual(value, refCurrent.current, deepEquality)) {
      refPrev.current = refCurrent.current;
      refCurrent.current = value;
    }
  });

  if (isEqual(value, refCurrent.current, deepEquality)) {
    return refPrev.current;
  }
  return refCurrent.current;
};
