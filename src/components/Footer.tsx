/**
 * Footer
 *
 * Page-level <footer> (the contentinfo landmark), rendered after
 * <main>. Credits the stack and links the source repository.
 */

import styles from "./Footer.module.css";
import ExternalLink from "./ExternalLink";

function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        Built by Michael Huang with React, TypeScript, and Vite.
      </p>
      <p className={styles.text}>
        <ExternalLink
          href="https://github.com/IsMichaelHuang/portfolio"
          className={styles.link}
        >
          Source on GitHub
        </ExternalLink>
      </p>
    </footer>
  );
}

export default Footer;
