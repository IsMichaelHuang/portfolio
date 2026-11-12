/**
 * App — Composition Root
 *
 * Defines the top-level page structure: skip link, Navbar, the single
 * <main> landmark holding all sections, then the Footer. Contains no
 * state or logic; adding or reordering sections means editing only
 * this file.
 *
 * Wrapped in a React Fragment (<>) to avoid injecting an extra
 * DOM node — the sections themselves provide their own containers.
 */

import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Contact from "./sections/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
