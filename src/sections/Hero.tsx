/**
 * Hero Section
 *
 * The full-viewport introductory section at the top of the page.
 * Displays the user's name, title, a short description, and
 * call-to-action links (resume, GitHub, LinkedIn).
 *
 * The id="hero" attribute serves as a scroll anchor, allowing
 * navigation links elsewhere on the page to jump here via href="#hero".
 *
 * Styles are scoped via CSS Modules (Hero.module.css) to prevent
 * class name collisions with other components.
 */

import styles from "./Hero.module.css";

function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      {/* h1 is used exactly once per page for the primary heading (accessibility & SEO) */}
      <h1 className={styles.name}>Michael Huang</h1>
      <p className={styles.title}>Software Engineer</p>
      <p className={styles.blurb}>
        Building across full-stack, AI, and beyond.
      </p>
      <div className={styles.links}>
        {/* Internal link — serves a static PDF from the assets directory */}
        <a href="/resume.pdf" className={styles.link}>
          Resume
        </a>
        {/*
         * External links use:
         *   target="_blank"         — opens in a new tab so users don't leave the portfolio
         *   rel="noopener"          — prevents the new tab from accessing window.opener
         *                             (mitigates reverse tabnapping attacks)
         *   rel="noreferrer"        — additionally prevents sending the Referer header
         *                             to the target site
         */}
        <a
          href="https://github.com/IsMichaelHuang"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/michael-micah-huang/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}

export default Hero;
