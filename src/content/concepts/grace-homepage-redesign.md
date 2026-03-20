---
title: "Grace Loan Advance Homepage Redesign"
status: "draft"
created: 2026-03-19
updated: 2026-03-19
tags: ["homepage", "conversion", "trust", "grace-loan-advance"]
priority: "high"
hypothesis: "A homepage that leads with empathy-driven copy, embeds the first form step above the fold, and adds visible trust signals will increase application start rate by 25%"
variants:
  - name: "Control"
    description: "Current homepage: feature-led hero copy (APR ranges, repayment terms), orange 'Start My Request' CTA button, no form fields visible, minimal trust signals, form starts on a separate step after click-through"
    prototypeUrl: "https://graceloanadvance.com/?ac=10186"
  - name: "Variant 1 — Big CTA Button"
    description: "Empathy-driven hero, 'Choose Your Loan Amount' button with shimmer animation, 2-step overlay (amount selection → info form), Google sign-in, processing screen, personalized congrats page"
    prototypeUrl: "/prototypes/grace-homepage-variant.html"
  - name: "Variant 2 — Type-in Amount"
    description: "Same empathy hero but with inline dollar amount input field and popular amount pills ($1K–$10K), skips straight to info form overlay on submit"
    prototypeUrl: "/prototypes/grace-homepage-variant-2.html"
successMetrics:
  - name: "Application start rate"
    target: "+25%"
    isPrimary: true
  - name: "Application completion rate"
    target: "No decrease"
    isPrimary: false
  - name: "Cost per funded loan"
    target: "No increase"
    isPrimary: false
guardrails:
  - "Bounce rate doesn't increase by more than 5%"
  - "All regulatory disclosures remain accessible and compliant"
  - "Page load time stays under 3s"
targetAudience: "All visitors landing on graceloanadvance.com homepage"
duration: "3 weeks"
trafficSplit: "50/50"
platform: "Web - all viewports, mobile priority"
---

## Background

The current Grace Loan Advance homepage at graceloanadvance.com leads with technical loan details (APR ranges 5.99%-35.99%, repayment terms 91 days to 72 months) in the hero section. The primary CTA is an orange "Start My Request" button that navigates to a separate form page.

The target user is financially stressed and looking for a fast, easy way to get a loan. They need reassurance that:
1. This is quick (not a 30-minute application)
2. This is free (no hidden fees to apply)
3. This won't hurt their credit (soft pull)
4. Other people have successfully used this

The current page addresses none of these concerns above the fold. Instead, it leads with information that matters *after* the user decides to engage (rates, terms).

## Variant Design: Empathy-First with Embedded Form

### Hero Section Changes

**Current hero:** "Get the money you need quickly" + APR/term bullet points + "Start My Request" button

**Proposed hero:**
- Headline: "Need cash fast? See if you qualify in under 60 seconds"
- Subhead: "100% free. No credit score impact. No obligation."
- Embedded first step: loan amount selector (slider or prominent dropdown) with a single CTA "Check My Options"
- Small trust line below CTA: "Trusted by 50,000+ borrowers · Funds as soon as next business day"

The key shift: instead of telling users about the product's features, address their emotional state (stressed, needs money) and remove their objections (it's free, won't hurt credit, takes 60 seconds).

### Trust Bar (new section, immediately below hero)

A horizontal strip with 3-4 trust indicators:
- Total funded amount ("$XX million funded")
- Average star rating with count
- "No credit impact" badge with shield icon
- "Bank-level encryption" badge

### Social Proof Section (replaces features grid)

Replace the current three-column features grid ("One quick & easy online form", "Loan offers in just minutes", "Funds sent direct to your bank") with a testimonial-driven section:
- 2-3 short testimonials with first name, state, and star rating
- Focus testimonials on speed and ease: "I got approved in 5 minutes" not "The APR was competitive"

### What Stays the Same

- FAQ accordion (valuable for SEO and user education)
- APR comparison table (regulatory value, keeps compliance happy)
- Footer with legal disclosures
- Overall page structure below the fold
- Mobile-first responsive design

## Implementation Notes

- The embedded form field in the hero should submit to the existing application flow (pre-filling the loan amount)
- Ensure all current regulatory disclosures remain in place — move if needed, don't remove
- Trust metrics (funded amount, borrower count) need to be sourced or use reasonable estimates approved by compliance
- Test on mobile first — majority of traffic for this demographic will be mobile
- The "no credit impact" claim must be verified with the lending partners

## Key Risks

- Embedding a form field above the fold on mobile requires careful layout work — can't feel cramped
- Testimonials need to be real or clearly marked as representative examples (FTC compliance)
- Changing the hero copy significantly could affect paid search quality scores if ad copy doesn't match
