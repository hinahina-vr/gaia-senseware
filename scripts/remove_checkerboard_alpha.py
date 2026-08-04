"""Remove ImageGen's baked checkerboard while preserving enclosed pale artwork."""

from collections import deque
from pathlib import Path
import sys

from PIL import Image
import numpy as np


def remove_checkerboard(source: Path, target: Path) -> None:
    rgb = np.asarray(Image.open(source).convert("RGB"))
    height, width, _ = rgb.shape

    channel_spread = rgb.max(axis=2) - rgb.min(axis=2)
    brightness = rgb.min(axis=2)
    background_like = (channel_spread <= 10) & (brightness >= 232)

    exterior = np.zeros((height, width), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    def seed(y: int, x: int) -> None:
        if background_like[y, x] and not exterior[y, x]:
            exterior[y, x] = True
            queue.append((y, x))

    for x in range(width):
        seed(0, x)
        seed(height - 1, x)
    for y in range(height):
        seed(y, 0)
        seed(y, width - 1)

    while queue:
        y, x = queue.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < height and 0 <= nx < width:
                if background_like[ny, nx] and not exterior[ny, nx]:
                    exterior[ny, nx] = True
                    queue.append((ny, nx))

    alpha = np.full((height, width), 255, dtype=np.uint8)
    alpha[exterior] = 0

    # Remove the remaining pale fringe immediately adjacent to true transparency.
    fringe_like = (channel_spread <= 18) & (brightness >= 222)
    for _ in range(2):
        adjacent = np.zeros_like(exterior)
        adjacent[1:] |= exterior[:-1]
        adjacent[:-1] |= exterior[1:]
        adjacent[:, 1:] |= exterior[:, :-1]
        adjacent[:, :-1] |= exterior[:, 1:]
        new_fringe = adjacent & fringe_like & ~exterior
        exterior |= new_fringe
        alpha[new_fringe] = 0

    rgba = np.dstack((rgb, alpha))
    Image.fromarray(rgba, "RGBA").save(target, optimize=True)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("usage: remove_checkerboard_alpha.py SOURCE TARGET")
    remove_checkerboard(Path(sys.argv[1]), Path(sys.argv[2]))
