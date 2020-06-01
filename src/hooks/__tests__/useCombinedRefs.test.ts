import { renderHook } from "@testing-library/react-hooks";
import { useCombinedRefs } from "../useCombinedRefs";
import { createRef, RefCallback } from "react";

describe("useCombinedRefs()", () => {
  it("should return a function that will set the value to refs", () => {
    const ref1 = createRef<string>();
    const ref2 = createRef<string>();
    const ref3 = jest.fn();
    const ref4 = null;

    const { result } = renderHook<void, RefCallback<string>>(() =>
      useCombinedRefs<string>(ref1, ref2, ref3, ref4)
    );

    result.current("a");

    expect(ref1.current).toBe("a");
    expect(ref2.current).toBe("a");

    expect(ref3).toHaveBeenCalledTimes(1);
    expect(ref3).toBeCalledWith("a");
  });
});
