import type { GetStaticProps } from 'next';
import SEO from '@/components/SEO';
import Navbar from '@/components/sections/Navbar';
import CommandPalette from '@/components/sections/CommandPalette';
import RecruiterMode from '@/components/sections/RecruiterMode';
import Hero from '@/components/sections/Hero';
import TechMarquee from '@/components/sections/TechMarquee';
import Metrics from '@/components/sections/Metrics';
import About from '@/components/sections/About';
import Ownership from '@/components/sections/Ownership';
import Experience from '@/components/sections/Experience';
import CaseStudies from '@/components/sections/CaseStudies';
import Projects from '@/components/sections/Projects';
import AILab from '@/components/sections/AILab';
import Skills from '@/components/sections/Skills';
import Certifications from '@/components/sections/Certifications';
import Testimonials from '@/components/sections/Testimonials';
import Writing from '@/components/sections/Writing';
import Resume from '@/components/sections/Resume';
import Contact from '@/components/sections/Contact';
import OpenSource from '@/components/sections/OpenSource';
import Footer from '@/components/sections/Footer';
import { getArticles } from '@/lib/cms/notion';
import { getFeaturedRepos, type GitHubRepo } from '@/lib/cms/github';
import { openSource } from '@/portfolio';
import type { BlogPostType } from '@/types/sections';

type HomeProps = { articles: BlogPostType[]; repos: GitHubRepo[] };

export default function Home({ articles, repos }: HomeProps) {
  return (
    <>
      <SEO />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <CommandPalette />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <RecruiterMode />
        <Hero />
        <TechMarquee />
        <Metrics />
        <About />
        <Ownership />
        <Experience />
        <CaseStudies />
        <Projects />
        <AILab />
        <Skills />
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
