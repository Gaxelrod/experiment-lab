# Experiment Lab — Design Spec

**Date:** 2026-03-19
**Status:** Approved
**Author:** Garrett + Claude

## Overview

A static Astro site that serves as a read-only showcase for UI/UX experiment concepts developed collaboratively in Claude Code. Markdown files are the source of truth. Styled to EPCVIP brand guidelines.

The site is a solo tool — no auth, no multi-user features, no admin interface. It is the canonical reference for experiment concepts, shown directly to devs, QA, and stakeholders.

## Workflow

1. User brings a test idea to Claude Code (terminal)
2. Claude helps develop it into a structured concept through conversation
3. Claude writes a `.md` file to `src/content/concepts/`
4. User builds/deploys — concept appears on the site

## Pages

### Dashboard (index)

- Status swimlanes group concepts by lifecycle stage, displayed in this order: **Draft**, **Ready**, **Running**, **Complete**, **Killed**
- Within each swimlane, cards are sorted by `updated` date (most recent first)
- Each swimlane shows a horizontal row of concept cards
- Cards display: title, hypothesis (truncated to 80 characters at nearest word boundary with ellipsis), tags
- Complete cards show the `outcome` field inline if present (e.g., "+22% recovery rate")
- Swimlanes with zero concepts are hidden entirely
- Filter tabs across the top to show all or a single status. Filtering works via page navigation: `/` shows all, `/status/ready` shows only ready, etc. Each filter view is a pre-rendered static page.
- Click any card to navigate to detail page

### Detail Page (`/concepts/[slug]`)

- Back link to dashboard
- Header: status badge, priority badge, title (Montserrat 700), date and tag metadata
- **Hypothesis block** — visually prominent with yellow left border
- **Variants** — displayed side-by-side as cards on desktop, stacked vertically on mobile. Control is neutral, variant(s) highlighted with yellow border
- **Success Metrics** — list with metric name, target value, and primary indicator badge
- **Guardrails** — list with warning icons, separate from success metrics
- **Context metadata** — footer strip showing optional fields (audience, duration, traffic split, platform)
- **Markdown body** — rendered below structured fields. Suggested sections: Background, Implementation Notes, Results

## Content Model

Each experiment is a single `.md` file in `src/content/concepts/`. Filename becomes the URL slug.

### Frontmatter Schema

```yaml
title: string              # required — experiment name
status: enum               # required — draft | ready | running | complete | killed
created: date              # required
updated: date              # required
tags: string[]             # required — freeform tags for filtering/grouping
priority: enum             # optional — high | medium | low

hypothesis: string         # required — the core test hypothesis

variants:                  # required — at least 2
  - name: string
    description: string

successMetrics:            # required — at least 1
  - name: string
    target: string
    isPrimary: boolean     # exactly one should be true

guardrails: string[]       # optional — "don't break this" constraints
outcome: string            # optional — short result summary shown on dashboard card (e.g., "+22% conversion")

# Optional context fields
targetAudience: string
duration: string
trafficSplit: string
platform: string
```

### Markdown Body

Freeform markdown. Suggested headings:

- `## Background` — what observation or data triggered the idea
- `## Implementation Notes` — technical details for devs (components, APIs, etc.)
- `## Results` — filled in after the test completes

These are suggestions, not enforced. Write what's useful for each experiment.

### Example File

```markdown
---
title: "Simplified Checkout Flow"
status: "ready"
created: 2026-03-15
updated: 2026-03-19
tags: ["checkout", "conversion", "mobile"]
priority: "high"
hypothesis: "Reducing checkout from 3 steps to 1 will increase completion rate by 15%"
variants:
  - name: "Control"
    description: "Current 3-step checkout flow"
  - name: "Single Page"
    description: "All fields on one scrollable page with inline validation"
successMetrics:
  - name: "Checkout completion rate"
    target: "+15%"
    isPrimary: true
  - name: "Average order value"
    target: "No decrease"
    isPrimary: false
guardrails:
  - "Cart abandonment rate doesn't increase by more than 5%"
  - "Page load time stays under 2s"
targetAudience: "Mobile users, US market"
duration: "2 weeks"
trafficSplit: "50/50"
platform: "Web - mobile viewport"
---

## Background

Analytics show mobile checkout abandonment at 68%, significantly above desktop (41%). Hypothesis is that the multi-step flow creates friction on small screens.

## Implementation Notes

- Replace `CheckoutWizard` component with new `SinglePageCheckout`
- Inline validation via existing form library — no new dependencies
- Shipping estimate API call moves to on-page-load instead of step 2

## Results

_Pending — test not yet launched._
```

## Project Structure

