# Experiment Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static Astro site that showcases UI/UX experiment concepts from markdown files, styled to the EPCVIP brand.

**Architecture:** Astro with content collections for type-safe markdown processing. Tailwind CSS with custom EPCVIP design tokens. All pages statically generated — no client-side JavaScript. Dashboard groups concepts into status swimlanes; detail pages render structured frontmatter + markdown body.

**Tech Stack:** Astro 5, Tailwind CSS 4, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-19-experiment-lab-design.md`

---

## File Map

| File | Responsibility |
|------|---------------|
| `package.json` | Dependencies: astro, tailwindcss, @tailwindcss/vite, @tailwindcss/typography |
| `astro.config.mjs` | Astro config with Tailwind v4 via Vite plugin |
| `src/styles/global.css` | Tailwind v4 imports, @theme tokens (EPCVIP colors/fonts), base styles |
| `src/content.config.ts` | Zod schema for concepts collection — validates all frontmatter |
| `src/content/concepts/simplified-checkout.md` | Sample concept (status: ready) |
| `src/content/concepts/hero-copy-variants.md` | Sample concept (status: running) |
| `src/content/concepts/exit-intent-popup.md` | Sample concept (status: complete, with outcome) |
| `src/content/concepts/onboarding-flow.md` | Sample concept (status: draft) |
| `src/lib/status.ts` | Status config: display order, colors, labels. Single source of truth. |
| `src/components/StatusBadge.astro` | Colored pill for status/priority display |
| `src/components/ConceptCard.astro` | Card for swimlane: title, truncated hypothesis, tags, outcome |
| `src/components/Swimlane.astro` | One status row: label + horizontal card list |
| `src/components/FilterBar.astro` | Status filter tabs as anchor links |
| `src/components/MetricRow.astro` | Single metric: name, target, primary badge |
| `src/layouts/Base.astro` | HTML shell: dark bg, fonts, site title, favicon |
| `src/pages/index.astro` | Dashboard: all swimlanes |
| `src/pages/status/[status].astro` | Filtered dashboard: single status swimlane |
| `src/pages/concepts/[slug].astro` | Detail page: full concept rendering |
| `public/favicon.svg` | EPCVIP yellow-on-black favicon |

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`
- Create: `public/favicon.svg`

- [ ] **Step 1: Initialize Astro project**

Note: The project directory is not empty (contains `.git`, `docs/`, etc.). When prompted, confirm you want to scaffold into the non-empty directory.

```bash
cd /Users/garrett/projects/experimentation
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```

- [ ] **Step 2: Install dependencies**

```bash
npm install tailwindcss @tailwindcss/vite @tailwindcss/typography
```

- [ ] **Step 3: Configure Astro with Tailwind v4**

Write `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
});
```

- [ ] **Step 4: Write global CSS with EPCVIP theme tokens**

Write `src/styles/global.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Inter:wght@400;600&display=swap');
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-epcvip-black: #0A0A0F;
  --color-epcvip-surface: #141418;
  --color-epcvip-border: #1a1a24;
  --color-epcvip-yellow: #F2C744;
  --color-epcvip-amber: #c0892e;
  --color-epcvip-green: #2a6b3f;
  --color-epcvip-red: #c04040;

  --color-text-primary: #ffffff;
  --color-text-secondary: #e0e0e0;
  --color-text-muted: #777777;
  --color-text-dim: #555555;

  --font-heading: "Montserrat", sans-serif;
  --font-body: "Inter", sans-serif;
}

@layer base {
  body {
    background-color: var(--color-epcvip-black);
    color: var(--color-text-secondary);
    font-family: var(--font-body);
  }
}
```

- [ ] **Step 5: Create favicon**

Note: Step numbering is sequential — there is no Step 6 (the original Tailwind config step was merged into Step 4).

Write `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="4" fill="#0A0A0F"/>
  <text x="16" y="22" font-family="sans-serif" font-weight="800" font-size="14" fill="#F2C744" text-anchor="middle">E</text>
</svg>
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

Expected: Astro dev server running on localhost, no errors.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/styles/global.css public/favicon.svg
git commit -m "feat: scaffold Astro project with Tailwind v4 and EPCVIP tokens"
```

---

