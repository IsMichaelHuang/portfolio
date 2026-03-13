/**
 * Navbar
 *
 * Fixed site-wide navigation bar rendered at the top of every page view.
 * All navigation is in-page: every href is a hash anchor that targets a
 * section element by its `id` attribute. No client-side router is involved.
 *
 * Active link highlighting:
 *   An IntersectionObserver watches all navigable sections. When a section
 *   enters the "active zone" — defined by rootMargin as the band between
 *   the navbar bottom and 45% up from the viewport bottom — its id is set
 *   as the active section and the corresponding nav link is highlighted.
 *   This means the link for whichever section is currently at the top of
 *   the readable area lights up as you scroll.
 *
 * Scroll behavior is controlled globally in index.css:
 *   - `scroll-behavior: smooth`  — animates the scroll instead of jumping
 *   - `scroll-padding-top: 64px` — offsets the scroll target so content
 *     lands below the fixed bar rather than underneath it
 *
 * Accessibility:
 *   - Rendered as a semantic <nav> element, which creates a landmark region
 *     that screen readers can navigate to directly.
 *   - Links are plain <a> elements with meaningful text labels, so they are
 *     announced correctly without additional ARIA attributes.
 *   - The active link receives aria-current="page" so screen readers
 *     announce which section is currently in view.
 *
 * To add or reorder navigation items, edit the `links` array only.
 * The component renders from that array, so no JSX changes are needed.
 *
 * Styles are scoped via CSS Modules (Navbar.module.css).
 */
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

/**
 * Navigation link definitions.
 *
 * Each `href` must match the `id` of the target <section> exactly.
 * The browser resolves the anchor at click time via a DOM lookup
 * (`document.getElementById`), so no build-time binding exists —
 * a mismatched id silently fails to scroll.
 *
 * Order here determines the visual order in the rendered nav bar.
 */
const links = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

/** Section ids derived from the links array, used to query DOM targets. */
const sectionIds = links.map(({ href }) => href.slice(1));

function Navbar() {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    /**
     * rootMargin shrinks the intersection viewport:
     *   - Top: -64px hides the navbar height so sections behind it don't count
     *   - Bottom: -45% means a section must be in the top 55% of the viewport
     *     to be considered active, which keeps the highlight on the section
     *     the user is currently reading rather than jumping ahead.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-64px 0px -45% 0px" }
    );

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <nav className={styles.nav}>
      <a href="#hero" className={styles.brand}>
        Michael Huang
      </a>
      <ul className={styles.links}>
        {links.map(({ label, href }) => {
          const isActive = activeId === href.slice(1);
          return (
            <li key={href}>
              <a
                href={href}
                className={`${styles.link} ${isActive ? styles.active : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Navbar;
