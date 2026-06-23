import Head from 'next/head';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 — Page not found · Tadaka Surya Teja</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/15 blur-[110px]"
          aria-hidden
        />
        <div className="relative">
          <p className="gradient-text text-7xl font-bold tracking-tightest sm:text-8xl">
            404
          </p>
          <h1 className="mt-4 text-2xl font-semibold text-ink">
            This page wandered off
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-ink-muted">
            The page you&rsquo;re looking for doesn&rsquo;t exist or may have
            moved.
          </p>
          <Link href="/" className="btn-primary mt-8">
            <Icon icon="ph:arrow-left-bold" aria-hidden /> Back to home
          </Link>
        </div>
      </main>
    </>
  );
}
