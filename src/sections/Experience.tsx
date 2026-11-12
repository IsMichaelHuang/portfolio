/**
 * Experience Section
 *
 * Renders work experience from the data layer. Each entry is an
 * article: company (h3), role, a metadata block with the period and
 * location, then the bullet-point highlights. Bullets pass through
 * renderEmphasis, so `**x**` in the data shows as bold.
 *
 * Data flows one direction: data/experience.ts → this section.
 * Adding a new role to the data array automatically renders it here.
 */

import { experience } from "../data/experience";
import { renderEmphasis } from "../lib/emphasis";
import styles from "./Experience.module.css";

function Experience() {
  return (
    <section id="experience">
      <h2>Experience</h2>
      <div className={styles.list}>
        {experience.map((entry) => (
          <article key={entry.id} className={styles.entry}>
            <h3 className={styles.company}>{entry.company}</h3>
            <p className={styles.role}>{entry.role}</p>
            <div className={styles.meta}>
              <span className={styles.period}>{entry.period}</span>
              <span>{entry.location}</span>
            </div>
            {/* Semantic list for highlights — accessible and correct for
                bullet-point content */}
            <ul className={styles.highlights}>
              {entry.highlights.map((item, index) => (
                <li key={index} className={styles.highlight}>
                  {renderEmphasis(item)}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Experience;
