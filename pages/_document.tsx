import { Html, Head, Main, NextScript } from 'next/document';

// Runs before first paint to apply the saved theme (no flash of wrong theme).
const themeScript = `(function(){try{if(localStorage.getItem('theme')==='light'){document.documentElement.classList.add('light')}}catch(e){}})();`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="manifest" href="/manifest.json" />
        {/* Reveal scroll-animated content if JavaScript is disabled */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-css-tags */}
          <style
            dangerouslySetInnerHTML={{
              __html:
                '[style*="opacity:0"],.reveal{opacity:1!important;transform:none!important}',
            }}
          />
        </noscript>
      </Head>
      <body className="bg-base text-ink">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
