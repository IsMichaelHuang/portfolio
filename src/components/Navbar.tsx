/**
 * Navbar
 *
 * Fixed site-wide navigation bar rendered at the top of every page view.
 * All navigation is in-page: every href is a hash anchor that targets a
 * section element by its `id` attribute. No client-side router is involved.
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
 *
 * To add or reorder navigation items, edit the `links` array only.
 * The component renders from that array, so no JSX changes are needed.
 *
 * Styles are scoped via CSS Modules (Navbar.module.css).
 */
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

function Navbar() {
  return (
    <nav className={styles.nav}>
      <a href="#hero" className={styles.brand}>
        Michael Huang
      </a>
      <ul className={styles.links}>
        {links.map(({ label, href }) => (
          <li key={href}>
            <a href={href} className={styles.link}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
