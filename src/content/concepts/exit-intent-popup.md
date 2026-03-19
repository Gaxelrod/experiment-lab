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
