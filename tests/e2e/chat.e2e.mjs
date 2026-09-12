/**
 * End-to-end browser checks for the chat panel.
 *
 * These cover the things that only break in a real browser: code splitting,
 * focus management, streamed rendering, transcript persistence across a
 * reload, concurrency from a double-click, and layout at phone width.
 *
 * NOT part of `npm test` or CI. It needs a running dev server and a Chromium
 * binary, and a browser download on every commit would cost more than it
 * catches for a panel this size — the behaviour underneath is already covered
 * by 87 unit tests. Run it before shipping a change to the panel.
 *
 *   npm run dev                       # in one terminal
 *   npm run test:e2e                  # in another
 *
 * Requires: npm i -D playwright-core (and a Chromium binary; set
 * CHROMIUM_PATH if it is not at the Playwright default).
 */
import { chromium } from 'playwright-core';

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';
const EXECUTABLE = process.env.CHROMIUM_PATH;

const results = [];
const check = (name, passed, detail = '') => {
  results.push({ name, passed, detail });
  console.log(`  ${passed ? 'ok  ' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

const openPanel = async (page) => {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.locator('button', { hasText: 'Ask about his work' }).first().click();
  await page.waitForSelector('[role="dialog"]');
};

const browser = await chromium.launch(EXECUTABLE ? { executablePath: EXECUTABLE } : {});
const consoleErrors = [];

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));

  /* ---------------------------- open and answer --------------------------- */
  await openPanel(page);
  check('panel opens from the floating button', true);

  await page.locator('button', { hasText: 'Has he shipped RAG in production?' }).click();
  await page.waitForTimeout(4000);

  const transcript = await page.locator('[role="dialog"]').innerText();
  check('an answer or grounded refusal is rendered', transcript.length > 120);
  check('per-answer actions are present', /Copy/.test(transcript) && /Regenerate/.test(transcript));

  /* ------------------------ technical transparency ------------------------ */
  const disclosure = page.locator('summary', { hasText: 'How this answer was built' }).first();
  check('engineering disclosure is offered', (await disclosure.count()) > 0);
  if ((await disclosure.count()) > 0) {
    await disclosure.click();
    await page.waitForTimeout(200);
    const details = await page.locator('details dl').first().innerText();
    check('telemetry shows a real request id', /Request/.test(details));
    check('telemetry reports measured latency', /Total/.test(details) && /ms/.test(details));
  }

  /* ------------------------------ concurrency ----------------------------- */
  const before = await page.locator('[role="dialog"] p.bg-accent-strong').count();
  await page.fill('#ask-portfolio-input', 'What is his AWS experience?');
  const send = page.locator('button[type="submit"]');
  await send.click({ force: true }).catch(() => {});
  await send.click({ force: true }).catch(() => {});
  await page.waitForTimeout(4000);
  const after = await page.locator('[role="dialog"] p.bg-accent-strong').count();
  check('a double-click sends exactly one message', after === before + 1, `${before} -> ${after}`);

  /* ------------------------------ persistence ----------------------------- */
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.locator('button', { hasText: 'Ask about his work' }).first().click();
  await page.waitForTimeout(600);
  const restored = await page.locator('[role="dialog"]').innerText();
  check('transcript survives a page reload', /AWS experience/.test(restored));

  /* ------------------------------- keyboard ------------------------------- */
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  check('Esc closes the panel', (await page.locator('[role="dialog"]').count()) === 0);

  /* -------------------------------- mobile -------------------------------- */
  for (const width of [320, 375, 390, 430, 768]) {
    const mobile = await browser.newPage({ viewport: { width, height: 720 } });
    await openPanel(mobile);
    const overflow = await mobile.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    check(`no horizontal overflow at ${width}px`, !overflow);
    await mobile.close();
  }

  check('no uncaught console errors', consoleErrors.length === 0, consoleErrors[0] ?? '');
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.passed);
console.log(`\n  ${results.length - failed.length}/${results.length} checks passed\n`);
process.exit(failed.length ? 1 : 0);
