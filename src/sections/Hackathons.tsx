/**
 * Hackathons Section
 *
 * A teal band. From 720px the left column pins one very large "2nd"
 * and the lede under the nav while the takeaway and the three
 * entries scroll past on the right; below that everything stacks.
 * It has no nav link: while it is on screen the Experience link
 * stays current.
 *
 * Data flows one way: data/work.ts → here.
 * Heading levels: h2 section, h3 event.
 */

import { hackathons } from "../data/work";
import styles from "./Hackathons.module.css";
import Figure from "../components/Figure";
import ExternalLink from "../components/ExternalLink";

function Hackathons() {
  return (
    <section id="hackathons" data-ground="teal">
      <h2>Hackathons</h2>
      <div className={styles.band}>
        <div className={styles.pin}>
          <Figure decorative size="band" value={hackathons[0].place} />
          <p className={styles.lede}>Second place at three hackathons.</p>
        </div>
        <div className={styles.rest}>
          <p className={styles.takeaway}>
            My biggest lesson from these hackathons so far: clarity wins. Simple
            idea, strong execution, clear story.
          </p>
          <div className={styles.hackathons}>
            {hackathons.map((h) => (
              <article key={h.id} className={styles.hackathon}>
                <p className="sr-only">{h.place}</p>
                <h3 className={styles.event}>{h.event}</h3>
                {h.detail && <p className={styles.detail}>{h.detail}</p>}
                <p className={styles.project}>{h.project}</p>
                <p className={styles.text}>{h.text}</p>
                {h.repoUrl && (
                  <div className={styles.linkRow}>
                    <ExternalLink
                      href={h.repoUrl}
                      context={h.project}
                      className={styles.link}
                    >
                      Code
                    </ExternalLink>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hackathons;
