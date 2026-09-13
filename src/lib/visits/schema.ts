export type VisitStats = {
  total: number;
  /** ISO date ("YYYY-MM-DD", UTC) -> visit count for that day. */
  byDay: Record<string, number>;
};
