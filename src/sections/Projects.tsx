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

function Projects() {
  return (
    <section id="projects">
      <h2>Projects</h2>
      <div className={styles.grid}>
        {projects.map((project) => (
          <div key={project.id} className={styles.card}>
            <h3 className={styles.title}>{project.title}</h3>
            <p className={styles.description}>{project.description}</p>
            <div className={styles.tags}>
              {project.tags.map((tag) => (
                <span key={tag} data-pill className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className={styles.links}>
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Code
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Live
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
