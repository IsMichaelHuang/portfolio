/**
 * Hero Section
 *
 * The full-viewport introductory section at the top of the page:
 * the logo mark (decorative), name, role, a one-line summary, and
 * links (resume, GitHub, LinkedIn, email). Children fade and rise once on
 * load; reduced motion turns that off.
 *
 * The id="hero" attribute serves as a scroll anchor, allowing
 * navigation links elsewhere on the page to jump here via href="#hero".
 *
 * Styles are scoped via CSS Modules (Hero.module.css) to prevent
 * class name collisions with other components.
 */

import mark from "../assets/mark.webp";
import styles from "./Hero.module.css";
import ExternalLink from "../components/ExternalLink";

function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <img
        src={mark}
        alt=""
        width={128}
        height={128}
        fetchPriority="high"
        decoding="async"
        className={styles.mark}
      />
      {/* h1 is used exactly once per page for the primary heading
          (accessibility & SEO) */}
      <h1 className={styles.name}>Michael Huang</h1>
      <p className={styles.title}>Software Engineer</p>
      <p className={styles.blurb}>
        Applied AI engineer — multi-agent systems and LLM
        infrastructure.
      </p>
      <div className={styles.links}>
        <ExternalLink
          href={`${import.meta.env.BASE_URL}resume.pdf`}
          hint="PDF"
          className={styles.link}
        >
          Resume
        </ExternalLink>
        <ExternalLink
          href="https://github.com/IsMichaelHuang"
          className={styles.link}
        >
          GitHub
        </ExternalLink>
        <ExternalLink
          href="https://www.linkedin.com/in/michael-micah-huang/"
          className={styles.link}
        >
          LinkedIn
        </ExternalLink>
        <a
          href="mailto:michael.micah.huang@gmail.com"
          className={styles.link}
        >
          Email
        </a>
      </div>
    </section>
  );
}

export default Hero;
