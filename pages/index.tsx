import type { GetStaticProps } from 'next';
import SEO from '@/components/SEO';
import Navbar from '@/components/sections/Navbar';
import CommandPalette from '@/components/command/CommandPaletteLoader';
import ViewModeController from '@/components/recruiter/ViewModeController';
import RecruiterSummary from '@/components/recruiter/RecruiterSummary';
import Hero from '@/components/sections/Hero';
import TechMarquee from '@/components/sections/TechMarquee';
import Metrics from '@/components/sections/Metrics';
import ValueProposition from '@/components/sections/ValueProposition';
import Systems from '@/components/projects/Systems';
import ArchitectureSection from '@/components/architecture/ArchitectureSection';
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills';
import Ownership from '@/components/sections/Ownership';
import About from '@/components/sections/About';
import Certifications from '@/components/sections/Certifications';
import Testimonials from '@/components/sections/Testimonials';
import OpenSource from '@/components/sections/OpenSource';
import Writing from '@/components/sections/Writing';
import Resume from '@/components/sections/Resume';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';
import { ScrollProgress } from '@/components/motion';
import { getArticles } from '@/lib/cms/notion';
import { getFeaturedRepos, type GitHubRepo } from '@/lib/cms/github';
import { openSource } from '@/portfolio';
import type { BlogPostType } from '@/types/sections';

type HomeProps = { articles: BlogPostType[]; repos: GitHubRepo[] };

/**
 * The homepage is a single argument told in order:
 * who → why this background → proof → how I think → where I've done it →
 * what I know → evidence → how to reach me.
 */
export default function Home({ articles, repos }: HomeProps) {
  return (
    <>
      <SEO />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollProgress />
      <ViewModeController />
      <Navbar />
      <CommandPalette />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <RecruiterSummary />
        <Hero />
        <TechMarquee />
        <Metrics />
        <ValueProposition />
        <Systems />
        <ArchitectureSection />
        <Experience />
        <Skills />
        <Ownership />
        <About />
        <Certifications />
        <Testimonials />
        <OpenSource repos={repos} />
        <Writing posts={articles} />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

/**
 * Content is fetched at build time and revalidated hourly. Both sources are
 * failure-tolerant by design: Notion or GitHub being down yields empty arrays,
 * and the components fall back to local content — the homepage never breaks
 * because an external API is unavailable.
 */
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const [articles, repos] = await Promise.all([
    getArticles(),
    getFeaturedRepos(openSource.githubUserName),
  ]);

  return {
    props: { articles, repos },
    revalidate: 3600,
  };
};
