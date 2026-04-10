#!/usr/bin/env python3
"""Generate app icon and splash icon for 立委持股追蹤"""

from PIL import Image, ImageDraw, ImageFont
import math
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))


def create_gradient(size, color1, color2):
    """Create a linear gradient image from top-left to bottom-right."""
    img = Image.new("RGBA", (size, size))
    draw = ImageDraw.Draw(img)

    r1, g1, b1 = color1
    r2, g2, b2 = color2

    for y in range(size):
        # Diagonal gradient
        t = y / size
        r = int(r1 + (r2 - r1) * t)
        g = int(g1 + (g2 - g1) * t)
        b = int(b1 + (b2 - b1) * t)
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))

    return img


def draw_rounded_rect(draw, bbox, radius, fill):
    """Draw a rounded rectangle."""
    x0, y0, x1, y1 = bbox
    draw.rectangle([x0 + radius, y0, x1 - radius, y1], fill=fill)
    draw.rectangle([x0, y0 + radius, x1, y1 - radius], fill=fill)
    draw.pieslice([x0, y0, x0 + 2 * radius, y0 + 2 * radius], 180, 270, fill=fill)
    draw.pieslice([x1 - 2 * radius, y0, x1, y0 + 2 * radius], 270, 360, fill=fill)
    draw.pieslice([x0, y1 - 2 * radius, x0 + 2 * radius, y1], 90, 180, fill=fill)
    draw.pieslice([x1 - 2 * radius, y1 - 2 * radius, x1, y1], 0, 90, fill=fill)


def draw_bar_chart(draw, cx, cy, chart_width, chart_height, color, bar_width_ratio=0.15):
    """Draw a simple bar chart icon."""
    bar_heights = [0.4, 0.6, 0.45, 0.75, 0.55, 0.9]
    num_bars = len(bar_heights)
    total_bar_width = chart_width * 0.8
    bar_w = total_bar_width / num_bars * 0.65
    gap = total_bar_width / num_bars * 0.35
    start_x = cx - total_bar_width / 2

    for i, h in enumerate(bar_heights):
        bx = start_x + i * (bar_w + gap)
        bar_h = chart_height * h
        by = cy + chart_height / 2 - bar_h
        # Rounded top bars
        r = bar_w * 0.25
        draw_rounded_rect(draw, [bx, by, bx + bar_w, cy + chart_height / 2], r, fill=color)


def draw_trend_line(draw, cx, cy, width, height, color, line_width=4):
    """Draw an upward trending line with some variation."""
    points = [
        (0.0, 0.7),
        (0.15, 0.55),
        (0.3, 0.65),
        (0.5, 0.4),
        (0.7, 0.45),
        (0.85, 0.2),
        (1.0, 0.1),
    ]
    start_x = cx - width / 2
    start_y = cy - height / 2

    scaled = [(start_x + p[0] * width, start_y + p[1] * height) for p in points]

    for i in range(len(scaled) - 1):
        draw.line([scaled[i], scaled[i + 1]], fill=color, width=line_width)

    # Arrow head at end
    ex, ey = scaled[-1]
    arrow_size = line_width * 3
    draw.polygon(
        [
            (ex + arrow_size * 0.5, ey - arrow_size * 0.3),
            (ex - arrow_size * 0.5, ey - arrow_size),
            (ex - arrow_size * 0.8, ey + arrow_size * 0.2),
        ],
        fill=color,
    )


def draw_building(draw, cx, cy, bw, bh, color):
    """Draw a simple government building silhouette (dome + columns)."""
    # Base
    base_y = cy + bh * 0.3
    draw.rectangle([cx - bw / 2, base_y, cx + bw / 2, cy + bh / 2], fill=color)

    # Columns
    num_cols = 5
    col_w = bw * 0.06
    col_spacing = bw * 0.8 / (num_cols - 1)
    col_start_x = cx - bw * 0.4
    col_top = cy - bh * 0.05
    col_bot = base_y

    for i in range(num_cols):
        x = col_start_x + i * col_spacing
        draw.rectangle([x - col_w / 2, col_top, x + col_w / 2, col_bot], fill=color)

    # Triangular pediment
    tri_top = cy - bh * 0.2
    draw.polygon(
        [
            (cx - bw * 0.5, col_top),
            (cx, tri_top),
            (cx + bw * 0.5, col_top),
        ],
        fill=color,
    )

    # Dome
    dome_r = bw * 0.12
    draw.ellipse(
        [cx - dome_r, tri_top - dome_r * 1.8, cx + dome_r, tri_top],
        fill=color,
    )


