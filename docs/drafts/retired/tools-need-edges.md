---
id: tools-need-edges
kind: essay
cluster: writing
title: tools need edges
date: 2026-07-28
rank: 3
excerpt:
  - "A control that looked like an affordance and did nothing. Edges are promises, and mine was lying."
links:
  - target: marginalia
    rel: echoes
  - target: me-plus-ai
    rel: theme
struct:
  lens: "constraints that return agency"
  sections:
    - label: "The dead control"
      concepts: ["aria-expanded", "no rail below 1260"]
    - label: "An edge is a promise"
      concepts: ["affordance", "feedback"]
    - label: "Possibility debt"
      concepts: ["infinite choice", "orientation"]
    - label: "Grip"
      concepts: ["constraint", "skill"]
    - label: "Generative fog"
      concepts: ["AI abundance", "frames"]
---

## The dead control

On a phone, the summoned reference in my reader did nothing.

Tapping one set `aria-expanded` and pinned it — the state was correct, the accessibility tree was correct, the component believed it had worked. But the note renders in the margin rail, and there is no rail below 1260px. Nothing appeared. Tap again and the invisible thing closed.

Below 600px the featured card on home was worse in a duller way: a 172px poster sitting beside its text, so at 375 the title and dek were sharing **121 pixels**. And the touch targets — the way back, the colophon link, the footnote superscript, the header icons, the thesis word-count buttons — were all **14 to 22 pixels tall**.

None of that is a bug in the sense of a wrong value. Every one of those is an edge that made a promise to the hand and did not keep it.

## An edge is a promise

I have been writing about edges as if they were mainly about *limits* — the tool declining to do everything, the constraint that narrows the field so action can start.

The phone taught me the other half. An edge is not only a boundary. It is a claim about what will happen when you press it.

> [thesis|tool theory]
> A tool is not better because it permits more moves. It is better when its edges make the next meaningful move easier to find — and an edge that invites a press it cannot answer is worse than no edge at all.

The dead reference is the pure case. It looked pressable. It *was* pressable. It updated state. It just never returned anything to the person pressing it, which means for a month the interface was quietly teaching people that pressing does not work here.

A 20px target teaches the same lesson more slowly. You do not conclude *the target is small*. You conclude *I am clumsy*, and you stop reaching.

| type | force |
|------|-------|
| physical limit | teaches the hand where action starts |
| mode boundary | keeps state legible |
| feedback loop | lets skill accumulate |
| omission | prevents the tool from becoming the user's work |
| broken promise | teaches the hand to stop trying |

The last row is the one I added after the phone.

## Possibility debt

The older argument still holds, and it is the reason the promise matters.

A tool that says *you can do anything* hands over a possibility space and quietly makes you responsible for its rules. Before doing the work, you have to invent the frame. That is the debt: not attention, **orientation**.

Minimalism notices the wound — too many surfaces, too much capture, too many defaults designed against attention — and answers *choose less, turn things off*. The instinct is right and the answer is incomplete, because the deeper question is not how to use less technology. It is how to design tools that return agency instead of consuming it.

:::contrast less | edged
- fewer surfaces | clearer affordances
- attention protected by refusal | agency returned through grip
- absence as discipline | constraint as instrument
:::

That distinction is also why I got the mobile reader wrong. I had been optimizing for *less* — strip the chrome, trust the prose — while the edges that remained were making promises nothing could keep. Fewer surfaces did not produce more agency. It produced a room full of dead switches.

## Grip

A good constraint is not a wall. It is a grip.

A haiku has edges. A piano has edges. A camera lens, a command line, the OP-1. The edge is not there to reduce expression — it gives the hand something to learn, the mind something to push against, the user a place to begin. *Maximum function, minimum form* is not decoration. It is a theory of agency: every control has to earn its place, and every control has to invite use it can actually deliver.

An instrument is not powerful because it has infinite options. It is powerful because its limits are learnable — which requires that pressing the same place twice does the same thing twice.

Bad software inverts this. More menus, more modes, more surfaces to manage, and it calls that power. Usually it is deferred design work handed to the user: the tool refusing to decide where the edge belongs, so the user pays the orientation cost on every visit.

## Generative fog

AI makes this more urgent, not less. When software becomes generative the possibility space expands faster than anyone can hold it, and without frames, evals, loops, memory, and boundaries the user is left steering fog.

frames → evals → loops → memory → agency

The model can produce more. That does not mean I can hold more — [[Bounded Me|bounded-me]] is the whole reason. Abundance without edges becomes weather.

And the failure I actually shipped scales badly here. A dead control in a reader costs one tap. A generative tool that appears to accept direction and quietly does not respond to it costs a whole working relationship, because the user cannot tell the difference between *I steered badly* and *the steering is not connected.*

The future of good tools will not be defined by how much they can generate. It will be defined by how well they preserve agency inside abundance — which starts with the smallest possible discipline:

**Press every edge you ship, on the smallest screen you support, with your actual hand.**

The point is not to make technology smaller. It is to make it holdable. Tools need edges because humans do — and an edge is only real if it answers.
