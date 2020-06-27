export interface Move {
  /**
   * The location the piece is moving from.
   * Must be in san format, e.g "h8"
   */
  from: string;

  /**
   * The location the piece is moving to.
   * Must be in san format, e.g "a1"
   */
  to: string;
}
