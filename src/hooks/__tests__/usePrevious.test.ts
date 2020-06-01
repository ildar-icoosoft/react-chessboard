import { renderHook } from "@testing-library/react-hooks";
import { usePrevious } from "../usePrevious";

describe("usePrevious()", () => {
  it("should return ref with previous value", () => {
    const { result, rerender } = renderHook<string, string | undefined>(
      (initialValue) => usePrevious<string>(initialValue),
      {
        initialProps: "a",
      }
    );

    expect(result.current).toBeUndefined();

    rerender("b");

    expect(result.current).toBe("a");

    rerender("b");

    expect(result.current).toBe("b");

    rerender("c");

    expect(result.current).toBe("b");
  });
});
