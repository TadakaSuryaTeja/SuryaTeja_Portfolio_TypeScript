// Generates public/favicon.png — branded "ST" monogram. Run: node scripts/generate-favicon.mjs
import sharp from 'sharp';

const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3B82F6"/>
      <stop offset="1" stop-color="#8B5CF6"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="116" fill="url(#g)"/>
  <text x="256" y="342" font-family="Arial, Helvetica, sans-serif" font-size="232" font-weight="700" fill="#ffffff" text-anchor="middle">ST</text>
</svg>
`;

await sharp(Buffer.from(svg), { density: 144 })
  .resize(512, 512)
  .png()
  .toFile('public/favicon.png');

console.log('✓ public/favicon.png generated (512x512)');