def generate_icon(size, output_path):
    """Generate the main app icon."""
    # Gradient background
    color1 = (102, 126, 234)  # #667eea
    color2 = (118, 75, 162)   # #764ba2

    img = create_gradient(size, color1, color2)
    draw = ImageDraw.Draw(img)

    # Add subtle rounded rectangle mask effect (for iOS style)
    # We'll just keep the square since App Store applies its own mask

    margin = size * 0.12
    content_size = size - 2 * margin
    cx = size / 2
    cy = size / 2

    white = (255, 255, 255, 255)
    white_semi = (255, 255, 255, 180)

    # Draw bar chart in the center-lower area
    chart_cx = cx
    chart_cy = cy + size * 0.08
    chart_w = content_size * 0.7
    chart_h = content_size * 0.45
    draw_bar_chart(draw, chart_cx, chart_cy, chart_w, chart_h, white_semi)

    # Draw trend line overlay (going up)
    line_cy = cy - size * 0.02
    line_w = content_size * 0.7
    line_h = content_size * 0.4
    draw_trend_line(draw, cx, line_cy, line_w, line_h, white, line_width=max(4, size // 80))

    # Draw small building at top
    bld_cx = cx
    bld_cy = cy - size * 0.25
    bld_w = content_size * 0.3
    bld_h = content_size * 0.18
    draw_building(draw, bld_cx, bld_cy, bld_w, bld_h, white)

    # Try to add "立" character
    try:
        # Try system CJK fonts on macOS
        font_paths = [
            "/System/Library/Fonts/PingFang.ttc",
            "/System/Library/Fonts/STHeiti Medium.ttc",
            "/System/Library/Fonts/Hiragino Sans GB.ttc",
            "/Library/Fonts/Arial Unicode.ttf",
        ]
        font = None
        font_size = int(size * 0.12)
        for fp in font_paths:
            if os.path.exists(fp):
                try:
                    font = ImageFont.truetype(fp, font_size)
                    break
                except Exception:
                    continue

        if font:
            text = "立"
            bbox = draw.textbbox((0, 0), text, font=font)
            tw = bbox[2] - bbox[0]
            th = bbox[3] - bbox[1]
            tx = cx - tw / 2
            ty = cy + size * 0.32
            draw.text((tx, ty), text, fill=white, font=font)
    except Exception:
        pass  # Skip text if fonts unavailable

    img = img.convert("RGB")
    img.save(output_path, "PNG")
    print(f"Saved {size}x{size} icon to {output_path}")


def generate_splash_icon(size, output_path):
    """Generate the splash screen icon (simpler, on transparent bg)."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Draw a rounded square background
    padding = int(size * 0.05)
    radius = int(size * 0.18)
    color1 = (102, 126, 234)
    color2 = (118, 75, 162)

    # Simple gradient fill for the rounded rect
    bg = create_gradient(size, color1, color2)
    # Create mask for rounded rect
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    draw_rounded_rect(mask_draw, [padding, padding, size - padding, size - padding], radius, fill=255)
    img.paste(bg, (0, 0), mask)

    draw = ImageDraw.Draw(img)

    cx = size / 2
    cy = size / 2
    content = size * 0.7
    white = (255, 255, 255, 255)
    white_semi = (255, 255, 255, 160)

    # Bar chart
    draw_bar_chart(draw, cx, cy + size * 0.06, content * 0.65, content * 0.4, white_semi)

    # Trend line
    draw_trend_line(draw, cx, cy - size * 0.02, content * 0.65, content * 0.35, white, line_width=max(2, size // 60))

    # Building
    draw_building(draw, cx, cy - size * 0.2, content * 0.28, content * 0.16, white)

    img.save(output_path, "PNG")
    print(f"Saved {size}x{size} splash icon to {output_path}")


if __name__ == "__main__":
    icon_path = os.path.join(SCRIPT_DIR, "icon.png")
    splash_path = os.path.join(SCRIPT_DIR, "splash-icon.png")

    generate_icon(1024, icon_path)
    generate_splash_icon(200, splash_path)

    print("Done!")
