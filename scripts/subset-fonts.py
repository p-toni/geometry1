#!/usr/bin/env python3
"""Cut Junicode down to the site.

Junicode is a medievalist's font: 5,980 glyphs, 3,483 codepoints, 199 OpenType
features including 99 character variants, 20 stylesets, runic and insular sets,
ornaments and swashes. toni.ltd is an English editorial site. It was shipping
2.3 MB of that on every page — more than the images, the script and the CSS
combined — to render Latin prose.

    Roman   1,141 KB -> 254 KB
    Italic  1,186 KB -> 260 KB

Verified pixel-identical against the unsubset original across a full essay
render (18.5M pixels, zero differing). Re-run this after any Junicode upgrade.

Upstream originals: https://github.com/psb1558/Junicode-font (releases)
Place JunicodeVF-Roman.woff2 and JunicodeVF-Italic.woff2 in --src, then:

    python3 scripts/subset-fonts.py --src ~/Downloads/junicode --out public/fonts

Requires: pip install fonttools brotli
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer


def rng(a: int, b: int) -> set[int]:
    return set(range(a, b + 1))


# Kept deliberately wider than today's corpus, which uses only 133 codepoints.
# Subsetting to exactly what is written today breaks the next essay silently —
# and a missing glyph is the kind of absence that has no rendering.
KEEP = (
    rng(0x0020, 0x007E)  # Basic Latin
    | rng(0x00A0, 0x00FF)  # Latin-1 Supplement — accented names, ©, £, §, ·
    | rng(0x0100, 0x017F)  # Latin Extended-A — ł, č, ś in names
    | rng(0x0370, 0x03FF)  # Greek — the corpus borrows notation (θ, κ, Δ, Σ)
    | rng(0x2000, 0x206F)  # General Punctuation — dashes, quotes, primes, dagger
    | rng(0x20A0, 0x20BF)  # Currency
    | rng(0x2100, 0x214F)  # Letterlike — №, ℓ, ™
    | rng(0x2190, 0x21FF)  # Arrows — the operator-ladder habit is core to the voice
    | rng(0x2200, 0x22FF)  # Math operators — ≤ ≥ ≈ ≠ ∞ −
)

# The stylesheet asks for kern, liga and tabular-nums. The rest are either
# layout-essential (composition, mark attachment, localisation) or the numeric
# family a serif may still want. Everything else goes: the 99 cvXX variants,
# the 20 ssXX stylesets, small caps, swashes, ornaments, and the aalt/salt/nalt
# alternate machinery — a toolkit this site has never once reached for.
FEATURES = "kern,liga,clig,calt,ccmp,mark,mkmk,locl,rlig,tnum,lnum,onum,pnum,frac,sups"

# `wght` and `wdth` are both declared in fonts.css and must survive as ranges.
# `ENLA` (enlarge) is never varied, so it is pinned at its default, which drops
# the axis and every gvar delta behind it.
PIN = {"ENLA": 0}

FACES = ("JunicodeVF-Roman", "JunicodeVF-Italic")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", type=Path, required=True, help="dir holding the originals")
    ap.add_argument("--out", type=Path, required=True, help="dir to write subsets into")
    ap.add_argument("--work", type=Path, default=Path("/tmp/junicode-subset"))
    args = ap.parse_args()
    args.work.mkdir(parents=True, exist_ok=True)
    args.out.mkdir(parents=True, exist_ok=True)

    unicodes = ",".join(f"{c:04X}" for c in sorted(KEEP))

    for face in FACES:
        src = args.src / f"{face}.woff2"
        if not src.exists():
            print(f"missing {src}", file=sys.stderr)
            return 1
        before = src.stat().st_size

        ttf = args.work / f"{face}.ttf"
        TTFont(src, fontNumber=0).save(ttf)

        # Subset before instancing. Compiling the full GPOS after instancing
        # overflows in fontTools on the italic; shrinking first avoids it.
        stage = args.work / f"{face}-subset.ttf"
        subprocess.run(
            [
                sys.executable, "-m", "fontTools.subset", str(ttf),
                f"--unicodes={unicodes}",
                f"--layout-features={FEATURES}",
                "--name-IDs=0,1,2,3,4,5,6",
                f"--output-file={stage}",
            ],
            check=True,
        )

        font = instancer.instantiateVariableFont(TTFont(stage), PIN, inplace=True)
        font.flavor = "woff2"
        dest = args.out / f"{face}.woff2"
        font.save(dest)

        after = dest.stat().st_size
        kept = set(TTFont(dest).getBestCmap())
        print(
            f"{face}: {before/1024:,.0f} KB -> {after/1024:,.0f} KB "
            f"({100 - after/before*100:.0f}% off), {len(kept)} codepoints, "
            f"axes {[a.axisTag for a in TTFont(dest)['fvar'].axes]}"
        )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
