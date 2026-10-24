"""Rebuild the static fonts in fonts/ from the site's own variable fonts.

Only needed if the infographic design changes (a different weight, say).
Normal use of the infographic tool does not need Python at all.

One-off setup, then run from scripts/infographics/:
    python3 -m venv .venv
    ./.venv/bin/pip install fonttools brotli
    ./.venv/bin/python build-fonts.py [output-folder]

Fonts used (measured against the original infographic):
    Source Sans 3   weight 800 (title, footer) and 700 (numerals)
    Source Serif 4  weight 400, optical size 20 (the five list lines)
Both are SIL Open Font Licence, taken from the @fontsource-variable packages
that the website already installs.
"""
import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

FILES = Path("../../website/node_modules/@fontsource-variable")
SANS = FILES / "source-sans-3/files/source-sans-3-latin-wght-normal.woff2"
SERIF = FILES / "source-serif-4/files/source-serif-4-latin-opsz-normal.woff2"
out = Path(sys.argv[1] if len(sys.argv) > 1 else "fonts")
out.mkdir(exist_ok=True)


def make(src, axes, name):
    font = TTFont(src)
    font.flavor = None  # WOFF2 -> plain TrueType
    instancer.instantiateVariableFont(font, axes, inplace=True)
    font.save(out / name)
    print("wrote", out / name)


make(SANS, {"wght": 800}, "SourceSans3-800.ttf")
make(SANS, {"wght": 700}, "SourceSans3-700.ttf")
make(SERIF, {"wght": 400, "opsz": 20}, "SourceSerif4-Text-400.ttf")
