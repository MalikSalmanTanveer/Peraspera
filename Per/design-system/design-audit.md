# Design Audit — Creative Agency Landing (Reference: designbub.com)

> Single source of truth for the CreativHub rebuild. All implementation values map to `/design-system/*.json` tokens.

## Layout System

### Page Structure (top → bottom)
1. Fixed Navbar (72px main row + 44px category strip = 116px total)
2. Hero (dark, full viewport min-height)
3. Logo Marquee (dual-row infinite scroll)
4. Trust Strip (pills + supporting copy)
5. Services Grid (3×2 cards)
6. Feature Split Blocks ×2 (alternating image/text)
7. Portfolio Grid (asymmetric 12-column mosaic)
8. Process Steps (5-column dark section)
9. Why-Us Stats (2-column layout + stat cards)
10. Creative Studio (dark + horizontal image marquee)
11. Industries Grid (4 columns)
12. Tools Grid (4 columns, white bg)
13. Testimonials (horizontal auto-scroll carousel)
14. FAQ (2-column: intro + accordion)
15. Final CTA (yellow band)
16. Contact Form (warm gray bg, 2-column)
17. Footer (multi-column + wordmark + offices)
18. Floating WhatsApp widget + Back-to-top

### Containers
| Token | Width |
|-------|-------|
| `container` | 1200px |
| `container-wide` | 1440px |
| `container-cta` | 860px |
| `container-contact` | 1100px |
| `container-mega` | 1060px (min with viewport padding) |
| `container-nav-float` | 1100px |

### Section Padding Rhythm
- Default sections: `110px` vertical, `48px` horizontal
- Mobile sections: `76px` vertical, `20px` horizontal
- Brands marquee: `128px / 112px` vertical (desktop), scales down at breakpoints
- Hero: `170px` top (clears nav), `100px` bottom

### Grid Patterns
- Hero: `1.06fr / 0.94fr` two-column, align end
- Services: 3 equal columns, 24px gap
- Split features: 1fr / 1fr, 70px gap, 100px row spacing
- Portfolio: 12-column CSS grid, auto-rows 260px, 18px gap
- Process: 5 equal columns in bordered container
- FAQ: 420px fixed left + fluid right, 70px gap
- Footer top: multi-column grid (brand + 3 link columns)

---

## Typography

### Font Families
| Role | Family | Google Font |
|------|--------|-------------|
| Display / Headings | Plus Jakarta Sans | `family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800` |
| Body / UI | DM Sans | `family=DM+Sans:opsz,wght@9..40,300;400;500` |

### Type Scale
| Element | Size | Weight | Line-height | Letter-spacing |
|---------|------|--------|-------------|----------------|
| H1 (hero) | clamp(46px, 6.7vw, 94px) | 800 | 0.95 | -0.045em |
| H2 (section) | clamp(34px, 4.8vw, 58px) | 800 | 1.06 | -0.025em |
| H3 (card) | 25px | 800 | default | default |
| H3 (portfolio) | 26px | 800 | default | default |
| Body | 16px | 400 | 1.75 | default |
| Hero body | 18px | 300 | 1.78 | default |
| Nav links | 14px | 400–500 | default | default |
| Kicker / Label | 11px | 800 | default | 0.14em, uppercase |
| Buttons | 15px | 700 | default | default |
| Stats number | 40px | 800 | 1 | default |
| Marquee title | 17px | 800 | 1.35 | 3.8px, uppercase |

---

## Color Palette

### Core
| Token | Hex | Usage |
|-------|-----|-------|
| `ink` | `#0D0D0D` | Primary text, dark sections, buttons |
| `paper` | `#F7F7F7` | Page background |
| `white` | `#FFFFFF` | Cards, mega menu |
| `accent` | `#F5E50A` | Primary yellow accent |
| `accent-dark` | `#C9BC00` | Category underline, emphasis |
| `accent-gold` | `#9A7C00` | Card category labels, stat numbers |
| `muted` | `#626262` | Secondary text |
| `border` | `#E0E0E0` | Card borders, dividers |
| `contact-bg` | `#F0F0EC` | Contact section background |
| `nav-warm` | `#F5F2EB` | Navbar warm tint base |

### Dark Theme
- Hero, process, innov, footer: `#0D0D0D` base
- Elevated cards on dark: `#111111`
- Image placeholders: `#1A1A1A`

