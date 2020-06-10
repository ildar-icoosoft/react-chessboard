import { useMemo } from "react";
import { HighlightedSquareType } from "../components/HightlightedSquare";

export interface NormalizedHighlightedSquare {
  coordinates: string;
  types: HighlightedSquareType[];
}

export type DenormalizedHighlightedSquare = {
  [key: string]: string[];
};

export const useNormalizedHighlightedSquares = (
  denormalizedHighlightedSquare: DenormalizedHighlightedSquare
): NormalizedHighlightedSquare[] => {
  return useMemo(() => {
    const result: NormalizedHighlightedSquare[] = [];

    const resultObj: Record<string, HighlightedSquareType[]> = {};

    for (const type in denormalizedHighlightedSquare) {
      const coordinatesArr: string[] = denormalizedHighlightedSquare[type];

      for (const coordinates of coordinatesArr) {
        if (!resultObj[coordinates]) {
          resultObj[coordinates] = [];
        }
        resultObj[coordinates].push(type as HighlightedSquareType);
      }
    }

    for (const coordinates in resultObj) {
      result.push({
        coordinates,
        types: resultObj[coordinates],
      });
    }

    return result;
  }, [denormalizedHighlightedSquare]);
};
