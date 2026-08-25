---
name: signal-geometry
description: Create Signal Geometry posters for toni.ltd — 4:5 light paper for writing, wordless, one spatial event. Use for per-essay posters, work covers, play tiles, OG images, or prompt-only recipes.
---

# Signal Geometry

Translate one idea into one precise spatial behavior, then render it as a sparse geometric system on warm matte paper. Generate the image by default when the required capabilities are available; otherwise return the compiled prompt and recipe.

This copy is vendored into geometry (toni.ltd). House constraints below override the upstream CaliCastle defaults.

## House constraints

### Surfaces (do not invent a ratio)

| Request | Canvas | Why |
| --- | --- | --- |
| **per-essay poster** (default) | `4:5` | Home writing stamps are 4:5 on the right (160×200 featured, 112×140 rows). |
| work cover | `3:2` | Cover cards are ~312×220 with `object-fit: cover`. One tall card is closer to `2:3` — compose the event so a center crop still reads. |
| play tile | `3:4` | Play plates are `3:4` (210×280). |
| OG | `1200×630` (~`1.91:1`) | `public/og.jpg` |
| in-essay plate | `16:9` | Essay measure is 640px. Not the writing stamp. |

The image generator has no `4:5`. For writing posters generate at `3:4` (nearest native), keep the event in the vertical center, then crop to exact `4:5` before saving. Do not ask the generator for `4:5`.

### Material

- **Polarity: light.** Paper is `#faf8f5`, ink is `#2a2824`. Dark Signal Geometry stills read as holes in the page; `essayModel.ts` already rejects them as in-essay plates. Dark only for work/play when the surface has a dark title veil, and never for writing posters.
- **Stock:** warm uncoated paper matching `#faf8f5` / plate `#fbf8f1`. Not cool gallery white, not charcoal.
- **Accent:** one pin of sienna `#a0522d` or mark `#d36b41`, covering less than about 0.2% of the canvas. Never cobalt. Never coral-for-its-own-sake. Grayscale with no accent is valid.
- **Text: none.** Titles, tags, captions, and dates are HTML. Never put the essay title on the image.
- **Crop safety:** writing posters are generated at `3:4` and cropped to `4:5`. Keep the spatial event in the vertical center. QA at **160×200** (featured) and **112×140** (list), not only at a generic thumbnail.

### Save path

Project-bound renders go to `public/visuals/{id}.jpg` (essay id, work id, or `og`). One unique topology per id. Do not reuse `gated-streamlines`, `relay-constellations`, or `threshold-release` as another essay's poster.

### Which skill

| Need | Skill |
| --- | --- |
| Essay poster, play tile, OG | this skill |
| Work cover, chalkboard explanation | `chalk-logic` |

## Visual identity

Build every image from these invariants:

- **One event:** express one relationship such as orbit, convergence, divergence, compression, deflection, propagation, oscillation, filtering, enclosure, or release. On this site, prefer the essay's own operator: cut, edge, loop, drift, contact, re-entry, weaken, rotate, harden, omit, gate, return.
- **Quiet field:** let the motif span the composition when useful while keeping actual mark density low. Aim for roughly 70%-95% quiet background and 2%-8% line, dot, hatch, or mesh coverage.
- **Light paper:** warm off-white stock, full-frame, flat, uncoated, with fine irregular grain and faint fibers. Visible at full size, quiet at 172px. No borders, mockup depth, edge shadows, stains, tears, or vintage distress.
- **Precision marks:** hairlines, arcs, dots, nodes, particles, restrained hatching, grids, or wireframe meshes. Three-step contrast: faint scaffold, readable structure, very few bright anchors.
- **Restrained color:** grayscale plus at most one sienna or mark pin.
- **Editorial finish:** crisp, orthographic, calm, analytical, slightly speculative. Topology, rhythm, scale, and transformation create interest — not atmosphere.

Use the reference set to anchor geometry, spacing, hierarchy, restraint, and matte material. Treat dark examples as mark-quality only, not as polarity to copy.

## Grammar families

Choose one primary family. Add at most one subordinate mark language when the relationship needs it.

| Family | Best for | Primary marks |
| --- | --- | --- |
| Orbital field | cycles, gravity, recurrence, scale, mutual influence | circles, arcs, radial ticks, loops, spherical meshes |
| Flow transformation | emergence, routing, filtering, pressure, change | streamlines, particles, arrows, gates, obstacles |
| Signal strip | rhythm, cadence, phases, comparison, accumulation | waveforms, lanes, bars, repeated measures, faint grids |
| Topology map | relationships, context, systems, dependencies | nodes, edges, frames, sparse modules |
| Layered field | tension, thresholds, overlap, latent depth | ruled planes, hatching, contours, wireframe surfaces |

## Workflow

### 1. Lock the brief

Identify the concept, emotional temperature, destination (table above), polarity, text policy, and execution mode. Infer only values the user left open, using house defaults: `4:5` writing poster, light, wordless, rendered.

For a per-essay poster, read `content/writing/{id}.md` (or the matching cluster file) and take the spatial proposition from the essay's operator, not from its title.

Set execution mode to `rendered` only when image generation and image inspection capabilities are both available. Use `prompt-only` when the user requests it or either capability is unavailable.