## Task 2: Content Collection Schema + Sample Data

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/concepts/simplified-checkout.md`
- Create: `src/content/concepts/hero-copy-variants.md`
- Create: `src/content/concepts/exit-intent-popup.md`
- Create: `src/content/concepts/onboarding-flow.md`

- [ ] **Step 1: Define content collection schema**

Write `src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const concepts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/concepts' }),
  schema: z.object({
    title: z.string(),
    status: z.enum(['draft', 'ready', 'running', 'complete', 'killed']),
    created: z.coerce.date(),
    updated: z.coerce.date(),
    tags: z.array(z.string()).min(1),
    priority: z.enum(['high', 'medium', 'low']).optional(),
    hypothesis: z.string(),
    variants: z.array(z.object({
      name: z.string(),
      description: z.string(),
    })).min(2),
    successMetrics: z.array(z.object({
      name: z.string(),
      target: z.string(),
      isPrimary: z.boolean(),
    })).min(1),
    guardrails: z.array(z.string()).optional(),
    outcome: z.string().optional(),
    targetAudience: z.string().optional(),
    duration: z.string().optional(),
    trafficSplit: z.string().optional(),
    platform: z.string().optional(),
  }),
});

export const collections = { concepts };
```

- [ ] **Step 2: Create sample concept — ready status**

Write `src/content/concepts/simplified-checkout.md`:

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

- [ ] **Step 3: Create sample concept — running status**

Write `src/content/concepts/hero-copy-variants.md`:

```markdown
---
title: "Hero Copy Variants"
status: "running"
created: 2026-03-10
updated: 2026-03-17
tags: ["copy", "landing-page", "conversion"]
priority: "medium"
hypothesis: "Benefit-led hero copy will increase sign-up rate by 10% compared to feature-led copy"
variants:
  - name: "Control"
    description: "Feature-led: 'Real-time analytics, smart routing, and 99.9% uptime'"
  - name: "Benefit-led"
    description: "'Get 3x more qualified leads without increasing ad spend'"
successMetrics:
  - name: "Sign-up rate"
    target: "+10%"
    isPrimary: true
  - name: "Bounce rate"
    target: "No increase"
    isPrimary: false
guardrails:
  - "Time on page doesn't drop below current 45s average"
targetAudience: "New visitors from paid channels"
duration: "2 weeks"
trafficSplit: "50/50"
platform: "Web - all viewports"
---

## Background

Current hero copy focuses on technical features. User research suggests prospects care more about business outcomes than technical capabilities.

## Implementation Notes

- Only the `<h1>` and subtitle text change — no layout modifications
- Use existing A/B testing framework to serve variants

## Results

_In progress — Day 7 of 14._
```

- [ ] **Step 4: Create sample concept — complete status with outcome**

Write `src/content/concepts/exit-intent-popup.md`:

```markdown
---
title: "Exit Intent Popup"
status: "complete"
created: 2026-02-20
updated: 2026-03-12
tags: ["retention", "popup", "conversion"]
priority: "medium"
hypothesis: "Showing a discount offer on exit intent will recover 15% of abandoning visitors"
outcome: "+22% recovery rate"
variants:
  - name: "Control"
    description: "No exit intent popup"
  - name: "10% Discount"
    description: "Exit popup offering 10% off with email capture"
successMetrics:
  - name: "Visitor recovery rate"
    target: "+15%"
    isPrimary: true
  - name: "Email capture rate"
    target: "+5%"
    isPrimary: false
guardrails:
  - "Brand perception survey score stays above 7.5/10"
targetAudience: "All web visitors showing exit intent"
duration: "3 weeks"
trafficSplit: "50/50"
platform: "Web - desktop only"
---

## Background

Analytics show 72% of visitors leave after viewing the pricing page without taking action. Hypothesis is that a well-timed offer can recover a significant portion.

## Implementation Notes

- Exit intent detection library: `ouibounce`
- Popup component already exists in design system — reuse `Modal` with discount variant
- Email capture feeds into existing Mailchimp integration

## Results

**Winner: 10% Discount variant.**

