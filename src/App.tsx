/**
 * App — Composition Root
 *
 * Defines the top-level page structure by stacking the Navbar,
 * all sections, and the Footer in order. Contains no state or logic;
 * adding or reordering sections means editing only this file.
 *
 * Wrapped in a React Fragment (<>) to avoid injecting an extra
 * DOM node — the sections themselves provide their own containers.
 */

import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Contact from "./sections/Contact";

function App() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Contact />
    </>
  );
}

export default App;
