/**
 * About Section
 *
 * A personal narrative block that tells visitors who you are beyond
 * your project list and job titles. Includes a short bio and a
 * skills summary.
 *
 * Unlike Projects or Experience, this section has no backing data file
 * because the content is singular — there's only one "about you."
 * Edit the JSX directly to update.
 */

import styles from "./About.module.css";

function About() {
  return (
    <section id="about" className={styles.section}>
      <h2 className={styles.heading}>About</h2>
      <div className={styles.content}>
        <p className={styles.bio}>
          I'm a software engineer who enjoys building across the full stack —
          from frontend interfaces to backend systems to AI-powered tools.
          I care about writing clean, maintainable code and shipping products
          that solve real problems.
        </p>
        <div className={styles.skills}>
          <h3 className={styles.skillsHeading}>Skills</h3>
          <div className={styles.skillGroup}>
            <h4 className={styles.skillLabel}>Languages</h4>
            <p className={styles.skillList}>TypeScript, Python, JavaScript</p>
          </div>
          <div className={styles.skillGroup}>
            <h4 className={styles.skillLabel}>Frontend</h4>
            <p className={styles.skillList}>React, HTML, CSS</p>
          </div>
          <div className={styles.skillGroup}>
            <h4 className={styles.skillLabel}>Backend & AI</h4>
            <p className={styles.skillList}>Node.js, FastAPI, LLMs</p>
          </div>
          <div className={styles.skillGroup}>
            <h4 className={styles.skillLabel}>Tools</h4>
            <p className={styles.skillList}>Git, Docker, AWS</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
