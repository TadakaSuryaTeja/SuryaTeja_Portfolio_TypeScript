import { chromium } from 'playwright-core';
const B = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b = await chromium.launch({ executablePath: B });
const errs = [];
const open = async (page) => {
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.locator('button', { hasText: 'Ask about his work' }).first().click();
  await page.waitForSelector('[role="dialog"]');
};

// --- desktop flow
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
await open(p);

await p.locator('button', { hasText: 'Has he shipped RAG in production?' }).click();
await p.waitForTimeout(3500);

const text = await p.locator('[role="dialog"]').innerText();
console.log('refusal rendered:', /outside what this site covers/.test(text));
console.log('engineering disclosure present:', text.includes('How this answer was built'));
console.log('copy present:', text.includes('Copy'));
console.log('regenerate present:', text.includes('Regenerate'));

// expand engineering details
await p.locator('summary', { hasText: 'How this answer was built' }).first().click();
await p.waitForTimeout(300);
const details = await p.locator('details dl').first().innerText();
console.log('--- engineering panel ---\n' + details);

// --- double send guard
await p.fill('#ask-portfolio-input', 'What is his AWS experience?');
const send = p.locator('button[type="submit"]');
await send.click({ force: true }).catch(()=>{});
await send.click({ force: true }).catch(()=>{});
await p.waitForTimeout(3500);
const userBubbles = await p.locator('[role="dialog"] p.bg-accent-strong').count();
console.log('user messages after double-click (expect 2 total):', userBubbles);

// --- persistence across reload
await p.reload({ waitUntil: 'networkidle' });
await p.waitForTimeout(600);
await p.locator('button', { hasText: 'Ask about his work' }).first().click();
await p.waitForTimeout(800);
const after = await p.locator('[role="dialog"]').innerText();
console.log('transcript restored after refresh:', after.includes('AWS experience'));

// --- keyboard: Esc closes
await p.keyboard.press('Escape');
await p.waitForTimeout(300);
console.log('esc closes:', (await p.locator('[role="dialog"]').count()) === 0);

// --- mobile
const m = await b.newPage({ viewport: { width: 320, height: 700 } });
await open(m);
const box = await m.locator('[role="dialog"]').boundingBox();
const overflow = await m.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
console.log('mobile dialog box:', JSON.stringify(box), 'horizontal overflow:', overflow);

console.log('errors:', errs.length ? errs.slice(0,5) : 'none');
await b.close();
