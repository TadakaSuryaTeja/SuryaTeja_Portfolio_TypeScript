import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';

export const config = { runtime: 'edge' };

/**
 * Dynamic social cards.
 *
 * /api/og?title=…&subtitle=…&tech=…
 *
 * Deliberately text-only and font-stack based: no remote fonts or images to
 * fetch, so a card renders fast and cannot fail because an asset is missing.
 * The static `/og.png` remains the homepage card.
 */
export default function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title') ?? 'Surya Teja Tadaka').slice(0, 90);
  const subtitle = (searchParams.get('subtitle') ?? 'Enterprise AI & Agentic Systems').slice(0, 120);
  const tech = (searchParams.get('tech') ?? 'GenAI · RAG · MCP · Python · AWS').slice(0, 140);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0B0D10',
          padding: '72px 80px',
          fontFamily: 'Helvetica, Arial, sans-serif',
        }}
      >
        {/* Brand mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            ST
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#F5F7FA', fontSize: 24, fontWeight: 600 }}>
              Surya Teja Tadaka
            </span>
            <span style={{ color: '#828B99', fontSize: 18 }}>
              Enterprise AI &amp; Agentic Systems
            </span>
          </div>
        </div>

        {/* Title block */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              color: '#F5F7FA',
              fontSize: title.length > 46 ? 58 : 70,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </span>
          <span style={{ color: '#3B82F6', fontSize: 30, fontWeight: 600, marginTop: 22 }}>
            {subtitle}
          </span>
        </div>

        {/* Footer rule + tech */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              width: 132,
              height: 4,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
            }}
          />
          <span style={{ color: '#9AA4B2', fontSize: 24, marginTop: 24 }}>{tech}</span>
          <span style={{ color: '#5C6675', fontSize: 20, marginTop: 12 }}>
            surya-teja-tadaka.vercel.app
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
