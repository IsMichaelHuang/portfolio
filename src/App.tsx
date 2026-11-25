/**
 * App — Composition Root
 *
 * Defines the top-level page structure (Hero, Experience, Hackathons,
 * Projects, About, Contact): skip link, Navbar, the single
 * <main> landmark holding all sections, then the Footer. Contains no
 * state or logic. This file is the place to add or reorder sections.
 * A section with a nav link also needs an entry in the Navbar `links`
 * array.
 */

import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import Experience from "./sections/Experience";
import Hackathons from "./sections/Hackathons";
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
        <Hackathons />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