- Recovery rate: +22% (exceeded +15% target)
- Email capture: +8.3%
- No negative impact on brand perception (8.1/10 vs 8.0/10 control)
- Rolled out to 100% of desktop traffic on 2026-03-12
```

- [ ] **Step 5: Create sample concept — draft status**

Write `src/content/concepts/onboarding-flow.md`:

```markdown
---
title: "Onboarding Flow Redesign"
status: "draft"
created: 2026-03-18
updated: 2026-03-18
tags: ["onboarding", "ux", "retention"]
hypothesis: "Progressive disclosure onboarding will increase Day-7 retention by 20%"
variants:
  - name: "Control"
    description: "Current 5-screen onboarding wizard"
  - name: "Progressive"
    description: "Contextual tips shown during first-use of each feature"
successMetrics:
  - name: "Day-7 retention"
    target: "+20%"
    isPrimary: true
guardrails:
  - "Time-to-first-value doesn't increase beyond 3 minutes"
---

## Background

Current onboarding completion rate is 34%. Most users drop off at screen 3 (profile setup). Hypothesis is that front-loading setup creates friction.

## Implementation Notes

_Still drafting — need to scope the progressive disclosure triggers._
```

- [ ] **Step 6: Verify schema validates all sample files**

```bash
npm run dev
```

Expected: Dev server starts without content collection validation errors. Check terminal output for any Zod validation failures.

- [ ] **Step 7: Commit**

```bash
git add src/content.config.ts src/content/concepts/
git commit -m "feat: add content collection schema and sample experiment concepts"
```

---

## Task 3: Status Config + Base Layout

**Files:**
- Create: `src/lib/status.ts`
- Create: `src/layouts/Base.astro`

- [ ] **Step 1: Create status config**

Write `src/lib/status.ts`:

```ts
export const STATUS_ORDER = ['draft', 'ready', 'running', 'complete', 'killed'] as const;
export type Status = (typeof STATUS_ORDER)[number];

export const STATUS_CONFIG: Record<Status, {
  label: string;
  dotColor: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
}> = {
  draft: {
    label: 'Draft',
    dotColor: 'bg-[#333333]',
    borderColor: 'border-l-[#333333]',
    textColor: 'text-text-dim',
    badgeBg: 'bg-[rgba(85,85,85,0.15)] border border-[rgba(85,85,85,0.3)]',
  },
  ready: {
    label: 'Ready',
    dotColor: 'bg-epcvip-yellow',
    borderColor: 'border-l-epcvip-yellow',
    textColor: 'text-epcvip-yellow',
    badgeBg: 'bg-[rgba(242,199,68,0.15)] border border-[rgba(242,199,68,0.3)]',
  },
  running: {
    label: 'Running',
    dotColor: 'bg-epcvip-amber',
    borderColor: 'border-l-epcvip-amber',
    textColor: 'text-epcvip-amber',
    badgeBg: 'bg-[rgba(192,137,46,0.15)] border border-[rgba(192,137,46,0.3)]',
  },
  complete: {
    label: 'Complete',
    dotColor: 'bg-epcvip-green',
    borderColor: 'border-l-epcvip-green',
    textColor: 'text-epcvip-green',
    badgeBg: 'bg-[rgba(42,107,63,0.15)] border border-[rgba(42,107,63,0.3)]',
  },
  killed: {
    label: 'Killed',
    dotColor: 'bg-epcvip-red',
    borderColor: 'border-l-epcvip-red',
    textColor: 'text-epcvip-red',
    badgeBg: 'bg-[rgba(192,64,64,0.15)] border border-[rgba(192,64,64,0.3)]',
  },
};

export const PRIORITY_CONFIG: Record<string, { textColor: string; badgeBg: string }> = {
  high: {
    textColor: 'text-epcvip-red',
    badgeBg: 'bg-[rgba(192,64,64,0.15)] border border-[rgba(192,64,64,0.3)]',
  },
  medium: {
    textColor: 'text-epcvip-yellow',
    badgeBg: 'bg-[rgba(242,199,68,0.15)] border border-[rgba(242,199,68,0.3)]',
  },
  low: {
    textColor: 'text-text-muted',
    badgeBg: 'bg-[rgba(85,85,85,0.15)] border border-[rgba(85,85,85,0.3)]',
  },
};

export function truncateHypothesis(text: string, max = 80): string {
  if (text.length <= max) return text;
  const truncated = text.slice(0, max);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '…';
}
```

- [ ] **Step 2: Create Base layout**

Write `src/layouts/Base.astro`:

```astro
---
import '../styles/global.css';

