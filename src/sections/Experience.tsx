/**
 * Experience Section
 *
 * Renders work experience from the data layer as a vertical list.
 * Each entry shows the role, company, time period, and bullet-point
 * highlights. Inline rendering for now — can be extracted into a
 * reusable ExperienceItem component later.
 *
 * Data flows one direction: data/experience.ts → this section.
 * Adding a new role to the data array automatically renders it here.
 */

import { experience } from "../data/experience";
import styles from "./Experience.module.css";

function Experience() {
  return (
    <section id="experience">
      <h2>Experience</h2>
      <div className={styles.list}>
        {experience.map((entry) => (
          <div key={entry.id} className={styles.entry}>
            <div className={styles.header}>
              <h3 className={styles.role}>{entry.role}</h3>
              <span className={styles.period}>{entry.period}</span>
            </div>
            <p className={styles.company}>{entry.company}</p>
            {/* Semantic list for highlights — accessible and correct for bullet-point content */}
            <ul className={styles.highlights}>
              {entry.highlights.map((item, index) => (
                <li key={index} className={styles.highlight}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Experience;
