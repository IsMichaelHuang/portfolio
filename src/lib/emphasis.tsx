/**
 * Emphasis
 *
 * Renders `**x**` runs in a data string as <strong>. Text without
 * markers is returned as is; an odd number of markers means the
 * string is malformed, so it is returned literally.
 */

import { Fragment, type ReactNode } from "react";

export function renderEmphasis(text: string): ReactNode {
  const parts = text.split("**");
  if (parts.length % 2 === 0) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      part && <strong key={i}>{part}</strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
