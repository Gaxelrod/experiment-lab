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
