/**
 * Navbar
 *
 * Fixed in-page navigation (hash anchors, no router), a "Primary"
 * navigation landmark. To add or reorder items, edit `links` only.
 *
 * Active link: passive scroll and resize listeners measure each
 * section's top and ask `pickActive` which one the reader is in, with
 * the bar's measured height (+ 8px) as the offset. Above the first
 * section nothing is current; at the page bottom the last section is.
 * The current link gets aria-current="location".
 *
 * Styles are scoped via CSS Modules (Navbar.module.css).
 */
import { useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";
import mark from "../assets/mark.webp";
import { pickActive } from "../lib/activeSection";

/**
 * Navigation link definitions.
 *
 * Each `href` must match the `id` of the target <section> exactly.
 * The browser resolves the anchor at click time via a DOM lookup
 * (`document.getElementById`), so no build-time binding exists —
 * a mismatched id silently fails to scroll.
 *
 * Order here determines the visual order in the rendered nav bar and
 * must match the section order in App.tsx (the scroll-spy needs
 * document order).
 */
const links = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/** Section ids derived from the links array, used to query DOM targets. */
const sectionIds = links.map(({ href }) => href.slice(1));

function Navbar() {
  const [activeId, setActiveId] = useState<string>("");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const update = () => {
      const tops = sectionIds.flatMap((id) => {
        const el = document.getElementById(id);
        return el ? [{ id, top: el.getBoundingClientRect().top }] : [];
      });
      const offset = (navRef.current?.offsetHeight ?? 0) + 8;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      setActiveId(pickActive(tops, offset, atBottom));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <nav ref={navRef} aria-label="Primary" className={styles.nav}>
      <a href="#hero" className={styles.brand}>
        <img src={mark} alt="" width={28} height={28} />
        <span className={styles.brandText}>Michael Huang</span>
      </a>
      <ul className={styles.links}>
        {links.map(({ label, href }) => {
          const isActive = activeId === href.slice(1);
          return (
            <li key={href}>
              <a
                href={href}
                className={`${styles.link} ${isActive ? styles.active : ""}`}
                aria-current={isActive ? "location" : undefined}
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