interface Props {
  title?: string;
}

const { title = 'Experiment Lab' } = Astro.props;
const fullTitle = `${title} | EPCVIP`;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{fullTitle}</title>
  </head>
  <body class="min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </div>
  </body>
</html>
```

- [ ] **Step 3: Verify layout renders**

Update `src/pages/index.astro` temporarily:

```astro
---
import Base from '../layouts/Base.astro';
---
<Base>
  <h1 class="font-heading font-bold text-[28px] leading-[1.2] text-text-primary">Experiment Lab</h1>
  <p class="text-text-muted mt-2">Scaffold working.</p>
</Base>
```

```bash
npm run dev
```

Expected: Dark page with white "Experiment Lab" heading in Montserrat, muted subtitle in Inter.

- [ ] **Step 4: Commit**

```bash
git add src/lib/status.ts src/layouts/Base.astro src/pages/index.astro
git commit -m "feat: add status config, base layout, and EPCVIP dark theme"
```

---

## Task 4: Small Components (StatusBadge, MetricRow, FilterBar)

**Files:**
- Create: `src/components/StatusBadge.astro`
- Create: `src/components/MetricRow.astro`
- Create: `src/components/FilterBar.astro`

- [ ] **Step 1: Create StatusBadge**

Write `src/components/StatusBadge.astro`:

```astro
---
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../lib/status';

interface Props {
  type: 'status' | 'priority';
  value: string;
}

const { type, value } = Astro.props;
const config = type === 'status'
  ? STATUS_CONFIG[value as keyof typeof STATUS_CONFIG]
  : PRIORITY_CONFIG[value];
---

{config && (
  <span class:list={[
    'inline-flex items-center px-2.5 py-0.5 rounded text-[9px] font-heading font-semibold uppercase tracking-wider',
    config.textColor,
    config.badgeBg,
  ]}>
    {type === 'priority' ? `${value} Priority` : value}
  </span>
)}
```

- [ ] **Step 2: Create MetricRow**

Write `src/components/MetricRow.astro`:

```astro
---
interface Props {
  name: string;
  target: string;
  isPrimary: boolean;
}

const { name, target, isPrimary } = Astro.props;
---

<div class="flex items-center justify-between bg-epcvip-surface border border-epcvip-border rounded px-3 py-2.5">
  <span class="text-text-secondary text-sm">{name}</span>
  <div class="flex items-center gap-2">
    <span class:list={[
      'text-sm font-semibold',
      isPrimary ? 'text-epcvip-yellow' : 'text-text-muted',
    ]}>
      {target}
    </span>
    {isPrimary && (
      <span class="bg-epcvip-yellow text-epcvip-black text-[7px] font-heading font-bold px-1.5 py-0.5 rounded">
        PRIMARY
      </span>
    )}
  </div>
</div>
```

- [ ] **Step 3: Create FilterBar**

Write `src/components/FilterBar.astro`:

```astro
---
import { STATUS_ORDER, STATUS_CONFIG } from '../lib/status';

interface Props {
  activeStatus?: string;
}

const { activeStatus } = Astro.props;
---

<nav class="flex gap-1.5">
  <a
    href="/"
    class:list={[
      'px-3 py-1 rounded text-[9px] font-heading font-semibold uppercase tracking-wider transition-colors',
      !activeStatus
        ? 'bg-epcvip-yellow text-epcvip-black'
        : 'bg-epcvip-surface text-text-muted border border-epcvip-border hover:text-text-secondary',
    ]}
  >
    All
  </a>
  {STATUS_ORDER.map((status) => (
    <a
      href={`/status/${status}`}
      class:list={[
        'px-3 py-1 rounded text-[9px] font-heading font-semibold uppercase tracking-wider transition-colors',
        activeStatus === status
          ? 'bg-epcvip-yellow text-epcvip-black'
          : 'bg-epcvip-surface text-text-muted border border-epcvip-border hover:text-text-secondary',
      ]}
    >
      {STATUS_CONFIG[status].label}
    </a>
  ))}
