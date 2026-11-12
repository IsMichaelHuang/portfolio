/**
 * Projects Section
 *
 * Tells the story in three blocks, all in the 880px section column:
 * Hackathons (lede, takeaway, three entries marked 2nd), the
 * featured projects as resume-style ledger rows (title, metadata,
 * highlights, Code link), then "Also on GitHub": the generated
 * pins minus any already shown above (see lib/pins.ts). The last
 * block, heading included, is absent when no pins remain.
 *
 * Data flows one way: data/work.ts and data/projects.ts → here.
 * Heading levels: h2 section, h3 block or project, h4 event or card.
 */

import { projects } from "../data/projects";
import { featured, hackathons } from "../data/work";
import { remainingPins } from "../lib/pins";
import { renderEmphasis } from "../lib/emphasis";
import styles from "./Projects.module.css";
import ExternalLink from "../components/ExternalLink";

const featuredUrls = [...featured, ...hackathons].flatMap((w) =>
  w.repoUrl ? [w.repoUrl] : [],
);

function Projects() {
  const pins = remainingPins(projects, featuredUrls);
  return (
    <section id="projects">
      <h2>Projects</h2>
      <div className={styles.column}>
        <h3 className={styles.blockHeading}>Hackathons</h3>
        <p className={styles.lede}>Second place at three hackathons.</p>
        <p className={styles.takeaway}>
          My biggest lesson from these hackathons so far: clarity wins.
          Simple idea, strong execution, clear story.
        </p>
        <div className={styles.hackathons}>
          {hackathons.map((h) => (
            <article key={h.id} className={styles.hackathon}>
              <p className={styles.place}>{h.place}</p>
              <h4 className={styles.event}>{h.event}</h4>
              {h.detail && <p className={styles.detail}>{h.detail}</p>}
              <p className={styles.project}>{h.project}</p>
              <p className={styles.text}>{h.text}</p>
              {h.repoUrl && (
                <ExternalLink
                  href={h.repoUrl}
                  context={h.project}
                  className={styles.link}
                >
                  Code
                </ExternalLink>
              )}
            </article>
          ))}
        </div>

        <div className={styles.featured}>
          {featured.map((f) => (
            <article key={f.id} className={styles.row}>
              <h3 className={styles.title}>{f.title}</h3>
              <div className={styles.meta}>
                {f.period && (
                  <span className={styles.period}>{f.period}</span>
                )}
                <ul className={styles.stack}>
                  {f.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <ul className={styles.highlights}>
                {f.highlights.map((item, i) => (
                  <li key={i} className={styles.highlight}>
                    {renderEmphasis(item)}
                  </li>
                ))}
              </ul>
              {f.repoUrl && (
                <ExternalLink
                  href={f.repoUrl}
                  context={f.title}
                  className={styles.link}
                >
                  Code
                </ExternalLink>
              )}
            </article>
          ))}
        </div>

        {pins.length > 0 && (
          <div id="pinned" className={styles.pinned}>
            <h3 className={styles.blockHeading}>Also on GitHub</h3>
            <div className={styles.grid}>
              {pins.map((project) => (
                <div key={project.id} className={styles.card}>
                  <h4 className={styles.cardTitle}>{project.title}</h4>
                  {project.description && (
                    <p className={styles.description}>
                      {project.description}
                    </p>
                  )}
                  <div className={styles.tags}>
                    {project.tags.map((tag) => (
                      <span key={tag} data-pill className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className={styles.links}>
                    {project.repoUrl && (
                      <ExternalLink
                        href={project.repoUrl}
                        context={project.title}
                        className={styles.link}
                      >
                        Code
                      </ExternalLink>
                    )}
                    {project.liveUrl && (
                      <ExternalLink
                        href={project.liveUrl}
                        context={project.title}
                        className={styles.link}
                      >
                        Live
                      </ExternalLink>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Projects;
