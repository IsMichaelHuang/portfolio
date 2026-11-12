/**
 * App — Composition Root
 *
 * Defines the top-level page structure (Hero, Experience, Projects,
 * About, Contact): skip link, Navbar, the single
 * <main> landmark holding all sections, then the Footer. Contains no
 * state or logic; adding or reordering sections means editing only
 * this file.
 *
 * Wrapped in a React Fragment (<>) to avoid injecting an extra
 * DOM node — the sections themselves provide their own containers.
 */

import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import About from "./sections/About";
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
        <Experience />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
