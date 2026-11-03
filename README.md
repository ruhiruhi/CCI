# Conscious Cinema Initiative (CCI)

> Cinema has the power to change society.

A premium, cinematic digital experience for the Conscious Cinema Initiative — a national movement that carries film into villages, schools and communities to build awareness, empathy and action.

This is **not** a typical NGO website. Every screen is designed to feel like a chapter of a documentary: bold, emotional, editorial, immersive and human.

---

## ✦ Highlights

- **Immersive, full-screen hero** with slow ambient motion and a scroll cue.
- **Story-first homepage** built as 12 cinematic "scenes" rather than generic sections.
- **Bespoke motion system** — soft scroll reveals, line-by-line text masks, subtle parallax, animated counters, magnetic buttons, an animated scroll-progress bar and elegant page transitions.
- **Custom cursor** (dot + trailing ring) on fine-pointer devices, with a one-time cinematic preloader.
- **Luxury dark theme** — deep black, charcoal, warm white and soft gold. No NGO blue, no bright gradients.
- **Editorial layouts** — alternating compositions, large photography, floating typography and generous whitespace.
- **Immersive gallery** with category filters, masonry layout, hover reveals and a full keyboard-navigable lightbox.
- **Interactive presence map**, animated impact statistics, events carousel, vertical timeline, testimonials slider, and an accordion-based Film Literacy curriculum.
- **Accessible & responsive** — semantic markup, focus states, `prefers-reduced-motion` support, and mobile-first layouts.
- **SEO-ready** — rich metadata, Open Graph, sitemap and robots routes.

## ✦ Tech Stack

- **Next.js 16** (App Router) — successor to Next 15, used here as the latest stable release
- **TypeScript**
- **Tailwind CSS v4** (CSS-first design tokens)
- **Framer Motion** for all motion design
- **shadcn-style** UI primitives (`Button`, `cn`, CVA variants)
- **Lucide** icons
- Imagery via **Unsplash** (documentary-style, configured in `next.config.ts`)

## ✦ Pages

| Route | Purpose |
| --- | --- |
| `/` | Immersive homepage — the full 12-scene narrative |
| `/about` | Mission, vision, values, journey timeline & leadership |
| `/our-work` | Projects presented as documentary episodes |
| `/film-literacy-hub` | The film-literacy programme & curriculum |
| `/gallery` | Immersive, filterable gallery with lightbox |
| `/activities` | Upcoming screenings, workshops & full schedule |
| `/community` | Volunteers, mentors, partners & presence map |
| `/support` | Stories-first giving, with tangible support tiers |
| `/contact` | Interactive contact form |
| `/newsletter` | Subscribe to the field dispatch |

## ✦ Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

## ✦ Project Structure

```
src/
  app/                  # routes (App Router) + layout, template, sitemap, robots, 404
  components/
    chrome/             # cursor, preloader, navbar, footer, scroll progress
    motion/             # reveal primitives, parallax image, counter, magnetic
    sections/           # reusable scenes (pillars, timeline, stats, events, etc.)
    home/               # homepage-only narrative scenes
    gallery/            # gallery client (filters + lightbox)
    film-hub/           # curriculum accordion
    community/          # interactive presence map
    contact/            # contact form
    newsletter/         # subscribe form
    ui/                 # shadcn-style primitives (button, slot)
  lib/
    data.ts             # all content + verified image library
    utils.ts            # cn() helper
```

## ✦ Notes

- All copy and imagery are **illustrative placeholders** crafted to demonstrate the experience. Swap real content, photography, links and form handlers before launch.
- Images are loaded from Unsplash for the demo. For production, host optimized assets locally and update `IMAGES`/`next.config.ts`.
- Form submissions (`/contact`, `/newsletter`) are front-end only — wire them to your backend or an email/CRM service.

---

Crafted as a movement, not a website. Stories belong to everyone.
