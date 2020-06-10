import { renderHook } from "@testing-library/react-hooks";
import {
  DenormalizedHighlightedSquare,
  NormalizedHighlightedSquare,
  useNormalizedHighlightedSquares,
} from "../useNomalizedHighlightedSquares";
import { HighlightedSquareType } from "../../components/HightlightedSquare";

describe("useNormalizedHighlightedSquares()", () => {
  it("should return normalized highlighted squares list", () => {
    const { result, rerender } = renderHook<
      DenormalizedHighlightedSquare,
      NormalizedHighlightedSquare[]
    >((initialValue) => useNormalizedHighlightedSquares(initialValue), {
      initialProps: {},
    });

    expect(result.current).toEqual([]);

    rerender({
      [HighlightedSquareType.SELECTION]: ["a1", "b1"],
      [HighlightedSquareType.OCCUPATION]: ["a1", "c1"],
    });

    expect(result.current).toEqual(
      expect.arrayContaining([
        {
          coordinates: "a1",
          types: expect.arrayContaining([
            HighlightedSquareType.SELECTION,
            HighlightedSquareType.OCCUPATION,
          ]),
        },
        {
          coordinates: "b1",
          types: expect.arrayContaining([HighlightedSquareType.SELECTION]),
        },
        {
          coordinates: "c1",
          types: expect.arrayContaining([HighlightedSquareType.OCCUPATION]),
        },
      ])
    );

    rerender({
      [HighlightedSquareType.SELECTION]: ["a1", "b1"],
      [HighlightedSquareType.OCCUPATION]: ["a1", "c1"],
      [HighlightedSquareType.DESTINATION]: ["a2", "b1", "c3"],
    });

    expect(result.current).toEqual(
      expect.arrayContaining([
        {
          coordinates: "a1",
          types: expect.arrayContaining([
            HighlightedSquareType.SELECTION,
            HighlightedSquareType.OCCUPATION,
          ]),
        },
        {
          coordinates: "b1",
          types: expect.arrayContaining([
            HighlightedSquareType.SELECTION,
            HighlightedSquareType.DESTINATION,
          ]),
        },
        {
          coordinates: "c1",
          types: expect.arrayContaining([HighlightedSquareType.OCCUPATION]),
        },
        {
          coordinates: "a2",
          types: expect.arrayContaining([HighlightedSquareType.DESTINATION]),
        },
        {
          coordinates: "c3",
          types: expect.arrayContaining([HighlightedSquareType.DESTINATION]),
        },
      ])
    );
  });
});
