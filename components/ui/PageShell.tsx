import type { ReactNode } from 'react';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import CommandPalette from '@/components/command/CommandPaletteLoader';
import { ScrollProgress } from '@/components/motion';

/** Shared chrome for every non-home route. */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar />
      <CommandPalette />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}
