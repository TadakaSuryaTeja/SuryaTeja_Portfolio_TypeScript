import SEO from '@/components/SEO';
import Navbar from '@/components/sections/Navbar';
import CommandPalette from '@/components/sections/CommandPalette';
import Hero from '@/components/sections/Hero';
import TechMarquee from '@/components/sections/TechMarquee';
import Metrics from '@/components/sections/Metrics';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import CaseStudies from '@/components/sections/CaseStudies';
import Projects from '@/components/sections/Projects';
import Skills from '@/components/sections/Skills';
import Certifications from '@/components/sections/Certifications';
import Testimonials from '@/components/sections/Testimonials';
import Writing from '@/components/sections/Writing';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <SEO />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <CommandPalette />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <TechMarquee />
        <Metrics />
        <About />
        <Experience />
        <CaseStudies />
        <Projects />
        <Skills />
        <Certifications />
        <Testimonials />
        <Writing />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
