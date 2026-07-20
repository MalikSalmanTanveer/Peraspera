"""Generate favicon.png and favicon.svg with rounded corners (ChatGPT-style squircle)."""

from __future__ import annotations

import base64
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "favicon.png"
OUTPUT_PNG = ROOT / "public" / "favicon.png"
OUTPUT_SVG = ROOT / "public" / "favicon.svg"
SIZE = 512
CORNER_RATIO = 0.22


def rounded_favicon(source: Path, size: int = SIZE, corner_ratio: float = CORNER_RATIO) -> Image.Image:
    original = Image.open(source).convert("RGBA")
    original = original.resize((size, size), Image.Resampling.LANCZOS)

    radius = round(size * corner_ratio)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size, size), radius=radius, fill=255)

    output = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    output.paste(original, (0, 0), mask=mask)
    return output


def write_svg(image: Image.Image, destination: Path) -> None:
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
    radius = round(SIZE * CORNER_RATIO)
    destination.write_text(
        f"""<svg xmlns="http://www.w3.org/2000/svg" width="{SIZE}" height="{SIZE}" viewBox="0 0 {SIZE} {SIZE}">
  <defs>
    <clipPath id="rounded">
      <rect width="{SIZE}" height="{SIZE}" rx="{radius}" ry="{radius}"/>
    </clipPath>
  </defs>
  <image href="data:image/png;base64,{encoded}" width="{SIZE}" height="{SIZE}" clip-path="url(#rounded)"/>
</svg>
""",
        encoding="utf-8",
    )


def main() -> None:
    backup = SOURCE.read_bytes()
    try:
        icon = rounded_favicon(SOURCE)
        icon.save(OUTPUT_PNG, format="PNG", optimize=True)
        write_svg(icon, OUTPUT_SVG)
        print(f"Wrote {OUTPUT_PNG} and {OUTPUT_SVG} ({SIZE}x{SIZE}, radius {round(SIZE * CORNER_RATIO)}px)")
    except Exception:
        OUTPUT_PNG.write_bytes(backup)
        raise


if __name__ == "__main__":
    main()