</nav>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/StatusBadge.astro src/components/MetricRow.astro src/components/FilterBar.astro
git commit -m "feat: add StatusBadge, MetricRow, and FilterBar components"
```

---

## Task 5: ConceptCard + Swimlane Components

**Files:**
- Create: `src/components/ConceptCard.astro`
- Create: `src/components/Swimlane.astro`

- [ ] **Step 1: Create ConceptCard**

Write `src/components/ConceptCard.astro`:

```astro
---
import { STATUS_CONFIG, truncateHypothesis } from '../lib/status';

interface Props {
  slug: string;
  title: string;
  status: string;
  hypothesis: string;
  tags: string[];
  outcome?: string;
}

const { slug, title, status, hypothesis, tags, outcome } = Astro.props;
const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
---

<a
  href={`/concepts/${slug}`}
  class:list={[
    'block bg-epcvip-surface border border-epcvip-border border-l-[3px] rounded p-3 min-w-[220px] max-w-[280px] hover:border-epcvip-border/80 transition-colors',
    config.borderColor,
    status === 'draft' && 'opacity-60',
  ]}
>
  <h3 class="font-heading font-semibold text-sm text-text-primary mb-1 leading-tight">
    {title}
  </h3>
  <p class="text-text-dim text-[11px] mb-2 leading-snug">
    {truncateHypothesis(hypothesis)}
  </p>
  {outcome && (
    <p class:list={['text-[11px] font-semibold mb-2', config.textColor]}>
      {outcome}
    </p>
  )}
  <div class="flex flex-wrap gap-1">
    {tags.map((tag) => (
      <span class="bg-epcvip-black border border-epcvip-border text-text-muted text-[8px] px-1.5 py-0.5 rounded">
        {tag}
      </span>
    ))}
  </div>
</a>
```

- [ ] **Step 2: Create Swimlane**

Write `src/components/Swimlane.astro`:

```astro
---
import type { CollectionEntry } from 'astro:content';
import { STATUS_CONFIG } from '../lib/status';
import ConceptCard from './ConceptCard.astro';

interface Props {
  status: string;
  concepts: CollectionEntry<'concepts'>[];
}

const { status, concepts } = Astro.props;
const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];

// Sort by updated date, most recent first (toSorted avoids mutating the prop)
const sorted = [...concepts].sort((a, b) =>
  new Date(b.data.updated).getTime() - new Date(a.data.updated).getTime()
);
---

{sorted.length > 0 && (
  <section class="mb-6">
    <div class="flex items-center gap-2 mb-3">
      <div class:list={['w-2 h-2 rounded-full', config.dotColor]} />
      <span class:list={[
        'font-heading font-semibold text-[9px] uppercase tracking-[1.2px]',
        config.textColor,
      ]}>
        {config.label}
      </span>
      <span class="text-text-dim text-[9px]">({sorted.length})</span>
    </div>
    <div class="flex gap-3 overflow-x-auto pb-2">
      {sorted.map((concept) => (
        <ConceptCard
          slug={concept.id}
          title={concept.data.title}
          status={concept.data.status}
          hypothesis={concept.data.hypothesis}
          tags={concept.data.tags}
          outcome={concept.data.outcome}
        />
      ))}
    </div>
  </section>
)}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ConceptCard.astro src/components/Swimlane.astro
git commit -m "feat: add ConceptCard and Swimlane dashboard components"
```

---

## Task 6: Dashboard Page (index + status filter)

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/pages/status/[status].astro`

- [ ] **Step 1: Build dashboard index page**

Write `src/pages/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import Base from '../layouts/Base.astro';
import FilterBar from '../components/FilterBar.astro';
import Swimlane from '../components/Swimlane.astro';
import { STATUS_ORDER } from '../lib/status';

const allConcepts = await getCollection('concepts');
const conceptsByStatus = STATUS_ORDER.map((status) => ({
  status,
  concepts: allConcepts.filter((c) => c.data.status === status),
}));
const total = allConcepts.length;
---

<Base>
  <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b border-epcvip-border">
    <div class="flex items-center gap-3">
      <div class="bg-epcvip-yellow text-epcvip-black font-heading font-extrabold text-xs px-2 py-1 rounded tracking-wider">
        EPCVIP
      </div>
      <h1 class="font-heading font-bold text-[28px] leading-[1.2] text-text-primary">
        Experiment Lab
      </h1>
      <span class="text-text-dim text-sm">{total} concepts</span>
    </div>
    <FilterBar />
  </header>

  {conceptsByStatus.map(({ status, concepts }) => (
    <Swimlane status={status} concepts={concepts} />
  ))}
</Base>
```

