/**
 * Hero Section
 *
 * The first view: the figure "~70" at a scale that owns the viewport,
 * on the amber ground, captioned by what it counts. Beside the caption
 * sit the name (the page's one h1), a one-line summary and the links
 * (resume, GitHub, LinkedIn, email). Blocks fade and rise once on load;
 * reduced motion turns that off.
 */

import styles from "./Hero.module.css";
import ExternalLink from "../components/ExternalLink";
import Figure from "../components/Figure";
import { heroFigure } from "../data/experience";

function Hero() {
  return (
    <section id="hero" data-ground="amber" className={styles.hero}>
      <Figure
        value={heroFigure.value}
        unit={heroFigure.unit}
        size="hero"
      />
      <div className={styles.body}>
      <h1 className={styles.name}>Michael Huang</h1>
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
      </div>
    </section>
  );
}

export default Hero;
