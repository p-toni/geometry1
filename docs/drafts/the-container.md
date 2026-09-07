---
id: the-container
kind: essay
cluster: writing
title: the container
date: 2026-08-21
rank: 0
excerpt:
  - "The computer that landed on the moon had eight slots. When they filled, it did not try harder."
links:
  - target: allowed-ignorance
    rel: pairs
  - target: me-plus-ai
    rel: leads to
struct:
  lens: "a wall you can count, and the dials inside it"
  sections:
    - label: "102:42:17"
      concepts: ["overflow", "the alarm"]
    - label: "Eight"
      concepts: ["the wall", "the dials"]
    - label: "No known angle"
      concepts: ["the phantom", "flat text"]
    - label: "Frequency, not phase"
      concepts: ["the seam", "leakage"]
    - label: "Not restart-protected"
      concepts: ["shed", "decide when empty"]
    - label: "102:45:40"
      concepts: ["the audit", "what I am willing to lose"]
---

## 102:42:17

Seven minutes into the descent, with the lunar module below eight thousand feet and still falling, the display in front of Armstrong and Aldrin stopped showing altitude and showed a number instead.

1201.

Twenty-four seconds later, 1202. Sixteen seconds after that, 1202 again — this time at seven hundred and seventy feet, coming down at twenty-seven feet per second. Three alarms in forty seconds, at the exact end of a quarter-million-mile trip, while a man was flying an unflyable object toward a surface nobody had ever touched.

The alarms did not mean the computer was broken.

They meant it was full.

## Eight

The Apollo guidance computer scheduled its work into eight core sets — eight blocks of twelve registers each, and a job needed one to exist. Programs doing vector math needed something larger, and there were five of those. That was the whole allowance. Not eight thousand. Eight.

A 1202 meant every core set was taken. A 1201 meant the vector areas were gone.

So the alarm was not a diagnosis. It was a **count**. The machine was reporting its own size, out loud, at the worst possible moment, in a number a human could read.

I have never once been able to do that.

I have a limit of the same kind — the number of edges that can be live at once before the thing stops being one thought and becomes two. Bennett puts a floor under it: under the Chord assumptions a unified moment has a physical size ceiling, `D ≤ kvθ`, the support diameter bounded by signal speed times the integration window. A mind can only get so big because signals travel at finite speed. I am borrowing a consciousness argument for a smaller job, and it is load-bearing exactly once: **you cannot become humble enough to widen θ.**

What I do not have is the readout. When my container fills I do not get 1202. I get a mood. An evening that dissolves, a week that will not close, the specific tiredness that is not sleepiness. I get the feeling that I am failing at something I ought to be better at, which is a *story*, and the story is always about character, and the character story has never once helped me.

For eleven months I ran two different limits together under one word, *boundedness*, and treated it as a mood — a thing to be humble about. They are not the same thing. Eight core sets is a wall: practice does not move it, and nobody on that descent proposed adding one. Which jobs survive a restart is a dial: it was designed, argued over, and improved for years before the flight.

Effort on the dial compounds. Effort on the wall does not underperform. It produces nothing at all, while feeling like the most serious work available to you.

I had spent eleven months trying to train the wall.

## No known angle

Here is the part that stopped this being a story about spaceflight.

The computer was not full of work.

The rendezvous radar — the instrument for finding the command module later, in orbit, on the way home — had its mode switch in the wrong position for the descent. Its resolvers fed the computer signals that corresponded to no known angle. Not a wrong angle. Not a stale one. An angle that did not exist.

The counters did what counters do. They chased it. Six thousand four hundred pulses per second, for each axis, tracking the position of an antenna that was not reporting a position. That phantom took roughly fifteen percent of the computer's available time during the landing — fifteen percent of the machine, at the most expensive minutes in the program's history, spent processing a thing that was not there.

The reason my container is full is almost never the work in it.

It is the open loop I am not working on but am *scheduled against*. The decision deferred four times, which is not being made and is also not being dropped, and therefore runs. The unfinished conversation. The thing I said I would look into. The tab that is not information, it is a promise. None of these produce anything. All of them count at full rate against a position that does not exist.

The container cannot tell work from phantom. It only counts.

And because I have no alarm, I have to read the symptom instead. Mine is cheap and takes ten seconds: I open something I was reading and ask whether the sentences have any distance from each other. When the loop is good, they do — I know what is adjacent, I know what constrains what, I can forget a detail and regenerate the path. When the container is full of phantoms, everything is flat text. Every sentence is equally far away. Nothing is nearer than anything else, which means nothing is structure, which means I am reading and storing nothing.

Same paragraph, two different mornings. One it is a lever. One it is dead text.

Nothing about the paragraph changed.

I changed.

## Frequency, not phase

The cause underneath the cause is the part I cannot stop thinking about.

The radar and the flight control system each generated an 800-hertz reference signal. Both correct. Both to spec. The two were frequency-locked — identical rate, exactly as agreed — and never required to be phase-locked. The document defining the interface between the two subsystems specified the one and was silent on the other.

