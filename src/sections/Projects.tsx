/**
 * Projects Section
 *
 * Displays all projects from the data layer in a responsive grid.
 * Each project is rendered inline for now — this markup will be
 * extracted into a reusable ProjectCard component in a later step.
 *
 * Data flows one direction: data/projects.ts → this section.
 * Adding a new project to the data array automatically renders
 * a new card here with no further changes.
 */

import { projects } from "../data/projects";
import styles from "./Projects.module.css";
import ExternalLink from "../components/ExternalLink";

function Projects() {
  return (
    <section id="projects">
      <h2>Projects</h2>
      <div className={styles.grid}>
        {projects.map((project) => (
          <div key={project.id} className={styles.card}>
            <h3 className={styles.title}>{project.title}</h3>
            {project.description && (
              <p className={styles.description}>{project.description}</p>
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
    </section>
  );
}

export default Projects;