- [ ] **Step 2: Build filtered status page**

Write `src/pages/status/[status].astro`:

```astro
---
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';
import FilterBar from '../../components/FilterBar.astro';
import Swimlane from '../../components/Swimlane.astro';
import { STATUS_ORDER, STATUS_CONFIG } from '../../lib/status';

export function getStaticPaths() {
  return STATUS_ORDER.map((status) => ({ params: { status } }));
}

const { status } = Astro.params;
const allConcepts = await getCollection('concepts');
const filtered = allConcepts.filter((c) => c.data.status === status);
const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
---

<Base title={`${config.label} Experiments`}>
  <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b border-epcvip-border">
    <div class="flex items-center gap-3">
      <div class="bg-epcvip-yellow text-epcvip-black font-heading font-extrabold text-xs px-2 py-1 rounded tracking-wider">
        EPCVIP
      </div>
      <h1 class="font-heading font-bold text-[28px] leading-[1.2] text-text-primary">
        Experiment Lab
      </h1>
      <span class="text-text-dim text-sm">{filtered.length} {config.label.toLowerCase()}</span>
    </div>
    <FilterBar activeStatus={status} />
  </header>

  {filtered.length > 0 ? (
    <Swimlane status={status!} concepts={filtered} />
  ) : (
    <p class="text-text-dim text-sm mt-8">No {config.label.toLowerCase()} experiments yet.</p>
  )}
</Base>
```

- [ ] **Step 3: Verify dashboard renders with sample data**

```bash
npm run dev
```

