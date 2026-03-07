/**
 * About Section
 *
 * Two-part layout: a personal narrative followed by a data-driven
 * skills grid. The bio is edited directly in JSX (singular content),
 * while skills are rendered from data/skills.ts so that adding or
 * reordering skills requires no markup changes.
 */

import { skills } from "../data/skills";
import styles from "./About.module.css";

function About() {
  return (
    <section id="about">
      <h2>About</h2>

      {/* --- Narrative --- */}
      <div className={styles.bio}>
        <p className={styles.paragraph}>
          Software engineer based in Oakland, CA. I graduated from Cal Poly SLO
          with a degree in Computer Science and a minor in Philosophy — a
          combination that shapes how I think about building software:
          technically rigorous, but always asking <em>why</em> before{" "}
          <em>how</em>.
        </p>
        <p className={styles.paragraph}>
          Something I take seriously is how my code reads after I've left the
          room. I hold myself to a high standard on maintainability — thorough
          documentation, clean architecture, comprehensive tests — so that the
          next engineer who opens my project can understand it immediately
          without needing me to explain it.
        </p>
        <p className={styles.paragraph}>
          My work centers on applied AI — multi-agent systems, LLM
          infrastructure, and the messy engineering work of getting models to
          behave reliably in production. I'm comfortable across the stack — from
          low-level C and POSIX to React frontends — but I'm most energized by
          the systems layer where AI meets infrastructure.
        </p>
      </div>

      {/* --- Skills Grid --- */}
      <div className={styles.skillsGrid}>
        {skills.map((group) => (
          <div key={group.category} className={styles.skillGroup}>
            <h3 className={styles.skillCategory}>{group.category}</h3>
            <div className={styles.skillItems}>
              {group.items.map((skill) => (
                <span key={skill} data-pill>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default About;
