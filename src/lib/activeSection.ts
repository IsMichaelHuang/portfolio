/**
 * Picks the id of the section the reader is in: the last one whose
 * top is at or above `offset`. None above the first section; the
 * last one when scrolled to the bottom (short final sections may
 * never reach the offset).
 */
export function pickActive(
  tops: { id: string; top: number }[],
  offset: number,
  atBottom: boolean,
): string {
  if (tops.length === 0) return ''
  if (atBottom) return tops[tops.length - 1].id
  const above = tops.filter((t) => t.top <= offset)
  return above.length ? above[above.length - 1].id : ''
}
