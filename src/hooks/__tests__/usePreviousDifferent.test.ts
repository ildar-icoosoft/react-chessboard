import { renderHook } from "@testing-library/react-hooks";
import { usePreviousDifferent } from "../usePreviousDifferent";

describe("usePreviousDifferent()", () => {
  it("should return ref with previous value, which is not equal to current", () => {
    const { result, rerender } = renderHook<string, string | undefined>(
      (initialValue) => usePreviousDifferent<string>(initialValue),
      {
        initialProps: "a",
      }
    );

    expect(result.current).toBeUndefined();

    rerender("b");

    expect(result.current).toBe("a");

    rerender("b");

    expect(result.current).toBe("a");

    rerender("c");

    expect(result.current).toBe("b");
  });

  it("deep comparison is disabled by default", () => {
    const { result, rerender } = renderHook<any, any>(
      (initialValue) => usePreviousDifferent<any>(initialValue),
      {
        initialProps: {
          a: 1,
          b: 1,
        },
      }
    );

    expect(result.current).toBeUndefined();

    rerender({
      a: 1,
      b: 1,
    });

    expect(result.current).toEqual({
      a: 1,
      b: 1,
    });

    rerender({
      a: 2,
      b: 2,
    });

    expect(result.current).toEqual({
      a: 1,
      b: 1,
    });

    rerender({
      a: 2,
      b: 2,
    });

    expect(result.current).toEqual({
      a: 2,
      b: 2,
    });
  });

  it("disabled deep comparison", () => {
    const { result, rerender } = renderHook<any, any>(
      (initialValue) => usePreviousDifferent<any>(initialValue),
      {
        initialProps: {
          a: 1,
          b: 1,
        },
      }
    );

    expect(result.current).toBeUndefined();

    rerender({
      a: 1,
      b: 1,
    });

    expect(result.current).toEqual({
      a: 1,
      b: 1,
    });

    rerender({
      a: 2,
      b: 2,
    });

    expect(result.current).toEqual({
      a: 1,
      b: 1,
    });

    rerender({
      a: 2,
      b: 2,
    });

    expect(result.current).toEqual({
      a: 2,
      b: 2,
    });
  });

  it("enabled deep comparison", () => {
    const { result, rerender } = renderHook<any, any>(
      (initialValue) => usePreviousDifferent<any>(initialValue, true),
      {
        initialProps: {
          a: 1,
          b: 1,
        },
      }
    );

    expect(result.current).toBeUndefined();

    rerender({
      a: 1,
      b: 1,
    });

    expect(result.current).toBeUndefined();

    rerender({
      a: 2,
      b: 2,
    });

    expect(result.current).toEqual({
      a: 1,
      b: 1,
    });

    rerender({
      a: 2,
      b: 2,
    });

    expect(result.current).toEqual({
      a: 1,
      b: 1,
    });
  });
});
