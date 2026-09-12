import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { MotionConfig } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MotionConfig reducedMotion="user">
      <div className={`${inter.variable} font-sans`}>
        <Component {...pageProps} />
        {/* Vercel injects these scripts only in production; mounting them in
            development just logs 404s for scripts that cannot exist there. */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </div>
    </MotionConfig>
  );
}
