import type { ReactNode } from "react";

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
  /** What the link is for; read after the visible text. */
  context?: string;
  /** Extra note such as "PDF", read before "opens in new tab". */
  hint?: string;
}

/**
 * The one place new-tab links are built. rel="noopener noreferrer"
 * stops the new page reaching window.opener and hides the referrer;
 * the sr-only suffix warns assistive tech, after the visible text so
 * the accessible name still starts with what sighted users read.
 */
function ExternalLink({ href, children, className, context, hint }: Props) {
  const note = `${hint ? `${hint}, ` : ""}opens in new tab`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      <span className="sr-only">
        {context ? ` for ${context}` : ""} ({note})
      </span>
    </a>
  );
}

export default ExternalLink;