```
experimentation/
├── src/
│   ├── content.config.ts          ← Astro content collection schema (Zod)
│   ├── content/
│   │   └── concepts/              ← experiment markdown files
│   │       ├── simplified-checkout.md
│   │       ├── cta-color-test.md
│   │       └── ...
│   ├── lib/
│   │   └── status.ts              ← status config: display order, colors, labels
│   ├── styles/
│   │   └── global.css             ← Tailwind v4 imports, @theme EPCVIP tokens
│   ├── layouts/
│   │   └── Base.astro             ← dark theme, font imports, page shell
│   ├── pages/
│   │   ├── index.astro            ← dashboard with all swimlanes
│   │   ├── status/
│   │   │   └── [status].astro     ← filtered view (e.g., /status/ready)
│   │   └── concepts/
│   │       └── [slug].astro       ← detail page (dynamic route)
│   └── components/
│       ├── ConceptCard.astro      ← card used in swimlanes
│       ├── Swimlane.astro         ← one status row: label + card list
│       ├── StatusBadge.astro      ← colored status pill
│       ├── MetricRow.astro        ← metric + target display
│       └── FilterBar.astro        ← status filter tabs
├── astro.config.mjs
└── package.json
```

## Design System — EPCVIP Tokens

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `epcvip-black` | `#0A0A0F` | Page background, deep surfaces |
| `epcvip-surface` | `#141418` | Card backgrounds, input fields |
| `epcvip-border` | `#1a1a24` | Borders, dividers |
| `epcvip-yellow` | `#F2C744` | Primary accent — active states, CTAs, highlights |
| `epcvip-amber` | `#c0892e` | Running/in-progress states |
| `epcvip-green` | `#2a6b3f` | Complete/success states |
| `epcvip-red` | `#c04040` | Killed/failed states, guardrail warnings |
| `text-primary` | `#ffffff` | Headings, titles |
| `text-secondary` | `#e0e0e0` | Body text |
| `text-muted` | `#777777` | Labels, metadata |
| `text-dim` | `#555555` | Least-emphasis text |

### Typography

| Element | Font | Weight | Size | Line Height |
|---------|------|--------|------|-------------|
| Page title | Montserrat | 700 | 28px | 1.2 |
| Section heading | Montserrat | 600 | 20px | 1.2 |
| Card title | Montserrat | 600 | 14px | 1.3 |
| Label/uppercase | Montserrat | 600 | 10px | 1.5 |
| Body | Inter | 400 | 16px | 1.7 |
| Small | Inter | 400 | 14px | 1.7 |
| Metadata | Inter | 400 | 12px | 1.5 |

### Status Colors

| Status | Left border | Text | Badge background |
|--------|------------|------|-----------------|
| Ready | `epcvip-yellow` | `epcvip-yellow` | `rgba(242,199,68,0.15)` |
| Running | `epcvip-amber` | `epcvip-amber` | `rgba(192,137,46,0.15)` |
| Draft | `#333333` | `text-dim` | `rgba(85,85,85,0.15)` |
| Complete | `epcvip-green` | `epcvip-green` | `rgba(42,107,63,0.15)` |
| Killed | `epcvip-red` | `epcvip-red` | `rgba(192,64,64,0.15)` |

### Priority Colors

| Priority | Text | Badge background |
|----------|------|-----------------|
| High | `epcvip-red` | `rgba(192,64,64,0.15)` |
| Medium | `epcvip-yellow` | `rgba(242,199,68,0.15)` |
| Low | `text-muted` | `rgba(85,85,85,0.15)` |

### UI Details

- **Tags** on cards and detail pages are display-only labels, not clickable filters
- **Hypothesis truncation** on cards: truncate at nearest word boundary before 80 characters, append ellipsis
- **Variants** display side-by-side (flex row) on desktop, stack vertically on screens below 640px
- **Site title:** "Experiment Lab | EPCVIP" — use EPCVIP favicon (yellow square logo on black)

## Tech Stack

- **Astro** — static site generator with content collections
- **Tailwind CSS** — utility-first styling with EPCVIP design tokens
- **No JS framework** — Astro components only, no client-side JavaScript (filter tabs are plain anchor links to static pages)
- **No database** — markdown files are the data layer
- **No auth** — solo tool, no login needed

## Deployment

Static output (`astro build` → `dist/`). Deployable to any static host: Vercel, Netlify, GitHub Pages, or served locally with `astro dev`.

## Scope Boundaries

**In scope:**
- Dashboard with status swimlanes and filtering
- Detail pages rendering all frontmatter fields + markdown body
- EPCVIP branded dark theme
- Astro content collection with frontmatter validation

**Out of scope:**
- Search (can add later if concept count grows)
- Editing concepts through the UI (terminal workflow only)
- Multi-user features, auth, comments
- Integration with external tools (LaunchDarkly, Jira, etc.)
- Analytics or tracking on the site itself
