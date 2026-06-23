// Generates public/og.png — the social-share card. Run: node scripts/generate-og.mjs
import sharp from 'sharp';

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3B82F6"/>
      <stop offset="1" stop-color="#8B5CF6"/>
    </linearGradient>
    <radialGradient id="glow" cx="78%" cy="6%" r="62%">
      <stop offset="0" stop-color="#3B82F6" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#3B82F6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="6%" cy="96%" r="55%">
      <stop offset="0" stop-color="#8B5CF6" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#8B5CF6" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0B0D10"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>
  <rect x="0.5" y="0.5" width="1199" height="629" fill="none" stroke="#ffffff" stroke-opacity="0.06"/>

  <rect x="80" y="78" width="84" height="84" rx="22" fill="url(#brand)"/>
  <text x="122" y="135" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="700" fill="#ffffff" text-anchor="middle">ST</text>

  <text x="80" y="318" font-family="Arial, Helvetica, sans-serif" font-size="78" font-weight="700" fill="#F5F7FA">Tadaka Surya Teja</text>
  <text x="80" y="382" font-family="Arial, Helvetica, sans-serif" font-size="37" font-weight="600" fill="url(#brand)">Forward Deployed Engineer &#183; Cloud &amp; AI/ML</text>

  <rect x="80" y="446" width="132" height="4" rx="2" fill="url(#brand)"/>
  <text x="80" y="512" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="500" fill="#9AA4B2">$100K+ cloud saved&#160;&#160;&#160;&#183;&#160;&#160;&#160;80% fewer errors&#160;&#160;&#160;&#183;&#160;&#160;&#160;AWS Certified&#160;&#160;&#160;&#183;&#160;&#160;&#160;Kaggle Expert</text>

  <text x="80" y="566" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="500" fill="#828B99">surya-teja-tadaka.vercel.app</text>
</svg>
`;

await sharp(Buffer.from(svg), { density: 144 })
  .png()
  .toFile('public/og.png');

console.log('✓ public/og.png generated (1200x630)');
