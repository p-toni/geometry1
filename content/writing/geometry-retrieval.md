---
id: geometry-retrieval
kind: essay
cluster: writing
title: geometry over retrieval
date: 2026-07-28
rank: 5
excerpt:
  - "Recognition is cheap now. Reconstruction still costs something. This is the card I run."
links:
  - target: bounded-me
    rel: theme
  - target: allowed-ignorance
    rel: pairs
  - target: me-plus-ai
    rel: cites
struct:
  lens: "understanding after the source closes"
  sections:
    - label: "When to run this"
      concepts: ["ownership claim", "borrowed coherence"]
    - label: "The standard"
      concepts: ["source closed", "reconstruction"]
    - label: "Step 1 — sketch the graph"
      concepts: ["typed edges", "graded force"]
    - label: "Step 2 — collapse the illusion"
      concepts: ["mechanism", "the break"]
    - label: "Step 3 — close and rebuild"
      concepts: ["scout", "close", "rebuild"]
    - label: "Step 4 — run the six"
      concepts: ["rephrase", "relax"]
    - label: "The curvature check"
      concepts: ["structured wrongness", "hidden coupling"]
---

## When to run this

Not on everything. This is the instrument that fires on an **ownership claim** — the moment I am about to act as though a structure is mine, teach it, build on it, or let it decide something.

The trigger is usually a feeling, and the feeling is relief. The answer arrived, the paragraph sounded coherent, the model handed me a structure-shaped object, and I felt the relief of understanding before I had paid for it.

Rozenblit and Keil named the failure in 1998: the illusion of explanatory depth. People rate their understanding of a mechanism highly until they are asked to produce it in detail, and then the floor drops. The finding is old. What is new is that the floor now has something under it — the explanation is always one prompt away, so the drop never happens, and I never learn that it would have.

That is the danger. Not wrong answers. Accurate prose I do not own.

## The standard

> [thesis|the standard]
> If I can rebuild the structure with the source closed, I have geometry. If I can only recall it, or summon it again through a model, I have retrieval.

Retrieval gives me access. Geometry gives me orientation. Both are useful and only one of them survives the source going away.

Geometry has three signatures worth knowing, because they are what the tests below are actually probing. It **generates predictions** — a real map implies expectations about nearby territory. It **degrades gracefully** — forget a detail and the surrounding constraints reconstruct it. It **localizes surprise** — when something breaks, I can name which edge failed and what that invalidates downstream.

Retrieval feels like reaching. Geometry feels like standing somewhere.

## Step 1 — sketch the graph

Ten minutes. Write the core nodes, then force five to ten edges between them.

For each edge, name the type:

| type | claim |
|------|-------|
| causal | A drives B |
| constraint | A limits B |
| tradeoff | more A means less B |
| dependency | B requires A |

If I cannot type the edge, it is hand-waving. Two facts sitting near each other are still two facts — *proximity is not relationship*, and most of what feels like understanding is a list that has been arranged neatly.

Then grade the force: **necessary**, **likely**, **working bridge**, **speculative**. If I cannot grade it, I am overcommitting.

## Step 2 — collapse the illusion

Pick one edge. Explain the mechanism aloud until confidence breaks.

It will break. The point is to find *where* — the break marks a missing sub-edge, and that sub-edge is the thing I was quietly assuming while feeling like I knew.

Do this before closing the source, not after. This step is diagnosis; the next one is the test.

## Step 3 — close and rebuild

1. **Scout.** Model allowed. Ask for alternate framings, counterexamples, failure modes. No conclusions.
2. **Close.** No model, no notes. Wait — an hour is enough, a day is better.
3. **Rebuild.** Redraw the graph from scratch. Not from memory of the diagram; from memory of the structure.
4. **Compare.** What came back, what did not, and what came back *wrong* — the third category is the most informative and the one I skip.

## Step 4 — run the six

| test | geometry | retrieval |
|------|----------|-----------|
| **Rephrase** — same question, different framing | invariant survives | surface breaks |
| **Rebuild** — close everything, reconstruct | structure regenerates | fragments only |
| **Predict** — what is around the corner? | specific expectations | none |
| **Teach** — can I build it in someone else? | I can walk a path | I can only relay |
| **Break** — a fact turns out wrong | damage localizes to an edge | the whole picture destabilizes |
| **Relax** — weaken one key edge | map still orients | usefulness collapses with certainty |

Relax is the one I added late and the one that catches the most. A map that only works at full strength is not a map, it is a position.

## The curvature check

The five tests above catch local error. There is a failure they miss.

I can have every local edge right and still be globally wrong. That is **curvature**: structured wrongness, the pattern of failure that says the global shape is off even when each edge looks plausible.

The example that made it click is this one. *Flat intuition:* better summaries should improve decisions. *Observed bend:* better summaries can increase confidence without increasing ownership. The loop shifts from `think → consult` to `consult → assent`, and because the explanation is always available, the illusion of explanatory depth never gets tested. Ease of processing starts impersonating knowing.

The bend, stated once: **in a coupled system, clarity can increase drift if it displaces reconstruction.**

Operationally, when surprise repeats in a consistent pattern rather than randomly, stop patching edges and run this instead — make two independent predictions from different edges, then stress the system.

- If they repeatedly **converge** where I expected independence, there is a hidden coupling.
- If they repeatedly **diverge** where I expected consistency, there is a missing dimension.

Honesty clause: I am using curvature as a cognitive operator, not claiming mental maps are literally manifolds. The point is navigational power, not category purity.

---

Models are coherence engines and I am fluency-biased, so the default loop — prompt, accept, move on — produces retrieval that feels exactly like geometry. It lands precisely on my strongest cognitive illusion.

The standing rule: **use models to expand the search space, use reconstruction to build the map.**

And per the load order in [[Me + AI|me-plus-ai]], run this card on an ownership claim. Not on every thought. A test I run constantly is a test I will eventually stop running honestly.