Completion criterion: destination, ratio, polarity, text, concept, and mode are explicit.

### 2. Distill the spatial proposition

Turn the concept into one transformation verb and one primary grammar family. Write one internal visual sentence that states what moves, changes, or relates to what. Prefer abstract relations over illustrated nouns.

Completion criterion: the image can be described in one sentence without listing unrelated objects or multiple events.

### 3. Lock quality anchors

Read [references/example-index.md](references/example-index.md) and select one or two matching entries. Inspect each linked image when image inspection is available; otherwise use the entry description as the quality anchor. For every selected anchor, record one anchor delta:

- three invariants to preserve;
- three axes to change across format, topology, composition, viewpoint, polarity, motion, scaffold, or accent.

Use the examples as quality anchors, not layouts. Do not pass sample filenames, provenance, cobalt/coral from the samples, or sample-specific content into the image prompt.

Completion criterion: every selected anchor has a three-invariant, three-axis anchor delta, and the planned composition satisfies each delta.

### 4. Declare the recipe

Choose exactly one value for each axis:

- format: `4:5` (writing), `3:4` (play or generator canvas), `3:2`, `16:9`, `1:1`, or `1200×630`;
- polarity: light (default) or dark;
- family: orbital, flow, signal, topology, or layered;
- transformation: one active verb;
- geometry: radial, bilateral, directional, paired, distributed, or vertically staged;
- scaffold: open field, faint grid, framed region, or baseline;
- anchor: off-white endpoint, central node, contrast line, structural void, or none;
- accent: none, sienna, or mark;
- text: none.

Completion criterion: all nine axes have one declared choice and support the same spatial proposition.

### 5. Compile the image prompt

Write four compact paragraphs containing only information that should become pixels:

1. State canvas, ratio, light warm paper `#faf8f5`, and quiet-space target.
2. State the spatial proposition, family, transformation, geometry, and focal placement (vertical center of a tall 4:5 field).
3. State mark vocabulary, three-tier contrast, optional sienna/mark micro-accent, and zero text.
4. State the flat editorial finish and the rejection constraints below.

Make the prompt decisive about position, scale, line density, and hierarchy. Keep analysis notes, recipes, filenames, and provenance outside the prompt.

Completion criterion: the prompt answers all four fields, contains one visual event, and obeys the text gate.

When execution mode is `prompt-only`, stop here. Return the exact compiled prompt and the complete recipe from Step 4 with status `PROMPT_ONLY`; skip generation and image QA. Add one concise capability note outside the prompt only when the mode is a fallback.

### 6. Generate one candidate

Use the built-in image generation capability at the recipe ratio. If the user supplied an image, use it only for the requested content or structural cue while preserving this visual identity.

Completion criterion: one inspectable candidate exists at the requested ratio.

### 7. Inspect and repair

View the candidate at full size, at 160×200, and at 112×140 before presenting it. Check every critical gate below. Treat the first render as a candidate, not an automatic final.

If any gate fails, read [references/repair-playbook.md](references/repair-playbook.md), identify the single largest defect, tighten only the relevant prompt fields, and regenerate once.

Completion criterion: every critical gate passes. If the repaired candidate still misses a gate, label the result `DONE_WITH_CONCERNS` and name the remaining defect.

### 8. Deliver

Show the accepted image first, followed by the exact final prompt and the complete recipe from Step 4 plus status. Save project-bound images to `public/visuals/{id}.jpg`. Return no attribution or provenance note.

Completion criterion: the user receives the accepted image, its exact prompt, its recipe, and a saved path when the file was written.

## Critical gates

Require all of the following:

- Correct house ratio for the destination, composed for that ratio (not a crop of a different poster).
- One legible spatial event and one primary family.
- Quiet background remains dominant even when the motif spans most of the frame.
- Warm matte paper grain is visible up close without becoming distressed or decorative.
- Light polarity with three distinct contrast levels (unless dark was explicitly requested for a veiled cover).
- Fine marks remain coherent, separated, and intentional.
- Color, when used, is one tiny sienna or mark event.
- Zero text, letters, numerals, watermarks, or pseudo-text.
- The event survives a 4:5 crop of a 3:4 canvas and remains legible at 112px.
- The image does not read as a dark hole on `#faf8f5`.
- Every recorded anchor delta passes.

Reject candidates that resolve into a dashboard, infographic, product screen, sci-fi HUD, colorful data visualization, generic gradient blob, photographic scene, character illustration, collage, aged zine, glossy 3D render, chalkboard, or recognizable copy of a reference composition.

## Output shape

For `PROMPT_ONLY`, omit the Image section.

````markdown
**Image**

![Signal Geometry illustration](absolute-image-path-or-rendered-image)

**Final prompt**

```text
[exact prompt used for the accepted image]
```

**Recipe**

- Format: [ratio]
- Polarity: [light/dark]
- Family: [family]
- Transformation: [verb]
- Geometry: [choice]
- Scaffold: [choice]
- Anchor: [choice/none]
- Accent: [none/sienna/mark]
- Text: none
- Path: [public/visuals/{id}.jpg or omitted]
- Status: [DONE/DONE_WITH_CONCERNS/PROMPT_ONLY]
````