Nothing was broken. Every part met its specification. The failure lived in the seam between two correct things, at a resolution nobody had agreed to look at.

> [thesis|the seam]
> The overload was not caused by a broken component. It was caused by two correct components agreeing at the wrong resolution — and the cost only appeared when the container was already nearly full.

I have never had a week go wrong because a commitment was wrong. They go wrong in the seam: two things each reasonable, agreed at the level of *what*, never agreed at the level of *when*.

This is also the correction to every tool I have ever bought.

:::diagram flow
attention → notes → decisions → habits → products → feedback
lead: Six states, five transitions. The tools all sit on the boxes.
follow: Every loss I can name happened on an arrow.
:::

Almost all of the loss happens between those states rather than inside them. I read something and do not integrate it. I have an insight and do not attach it to a decision. I make a decision and do not make it executable. I execute and do not close the loop with feedback.

The leak is never memory. The leak is transition.

Four years of note-taking systems optimised the wrong end, because a better store cannot recover something that was never lost in storage. What I actually want is not better memory. It is lower-leakage loops, and those are built, not bought. It is also why writing beats filing: writing is the conversion point, the place a diffuse impression becomes an object with edges — and an object with edges is the only form that survives a transition intact.

## Not restart-protected

What saved the landing was designed years before anyone needed it.

The computer restarted, and restarting did not mean starting over. Critical computations had waypoints; on a restart they resumed from the last one, mid-flight, without losing the thread.

And the rest did not. The phrase in the engineer's own account is flat enough to miss: certain computations that were not considered vital were not restart-protected. They would simply disappear.

Somebody, years earlier, at a desk, with no emergency in the room, went through the list and decided in advance what would be allowed to vanish.

That is the whole discipline, and it has almost nothing to do with willpower.

The altitude-rate display was one of the things that vanished. The crew lost a readout they had been using. It came back a moment later, degraded, and the landing continued, because losing a number is survivable and losing the steering is not.

I have not solved this and I want to be honest that I have not. When my container fills, the move actually available is to let something disappear. Not to schedule it later — later is still a core set. Not to do it badly — badly is still a core set. To decide which live things are not vital and let them go without the funeral.

From the inside, that is indistinguishable from giving up.

Which is why the machine could do it and I cannot. It had made the list *before* the alarm. Nobody was choosing under load. The choosing had already happened, on a calm afternoon, by someone who would not be in the lunar module.

The lesson is not *be more decisive when full*. It is that the decision has to be made when empty, by someone who is not currently drowning — and the only candidate for that person is a version of me on a quieter day, writing it down.

[fig|core-sets]
*The container fills, and sheds. One waypoint carries the steering through the restart; the readout was never protected.*

## 102:45:40

Three minutes after the last alarm, Eagle landed in the Sea of Tranquility.

Nobody went back for the computations that vanished. They were not recovered later, or rescheduled, or apologised for. They were dropped by design, at the moment the container filled, and the mission they were part of succeeded — not despite the dropping, but because of it.

So this is what I run now. It takes ten minutes and I do it when the week has already gone wrong, which is later than I should and still earlier than the alternative.

1. **List what is live.** Not what is planned. Not what matters. What is taking a slot, including the things that are only waiting.
2. **Find the phantoms.** Is this processing a real position, or counting against something that does not exist? Deferred decisions, unfinished conversations, and promises I have not withdrawn are phantoms.
3. **Count against the window, not against ambition.** The number is smaller than I want. It has always been smaller than I want.
4. **Cut until the count fits.** Withdraw the promise out loud, make the decision badly and now, or let the thing disappear. Deferral is not a cut. Deferral is a core set with a nice name.
5. **Do not call step 4 a failure of will.** It is the only operation the container supports.

The step I have never run is the one Apollo ran first. Make the not-vital list while empty. Every cut I have made was made under load, by the worst available version of me, and I chose badly most of the time — I have protected the readout and dropped the steering more than once.

There is a second thing I have not solved, and it belongs to the next essay. The cut is not free, and I do not always know what I removed. A container that is no longer full tells you nothing about whether you emptied it correctly.

But that only arrives if you survive this one.

The wall was never the problem. Eight is eight. It was eight before the descent started and it will be eight in every machine ever built to that spec, and no amount of wanting more made a ninth core set exist at seven hundred and seventy feet.

The problem is that I keep arriving at the wall without having decided, in advance, what I am willing to lose.

> [update|provenance]
> Apollo detail from Don Eyles, *Tales from the Lunar Module Guidance Computer* (2004), and the Apollo 11 Lunar Surface Journal program-alarm notes. Eyles gives eight core sets; the ALSJ summary says seven. I have used Eyles, who wrote the code, and left the discrepancy visible rather than picking the number that reads better. The `D ≤ kvθ` bound is Bennett (2026), borrowed once and not extended.
