import { DragDropManager } from "dnd-core";

export interface ReactDndRefType {
  getManager(): DragDropManager | undefined;
  getDecoratedComponent<T>(): T;
}
