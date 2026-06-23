# Tadaka Surya Teja — Portfolio

Personal portfolio of **Tadaka Surya Teja**, Solutions Architect & Tech Lead specializing in scalable cloud platforms, Python automation, and AI/ML systems.

**Live:** https://surya-teja-tadaka.vercel.app/

## Tech stack

- **Framework:** [Next.js 13](https://nextjs.org/) (Pages Router) + TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (custom dark, glassmorphic theme)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Iconify](https://iconify.design/)
- **Fonts:** [Inter](https://rsms.me/inter/) via `next/font` (self-hosted)

## Editing content

All content lives in a single typed source of truth: **`portfolio.ts`** (profile, metrics, about, skills, experience, projects, certifications, testimonials, blog, contact, SEO). Types are in `types/sections.ts`.

```
portfolio.ts            ← all content
types/sections.ts       ← data model
lib/                    ← nav config, accent maps, social links
components/
  ui/                   ← Reveal, Section, SectionHeading
  sections/             ← Navbar, Hero, Metrics, About, Experience,
                          Projects, Skills, Certifications, Testimonials,
                          Writing, Contact, Footer
  SEO.tsx
pages/                  ← _app, _document, index
styles/globals.css      ← theme + utilities
```

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint with `next lint` |

## Personalizing

- **Headshot:** drop a square image at `public/profile.png` and set `profile.photo` in `portfolio.ts`.
- **Contact email:** set `contactInfo.email` to enable the one-click email button.
- **Testimonials / blog posts:** populate `testimonials` / `blogPosts` arrays.

## License

MIT
