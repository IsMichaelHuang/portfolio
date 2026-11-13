/**
 * About Section
 *
 * One 880px left-aligned column: the bio, an Education ledger row,
 * then skills as a labelled <dl>. The bio is edited directly in JSX;
 * Education and skills render from data/education.ts and
 * data/skills.ts, so edits there need no markup changes.
 */

import { education } from "../data/education";
import { skills } from "../data/skills";
import styles from "./About.module.css";

function About() {
  return (
    <section id="about">
      <h2>About</h2>

      <div className={styles.column}>
        {/* --- Narrative --- */}
        <div className={styles.bio}>
          <p className={styles.paragraph}>
            Software engineer based in Oakland, CA. I graduated from Cal Poly
            SLO with a degree in Computer Science and a minor in Philosophy — a
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
            behave reliably in production. I'm comfortable across the stack —
            from low-level C and POSIX to React frontends — but I'm most
            energized by the systems layer where AI meets infrastructure.
          </p>
        </div>

        {/* --- Education --- */}
        <h3 className={styles.subhead}>Education</h3>
        <div className="ledger-row">
          <h4 className={styles.school}>{education.school}</h4>
          <div className="ledger-meta">{education.detail}</div>
          <p className={styles.line}>{education.degree}</p>
          <p className={styles.line}>{education.honor}</p>
          <p className={styles.line}>
            <span className={styles.cert}>{education.certification.name}</span>
            <span className={styles.issuer}>
              {education.certification.issuer}
            </span>
          </p>
        </div>

        {/* --- Skills --- */}
        <h3 className={styles.subhead}>Skills</h3>
        <dl className={styles.skills}>
          {skills.map((group) => (
            <div key={group.category} className={styles.group}>
              <dt className={styles.term}>{group.category}</dt>
              <dd className={styles.items}>{group.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default About;
