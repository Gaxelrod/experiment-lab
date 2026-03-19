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
