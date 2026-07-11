# Deviations from Reference (designbub.com)

Side-by-side review against `design-system/design-audit.md` after initial build.

## Intentional / Required Deviations

| Area | Reference | Implementation | Reason |
|------|-----------|----------------|--------|
| Brand name | DesignBub | **CreativHub** | Placeholder brand per project constraints |
| Copy | Original agency text | Paraphrased throughout | No verbatim copy requirement |
| Client logos | Real brand SVG/PNG assets | Text-based placeholder names in marquee | No hotlinking / proprietary assets |
| Photography | WebP hero & portfolio shots | CSS gradient placeholders | No asset scraping; local-safe placeholders |
| Testimonials | Named clients & quotes | Fictional paraphrased quotes & initials | Original content requirement |
| Contact person | Muhammad Bilal + photo | Alex Morgan + emoji avatar | Placeholder identity |
| Office phone numbers | Real numbers | Fictional placeholder numbers | Privacy / no copy of real contact data |
| Form backend | Likely server-side handler | UI stub with client-side success state | No backend requested |
| WhatsApp links | Real wa.me URLs | Links to `#contact` stub | No real messaging integration |

## Approximations (Visual / Interaction)

| Area | Notes | Estimated similarity |
|------|-------|---------------------|
| Navbar mega-menu | Full 9-column grid replicated; hover open/close (no JS bridge delay tuning) | ~92% |
| Floating nav pill | Scroll-triggered compact dark pill implemented | ~90% |
| Hero visual collage | Hidden below 1100px like reference; overlapping images approximated with gradients | ~85% |
| Portfolio mosaic | 12-column asymmetric grid at xl+; stacks on smaller screens | ~90% |
| Creative studio strip | Horizontal image marquee with mixed heights | ~88% |
| Footer wordmark | Large text watermark present; exact sizing/letter-spacing may differ slightly on edge viewports | ~87% |
| Custom cursor / Lenis scroll | Not implemented (reference uses GSAP/Lenis) | N/A — omitted for performance scope |
| Scroll progress bar | Not implemented | N/A — micro-interaction omitted |
| Rating badge in hero | Not implemented | Minor omission |
| Mobile services drawer | Simplified accordion-free drawer (reference has expandable service groups) | ~80% |

## Token Compliance

- All component colors, spacing, radii, shadows, typography, breakpoints, and animations route through `/design-system/*.json` → `tailwind.config.js`.
- Exceptions documented in global CSS utilities only:
  - Marquee mask gradients use `#000` as mask stop (not a visible color).
  - WhatsApp head radial gradient uses inline rgba for complex radial (could be tokenized in a follow-up).

## Responsive Verification

| Breakpoint | Status |
|------------|--------|
| ≤480px | Buttons stack; stats single column; brands tighten |
| ≤768px | Hamburger nav; reduced section padding; WhatsApp compact |
| ≤950px | FAQ/split single column; portfolio stacks |
| ≤1100px | Hero visual hidden; 2-column service grid |
| ≥1500px | Container max-widths applied |

## Console / Build

- `npm run build` — passes with zero TypeScript errors
- No runtime console errors observed in dev mode
- Production bundle: ~52 KB CSS / ~372 KB JS (gzip ~116 KB)

## Needs Your Input

1. **Real brand name & logo** — replace CreativHub placeholder
2. **Hero & portfolio photography** — supply licensed images or URLs
3. **Client logos** — SVG/PNG assets for marquee
4. **Contact form endpoint** — API route, Formspree, or email service
5. **WhatsApp numbers** — real regional wa.me links
6. **Team photo & name** — for contact section card
7. **Company deck PDF** — for footer download link
8. **Optional polish** — Lenis smooth scroll, custom cursor, scroll progress bar if desired

## Overall Visual Similarity Estimate

**~88–90%** static layout similarity; **~85%** interaction parity (marquee, hover, mega-menu, scroll nav state present; advanced scroll UX omitted).
