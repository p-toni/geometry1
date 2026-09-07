---
id: tsubuyaki
kind: sketch
cluster: play
title: tsubuyaki
date: 2026-08-25
rank: 0
excerpt:
  - "Two hundred and eighty characters of p5.js. The body is not stored anywhere — it is recomputed, forty thousand points a frame, from six lines of arithmetic."
links:
  - target: sea
    rel: sibling
  - target: lanterns
    rel: sibling
  - target: fold
    rel: sibling
---

#つぶやきProcessing is a Japanese practice with one rule: the whole program must fit in a tweet. Not a link to a program, not a gist — the source itself, 280 characters, posted as text you can read on the way past.

The constraint does something odd. There is no room to store a shape, so you cannot draw one. Every character spent on a coordinate is a character not spent on the system that produces coordinates. What survives compression is never the picture; it is the rule that reconstructs the picture.

[fig|tsubuyaki]
*The program, running, with its whole source underneath it. Nothing between the two — the text is not a description of the image, it is the image's only cause.*

Forty thousand samples, one index. Two latent coordinates fall out of it by division and remainder, and their distance from the centre sets a phase that turns faster the further out it goes — so the same body reads as tight shells at the rim and open cavities near the core. Alternate samples are pushed to the opposite phase, which is why the mass has two interleaved halves that never quite agree.

Nothing about the form is described anywhere. It is recomputed every frame from the six lines above, which is the only reason it fits.

> [aside|the honest part]
> The posted artifact is p5.js. What runs on this page is the same arithmetic ported to plain canvas, because loading a megabyte of library to execute 280 bytes of program would be a poor joke. Same constants, same organism; the port accumulates into a pixel buffer instead of making forty thousand draw calls, so the dense regions saturate slightly brighter than p5 renders them.