### Gradients
- Hero orbs: yellow `#F5E50A` at 16% opacity, white at 5.5%
- Hero grid: white lines at 4.5% opacity, 60px grid
- Split image overlay: `linear-gradient(to top, rgba(13,13,13,0.4), transparent)`
- Portfolio overlay: `linear-gradient(to top, rgba(13,13,13,0.92), rgba(13,13,13,0.1))`
- Mega left panel: `#FEFCE8 → #FFFbeb → #FEF9E7`
- WhatsApp panel: `#080808 → #111 → #292700`

---

## Components Inventory

### Navbar
- Fixed top, warm glass background with blur
- Logo (display font, accent on suffix)
- Center links: Services (mega), Work, About, Pricing, FAQ
- Right: Client Login (ghost), Get Started (solid pill)
- Category strip below main row (9 service shortcuts)
- **Scrolled state**: collapses to floating dark pill (72px, rounded 100px, max 1100px centered)
- **Mega menu**: fixed dropdown, left promo panel + 3×3 service grid, bottom popular pills
- **Mobile**: hamburger → full-screen drawer with accordion services

### Hero
- Dark bg with grid + blurred orbs
- Kicker pill with yellow dot
- H1 with italic-styled accent word (em → yellow)
- Dual CTAs: yellow solid + light outline
- 4-column stat strip with top border
- Right visual: overlapping rounded images + floating glass card

### Logo Marquee
- Two rows, opposite scroll directions
- Edge fade mask (13% transparent → opaque)
- Pause on hover

### Service Cards
- White card, 28px radius, image top (220px), category tag, title, description, link

### Feature Split
- Alternating image/text rows on white bg
- Checklist with yellow circle checkmarks
- Dark CTA button with yellow hover

### Portfolio
- Asymmetric grid: 7+2 span hero item, varied spans
- Hover lift + image scale
- Gradient overlay with category + title

### Process Steps
- 5 steps in single bordered row on `#111` cells
- Number in accent, title in display font

### Why-Us
- Light section, 2×2 stat cards with gold numbers
- Optional image gallery grid

### Testimonials
- Infinite horizontal scroll of 360px cards
- 5 stars in accent, avatar circle, name/role

### FAQ
- Left: heading + description
- Right: bordered accordion list, one open at a time

### Contact Form
- Left: heading, description, person card
- Right: white form box with underline inputs, custom dropdowns, full-width submit

### Footer
- Dark multi-column: brand, services, quick links, reviews
- Giant wordmark text spanning width
- Office locations grid
- Bottom bar: PDF link, social icons, copyright

### Floating Widgets
- WhatsApp: dark pill trigger, expandable country panel
- Back-to-top: left side, appears after scroll

---

## Animations & Interactions

| Interaction | Behavior |
|-------------|----------|
| Scroll reveal | opacity 0 → 1, translateY(28px) → 0, 700ms ease |
| Card hover | translateY(-7px), shadow deepen, image scale 1.08 |
| Button hover | translateY(-2px), color/bg swap |
| Marquee | CSS infinite translate, pause on hover |
| Mega menu | opacity + scale + translateY, 280ms cubic-bezier |
| Nav float | height 116→72, bg warm→dark pill, category strip hide |
| FAQ | accordion expand/collapse |
| WhatsApp panel | scale(0.96) + translateY fade in |

---

## Imagery Style

- Rounded corners: 28–30px for large images, 18–22px for smaller
- Object-fit cover, dark `#111` fallbacks
- Overlapping hero composition with border `rgba(255,255,255,0.12)`
- Emoji-style glyphs in nav/mega menu (not icon font)
- Client logos: grayscale/contain in marquee, ~172×64px slots

---

## Responsive Behavior

| Breakpoint | Key Changes |
|------------|---------------|
| ≤1500px | Brands spacing slightly reduced |
| ≤1180px | Hero actions may wrap |
| ≤1100px | Hero single column, visual hidden; grids → 2 col |
| ≤950px | Split/FAQ/case → 1 col; portfolio → single column stack |
| ≤900px | Contact → 1 col; innov header → 1 col |
| ≤768px | Nav hamburger; category strip hidden; section padding reduced; mega → drawer |
| ≤480px | Stats 1 col; buttons full width; brands tighter |

---

## Notes for Implementation

- Placeholder brand: **CreativHub** (`creativ` + accent `hub`)
- All copy paraphrased; no client logos from reference
- Placeholder imagery via CSS gradients / local SVG patterns
- Form is UI-only stub (no backend)
