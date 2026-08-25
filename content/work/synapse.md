---
id: synapse
kind: project
cluster: work
title: synapse
date: rebuild
rank: 5
why: I couldn't trust an agent I could only watch from the outside.
problem: Behavior is too slippery to inspect after the fact.
solution: Replayable runs, explicit contracts, evidence kept separate from authority.
excerpt:
  - "I couldn't trust an agent I could only watch from the outside."
links:
  - target: the-container
    rel: idea
  - target: macroscopic
    rel: theme
---

Synapse asks how agent systems earn trust when behavior is too slippery to inspect from the outside.

The answer is replayable evidence: deterministic runs where possible, explicit execution contracts, trace bundles, schema checks, and a hard separation between evidence and authority.

> [thesis|standard]
> If an agent changed something, the system should be able to show what happened, under which contract, and whether the evidence is proof or projection.
