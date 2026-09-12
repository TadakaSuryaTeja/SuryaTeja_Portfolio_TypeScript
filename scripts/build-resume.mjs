/**
 * Renders content/resume.mjs into ATS-safe HTML and PDF.
 *
 * ATS rules enforced by the template: single column, no tables, no icons, no
 * images, no progress bars, real selectable text, standard section headings,
 * and hyperlinks that carry their URL as visible text where it matters.
 *
 * PDF is produced with headless Chrome's print-to-pdf, which preserves the
 * text layer and embedded links. If Chrome is unavailable the HTML is still
 * written and can be printed to PDF from any browser deterministically.
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contact, education, certifications, experience, variants } from '../content/resume.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'public/resume');
const srcDir = resolve(root, 'resume-src');

const CHROME_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function render(variant) {
  const v = variants[variant];
  const jobs = experience(variant);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(contact.name)} — Résumé</title>
<style>
  @page { size: Letter; margin: 0.42in 0.5in; }
  * { box-sizing: border-box; }
  body {
    font-family: "Calibri", "Carlito", "Helvetica Neue", Arial, sans-serif;
    font-size: 9.4pt; line-height: 1.26; color: #000; margin: 0;
  }
  h1 { font-size: 17pt; margin: 0; letter-spacing: 0.4px; }
  .headline { font-size: 9.6pt; font-weight: 700; margin: 2pt 0 0; }
  .contact { font-size: 8.6pt; margin: 3pt 0 0; }
  .contact a { color: #000; text-decoration: none; }
  h2 {
    font-size: 10pt; text-transform: uppercase; letter-spacing: 0.6px;
    border-bottom: 1px solid #000; padding-bottom: 1.5pt;
    margin: 9pt 0 4.5pt;
  }
  p { margin: 0 0 4pt; }
  ul { margin: 3pt 0 0; padding-left: 15pt; }
  li { margin: 0 0 1.8pt; }
  .job { margin-bottom: 6.5pt; page-break-inside: avoid; }
  .job-head { font-weight: 700; font-size: 10pt; }
  .job-meta { font-size: 9pt; font-style: italic; margin-top: 1pt; }
  .skill-row { margin: 0 0 2.8pt; }
  .skill-row b { font-weight: 700; }
  .entry { margin-bottom: 4pt; page-break-inside: avoid; }
</style>
</head>
<body>
  <h1>${esc(contact.name)}</h1>
  <p class="headline">${esc(v.headline)}</p>
  <p class="contact">
    ${esc(contact.email)} | ${esc(contact.phone)} | ${esc(contact.location)} |
    <a href="${contact.website}">${esc(contact.website.replace(/^https?:\/\//, ''))}</a> |
    <a href="${contact.linkedin}">LinkedIn</a> |
    <a href="${contact.github}">GitHub</a>
  </p>

  <h2>Professional Summary</h2>
  <p>${esc(v.summary)}</p>

  <h2>Skills</h2>
  ${v.skills
    .map((s) => `<p class="skill-row"><b>${esc(s.label)}:</b> ${esc(s.items)}</p>`)
    .join('\n  ')}

  <h2>Professional Experience</h2>
  ${jobs
    .map(
      (j) => `<div class="job">
    <div class="job-head">${esc(j.company)} — ${esc(j.title)}</div>
    <div class="job-meta">${esc(j.location)} | ${esc(j.date)}</div>
    <ul>
      ${j.bullets.map((b) => `<li>${esc(b)}</li>`).join('\n      ')}
    </ul>
  </div>`
    )
    .join('\n  ')}

  <h2>Selected Projects</h2>
  ${v.projects
    .map(
      (p) =>
        `<div class="entry"><b>${esc(p.name)}</b><br>${esc(p.detail)}</div>`
    )
    .join('\n  ')}

  <h2>Education</h2>
  ${education
    .map(
      (e) =>
        `<div class="entry"><b>${esc(e.school)}</b> — ${esc(e.detail)} | ${esc(e.date)}</div>`
    )
    .join('\n  ')}

  <h2>Certifications</h2>
  <ul>
    ${certifications.map((c) => `<li>${esc(c)}</li>`).join('\n    ')}
  </ul>
</body>
</html>`;
}

mkdirSync(outDir, { recursive: true });
mkdirSync(srcDir, { recursive: true });

const chrome = CHROME_CANDIDATES.find((c) => existsSync(c));

for (const variant of Object.keys(variants)) {
  const { file } = variants[variant];
  const htmlPath = resolve(srcDir, `${file}.html`);
  writeFileSync(htmlPath, render(variant), 'utf8');
  console.log(`✓ HTML  ${htmlPath.replace(root + '/', '')}`);

  if (!chrome) {
    console.warn('! Chrome not found — skipping PDF. Print the HTML to PDF manually.');
    continue;
  }

  const pdfPath = resolve(outDir, `${file}.pdf`);
  execFileSync(chrome, [
    '--headless',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${pdfPath}`,
    `file://${htmlPath}`,
  ], { stdio: 'ignore' });
  console.log(`✓ PDF   ${pdfPath.replace(root + '/', '')}`);
}
