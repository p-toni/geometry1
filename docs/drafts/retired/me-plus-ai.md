---
id: me-plus-ai
kind: essay
cluster: writing
title: me + AI
date: 2026-07-18
rank: 4
excerpt:
  - "I built six gates against drift, then started paying for all six on every thought."
links:
  - target: geometry-retrieval
    rel: cites
  - target: weak-geometry
    rel: theme
  - target: the-world-answers
    rel: leads to
struct:
  lens: "which instrument, when"
  sections:
    - label: "The tax"
      concepts: ["stacking", "overhead"]
    - label: "Load order"
      concepts: ["event-driven", "one gate"]
    - label: "The instruments"
      concepts: ["L0-L3", "R3+2+1"]
    - label: "What the gates are for"
      concepts: ["exchange", "feedback control"]
    - label: "Encoding instead of remembering"
      concepts: ["hooks", "institutional memory"]
    - label: "The seam"
      concepts: ["provenance", "co-authored"]
---

## The tax

I have a coupling gradient, a verification gate, a topology gate, a reconstruction test, a weakening test, and a contact protocol. Six instruments, each built because something real went wrong.

By July I was running all of them on everything.

That is not caution. It is a second job. A stabilizer that fires on every thought has stopped stabilizing anything — it has become the dominant cost in the loop it was supposed to protect, and the loop routes around it the way any system routes around a checkpoint that never lets anything through cheaply.

On 18 July I stress-tested the framework against itself and the finding was not that a gate was wrong. Every gate was still right. The finding was that I had no rule for **which one fires when**, so the honest default was all of them, and the practical default was none.

> [thesis|load order]
> Stacking is how verification becomes heavier than the loop it was meant to protect. The gates are layered instruments with a load order, not a stack I run on every thought.

## Load order

The correction is small and it is the whole essay. Each gate has a trigger. If I cannot name which gate I am in, I am probably stacking them.

| trigger | instrument |
|---------|------------|
| always present, no ceremony | weak grades on edges I am leaning on; cuts I can still name |
| a decision | R3+2+1 from memory — thesis, reason, next action, two assumptions, one uncertainty |
| structure not yet a thesis | topology gate — draw it, name the open edge, falsify one link |
| an ownership claim | reconstruction — close the source, rebuild, run the tests in geometry over retrieval |
| an external bet | contact — one probe, temporary closure on one edge, then downgrade or revise |
| drift detected | recovery — close, rewrite, re-enter at L0 or L1 |

The interval is event-driven. Not calendar-mandated. Nothing here runs on a timer, because a timer is how a gate becomes chrome.

## The instruments

The gradient is the cheapest thing to hold, so it stays loaded.

**L0 — tool.** Execution only. Formatting, refactoring, transformation. No influence on belief.

**L1 — scout.** The model expands the search space: options, counterexamples, alternate framings, failure modes. I keep the conclusion.

**L2 — co-author.** The model writes. I constrain, audit, cut, compress. The output is a draft artifact, not an authority.

**L3 — integrated.** The model is inside my decision loop. High bandwidth, high risk, sometimes the highest signal. Only with earned entry.

These are landmarks, not rooms. The useful question was never *what level am I at* but *which direction am I moving, and do I still know why*.

The transitions worth watching:

1. **L1 → L2:** I stop rephrasing the output and start building on it.
2. **L2 → L3:** the model's framing starts shaping the structure of my question.
3. **Any → drift:** I feel pulled to prompt again rather than think.
4. **Any → drift:** I cannot restate my position without referencing the output.

The goal is not to avoid L3. Unregulated L3 is the enemy; earned L3 is a capability, and over-damping is a real failure mode — a system so regulated it can no longer resonate. The goal is to never arrive there passively.

## What the gates are for

Four parameters decide whether coupling helps or hurts: **exchange** (bandwidth and persistence between me and the model), **feedback control** (how well I can monitor, interpret, constrain, reject), **latency** (how fast outputs alter my internal state), and **closure pressure** (how fast candidate structure hardens into belief).

High exchange with weak feedback control is the danger zone. Low latency makes it faster. Closure pressure makes it stick.

Models have a specific risk here: they are closure engines. They make the first coherent map feel more finished than it is.

> pull: Increase exchange only when feedback control is increasing too.

Bennett's bound gives this a physics rather than a mood. Under the Chord assumptions a unified moment has a size limit, `D ≤ kvθ` — support diameter bounded by signal speed times the integration window. If links in the control loop exceed θ, the system fragments into two agents taking turns instead of one enlarged mind. In the BCI case, 10 ms round-trip is marginally feasible against a 20–50 ms candidate window. In cloud AI, raw speed is not enough: limited concurrency and serialized pipelines can break co-instantiation even when the links are fast.

L3 has a physics. It is not a matter of how integrated I feel.

## Encoding instead of remembering

A load order I have to remember is another thing on the stack. So the load order should live in the repo, not in me.

This is what four skills in `.agents/skills/` are actually for, and why the first one landed on 30 June rather than as an afterthought. A skill file is a small piece of institutional memory: it reduces lore hunting, it pauses before risky moves, it makes boring important things hard to skip, and it lets a future session resume without reconstructing the room.

Enough of them and the codebase starts pushing back when the loop gets sloppy. Tooling stops being decoration and becomes a nervous system — trust is not a vibe, it is accumulated evidence that the system catches me when attention drops.

:::contrast assistant | loop partner
- waits for tasks | notices system pressure
- optimizes the next answer | preserves the next session
- helps produce output | helps maintain conditions
:::

The partner does not need to be more human. It needs to make the work more answerable.

## The seam

Three commits in this repo carry a `Co-Authored-By: Claude Opus 5` trailer. That is the provenance rule doing its actual job — not a verification UI, not site chrome, just a seam I left visible in the one place I cannot quietly edit later.

The hard stops are unchanged, and they are not gates, because they never fire conditionally. **No identity outsourcing** — the model does not answer who I am or what I should value. **No reality arbitration** — it can summarize inputs, it cannot decide what happened. **Provenance is mandatory.** **Nothing is accepted until I can rebuild the core shape from memory**, whether that shape is a proposition or a topology.

Everything else is a draft. No exceptions because the output sounds right, or sounds like me, or because I wanted it to be true.

What I got wrong for a month was not the gates. It was believing that more verification is monotonically safer. It is not — past some density the verification becomes the thing I route around, and a gate I skip is worse than a gate I never built, because I still get to feel protected by it.

One instrument, at its trigger. That is the whole discipline now.

I do not prompt my way out of confusion. I rewrite my way out — but only when something has actually gone wrong, and no longer as a tax on every sentence that goes right.
