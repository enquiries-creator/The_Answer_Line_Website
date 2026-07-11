# The Answer Line — website

Marketing site for **The Answer Line** (theanswerline.kiwi) — an after-hours
phone-answering and job-capture service for NZ trade and service businesses.
Every call gets answered, the job details get captured, and the tradie gets a
text.

**Live:** https://theanswerline.vercel.app

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home — hero, how it works, benefits, "is this a robot?" honesty section, testimonials, final CTA |
| `/case-study` | Before/after story of a plumber who stopped losing calls |
| `/about` | Why the business exists |
| `/contact` | Free-demo request form |

## Stack

- [Next.js](https://nextjs.org) (App Router, all pages static)
- [Tailwind CSS](https://tailwindcss.com) v4
- TypeScript
- Deployed on [Vercel](https://vercel.com)

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy

```bash
npm run build      # sanity-check the build
vercel --prod      # deploy to production
```

## Notes

- ⚠️ **Placeholder content**: the demo phone number (09 886 0125), the
  testimonials, and the case-study figures are example data awaiting real
  ones. Swap them before pointing the real domain at this site.
- Logo assets live in `public/` (true-transparent versions generated from the
  brand exports). Favicons are `app/icon.png` / `app/apple-icon.png`.
- The hero (`components/ui/hero-landing-page.tsx`) accepts an optional
  `videoSrc` prop for a background video; without it, it renders an animated
  CSS background.
