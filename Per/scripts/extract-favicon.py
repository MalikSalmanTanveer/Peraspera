"""Extract PNG from favicon.svg and generate favicon assets for Google Search."""
import base64
import io
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "public"
svg = (ROOT / "favicon.svg").read_text(encoding="utf-8")
match = re.search(r"base64,([^\"']+)", svg)
if not match:
    raise SystemExit("no base64 in svg")

png_bytes = base64.b64decode(match.group(1))
(ROOT / "favicon.png").write_bytes(png_bytes)
print("wrote favicon.png", len(png_bytes))

from PIL import Image

img = Image.open(io.BytesIO(png_bytes)).convert("RGBA")
for size in (16, 32, 48):
    img.resize((size, size), Image.Resampling.LANCZOS).save(
        ROOT / f"favicon-{size}x{size}.png", format="PNG", optimize=True
    )
img.resize((180, 180), Image.Resampling.LANCZOS).save(
    ROOT / "apple-touch-icon.png", format="PNG", optimize=True
)
img.resize((192, 192), Image.Resampling.LANCZOS).save(
    ROOT / "android-chrome-192x192.png", format="PNG", optimize=True
)
img.resize((512, 512), Image.Resampling.LANCZOS).save(
    ROOT / "android-chrome-512x512.png", format="PNG", optimize=True
)
ico_sizes = [(16, 16), (32, 32), (48, 48)]
ico_imgs = [img.resize(s, Image.Resampling.LANCZOS) for s in ico_sizes]
ico_imgs[0].save(ROOT / "favicon.ico", format="ICO", sizes=ico_sizes)
print("wrote favicon.ico and sized PNGs")
