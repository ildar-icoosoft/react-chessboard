import { Ref, RefCallback, useCallback } from "react";

/**
 * Combines many refs into one. Useful for combining many ref hooks
 * @see https://github.com/facebook/react/issues/13029
 */
export const useCombinedRefs = <T extends any>(
  ...refs: Array<Ref<T>>
): RefCallback<T> =>
  useCallback(
    (element: T) =>
      refs.forEach((ref) => {
        if (!ref) {
          return;
        }

        // Ref can have two types - a function or an object. We treat each case.
        if (typeof ref === "function") {
          return ref(element);
        }

        // As per https://github.com/facebook/react/issues/13029
        // it should be fine to set current this way.
        (ref as any).current = element;
      }),
    refs
  );
