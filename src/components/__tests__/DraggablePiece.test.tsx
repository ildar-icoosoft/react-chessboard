import React, { createRef } from "react";
import { ReactDndRefType } from "../../interfaces/ReactDndRefType";
import { PieceCode } from "../../enums/PieceCode";
import { DraggablePiece, DraggablePieceRef } from "../DraggablePiece";
import TestRenderer from "react-test-renderer";
import { wrapInTestContext } from "react-dnd-test-utils";

describe("DraggablePiece", () => {
  const DraggablePieceWithDnd = wrapInTestContext(DraggablePiece);

  describe("methods", () => {
    it("getDropHandlerId()", () => {
      const dragAndDropRef = createRef<ReactDndRefType>();

      TestRenderer.create(
        <DraggablePieceWithDnd
          ref={dragAndDropRef}
          pieceCode={PieceCode.WHITE_KING}
        />
      );

      const draggablePieceRef: DraggablePieceRef = (dragAndDropRef.current as ReactDndRefType).getDecoratedComponent<
        DraggablePieceRef
      >();

      expect(draggablePieceRef.getDragHandlerId()).toBeTruthy();
    });
  });
});
