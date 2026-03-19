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
