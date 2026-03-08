/**
 * Contact Section
 *
 * Closing section that invites visitors to get in touch.
 * Provides a direct email link and repeats key profile links
 * (GitHub, LinkedIn) so visitors don't have to scroll back to Hero.
 *
 * No data file — content is singular and static. Uses a mailto:
 * link for email, which opens the user's default mail client.
 */

import styles from "./Contact.module.css";

function Contact() {
  return (
    <section id="contact" className={styles.section}>
      <h2 className={styles.heading}>Get In Touch</h2>
      {/* heading className overrides global section > h2 margin for tighter spacing */}
      <p className={styles.message}>
        I'm currently open to new opportunities. Whether you have a question
        or just want to connect, feel free to reach out.
      </p>
      {/*
       * mailto: link opens the visitor's default email client.
       * No target="_blank" needed — the OS handles mail client routing.
       */}
      <a href="mailto:michael.micah.huang@gmail.com" className={styles.emailLink}>
        Email
      </a>
      <div className={styles.links}>
        <a
          href="https://github.com/IsMichaelHuang"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/michael-micah-huang/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}

export default Contact;