Expected: Dashboard shows 4 swimlanes (Draft, Ready, Running, Complete) with sample cards. Killed swimlane is hidden (no sample data). Filter tabs render and link to `/status/[status]` pages.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/pages/status/
git commit -m "feat: add dashboard with status swimlanes and filter navigation"
```

---

## Task 7: Detail Page

**Files:**
- Create: `src/pages/concepts/[slug].astro`

- [ ] **Step 1: Build detail page**

Write `src/pages/concepts/[slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import Base from '../../layouts/Base.astro';
import StatusBadge from '../../components/StatusBadge.astro';
import MetricRow from '../../components/MetricRow.astro';

export async function getStaticPaths() {
  const concepts = await getCollection('concepts');
  return concepts.map((concept) => ({
    params: { slug: concept.id },
    props: { concept },
  }));
}

const { concept } = Astro.props;
const { data } = concept;
const { Content } = await render(concept);

const contextFields = [
  { label: 'Audience', value: data.targetAudience },
  { label: 'Duration', value: data.duration },
  { label: 'Split', value: data.trafficSplit },
  { label: 'Platform', value: data.platform },
].filter((f) => f.value);

const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
---

<Base title={data.title}>
  <div class="max-w-3xl mx-auto">
    <!-- Back link -->
    <a href="/" class="text-text-dim text-sm hover:text-text-muted transition-colors mb-6 inline-block">
      <span class="text-epcvip-yellow">←</span> Back to all concepts
    </a>

    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-3">
        <StatusBadge type="status" value={data.status} />
        {data.priority && <StatusBadge type="priority" value={data.priority} />}
      </div>
      <h1 class="font-heading font-bold text-[28px] leading-[1.2] text-text-primary mb-2">
        {data.title}
      </h1>
      <p class="text-text-dim text-sm">
        Created {formatDate(data.created)} · Updated {formatDate(data.updated)} · <span class="text-text-muted">{data.tags.join(', ')}</span>
      </p>
    </div>

    <!-- Hypothesis -->
    <div class="bg-epcvip-surface rounded-md p-4 mb-4 border-l-[3px] border-l-epcvip-yellow">
      <div class="font-heading font-semibold text-epcvip-yellow text-[9px] uppercase tracking-[1.2px] mb-2">
        Hypothesis
      </div>
      <p class="text-text-secondary text-base leading-relaxed">
        {data.hypothesis}
      </p>
    </div>

    <!-- Variants -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
      {data.variants.map((variant, i) => (
        <div class:list={[
          'bg-epcvip-surface rounded-md p-4',
          i === 0
            ? 'border border-epcvip-border'
            : 'border border-epcvip-yellow',
        ]}>
          <div class:list={[
            'font-heading font-semibold text-[9px] uppercase tracking-wider mb-2',
            i === 0 ? 'text-text-muted' : 'text-epcvip-yellow',
          ]}>
            {variant.name}
          </div>
          <p class="text-text-secondary text-sm leading-relaxed">
            {variant.description}
          </p>
        </div>
      ))}
    </div>

    <!-- Success Metrics -->
    <div class="mb-4">
      <h2 class="font-heading font-semibold text-text-muted text-[9px] uppercase tracking-[1.2px] mb-3">
        Success Metrics
      </h2>
      <div class="flex flex-col gap-1">
        {data.successMetrics.map((metric) => (
          <MetricRow name={metric.name} target={metric.target} isPrimary={metric.isPrimary} />
        ))}
      </div>
    </div>

    <!-- Guardrails -->
    {data.guardrails && data.guardrails.length > 0 && (
      <div class="mb-4">
        <h2 class="font-heading font-semibold text-text-muted text-[9px] uppercase tracking-[1.2px] mb-3">
          Guardrails
        </h2>
        <div class="space-y-1">
          {data.guardrails.map((g) => (
            <p class="text-epcvip-red text-sm">
              <span class="text-epcvip-yellow">⚠</span> {g}
            </p>
          ))}
        </div>
      </div>
    )}

    <!-- Context metadata -->
    {contextFields.length > 0 && (
      <div class="flex flex-wrap gap-4 text-text-dim text-sm border-t border-epcvip-border pt-4 mb-8">
        {contextFields.map((field) => (
          <span>
            <span class="text-text-muted">{field.label}:</span> {field.value}
          </span>
        ))}
      </div>
    )}

    <!-- Markdown body -->
    <div class="prose prose-invert prose-sm max-w-none
      prose-headings:font-heading prose-headings:text-text-primary prose-headings:font-semibold
      prose-p:text-text-secondary prose-p:leading-relaxed
      prose-li:text-text-secondary
      prose-strong:text-text-primary
      prose-code:text-epcvip-yellow prose-code:bg-epcvip-surface prose-code:px-1 prose-code:rounded
      prose-a:text-epcvip-yellow prose-a:no-underline hover:prose-a:underline
      border-t border-epcvip-border pt-6">
      <Content />
    </div>
  </div>
</Base>
```

- [ ] **Step 2: Verify detail page renders**

```bash
npm run dev
```

Navigate to `http://localhost:4321/concepts/simplified-checkout`. Expected: Full detail page with hypothesis block (yellow border), two variant cards (control neutral, variant yellow), metrics, guardrails, context footer, and rendered markdown body.

Also check: `/concepts/exit-intent-popup` — should show outcome and completed results in markdown body.

- [ ] **Step 3: Commit**

```bash
git add src/pages/concepts/
git commit -m "feat: add concept detail page with full structured rendering"
```

---

## Task 8: Build Verification + Polish

**Files:**
- Modify: Various (minor fixes if needed)

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: Clean build with no errors. Output in `dist/` directory.

- [ ] **Step 2: Preview production build**

```bash
npm run preview
```

Navigate through all pages:
- `/` — dashboard with all swimlanes
- `/status/ready` — filtered view
- `/status/running` — filtered view
- `/status/complete` — filtered view
- `/status/draft` — filtered view
- `/status/killed` — empty (no sample concepts), should show "No killed experiments yet." message
- `/concepts/simplified-checkout` — detail page
- `/concepts/hero-copy-variants` — detail page
- `/concepts/exit-intent-popup` — detail page with outcome
- `/concepts/onboarding-flow` — draft detail page

Expected: All pages render correctly with EPCVIP branding. Cards link to detail pages. Back link returns to dashboard. Filter tabs highlight active status.

- [ ] **Step 3: Fix any issues found during verification**

Address any visual or functional issues discovered during the preview walkthrough.

- [ ] **Step 4: Final commit**

Stage and commit any files modified during polish. Use targeted `git add` for specific changed files rather than `git add -A` to avoid staging unrelated files (e.g., the brand guide PDF).

```bash
git add src/ public/
git commit -m "feat: complete experiment lab site — build verified"
```
