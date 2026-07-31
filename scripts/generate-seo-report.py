from __future__ import annotations

import math
import re
import urllib.request
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "output" / "pdf"
FONT_DIR = OUT_DIR / "fonts"
PDF_PATH = OUT_DIR / "logos-international-seo-geo-aeo-report.pdf"
SITE_URL = "logosae.com"
REPORT_DATE = "July 2026"

INK = colors.HexColor("#12110F")
MUTED = colors.HexColor("#65615B")
LINE = colors.HexColor("#DED8CA")
SOFT = colors.HexColor("#F4F1EA")
BLACK = colors.HexColor("#000000")
WHITE = colors.white
ACCENT = colors.HexColor("#A93F25")
GOLD = colors.HexColor("#B18A45")
GREEN = colors.HexColor("#385B46")
BLUE = colors.HexColor("#315C78")


def download_font(name: str, urls: list[str]) -> Path | None:
    FONT_DIR.mkdir(parents=True, exist_ok=True)
    destination = FONT_DIR / f"{name}.ttf"
    if destination.exists() and destination.stat().st_size > 20_000:
        return destination

    for url in urls:
        try:
            urllib.request.urlretrieve(url, destination)
            if destination.stat().st_size > 20_000:
                return destination
        except Exception:
            continue
    return None


def register_fonts() -> tuple[str, str]:
    dm_sans = download_font(
        "DMSans",
        [
            "https://github.com/google/fonts/raw/main/ofl/dmsans/static/DMSans-Regular.ttf",
            "https://github.com/google/fonts/raw/main/ofl/dmsans/DMSans%5Bopsz%2Cwght%5D.ttf",
        ],
    )
    manrope = download_font(
        "Manrope",
        [
            "https://github.com/google/fonts/raw/main/ofl/manrope/static/Manrope-Regular.ttf",
            "https://github.com/google/fonts/raw/main/ofl/manrope/Manrope%5Bwght%5D.ttf",
        ],
    )

    try:
        if dm_sans:
            pdfmetrics.registerFont(TTFont("DMSans", str(dm_sans)))
        if manrope:
            pdfmetrics.registerFont(TTFont("Manrope", str(manrope)))
    except Exception:
        return "Helvetica-Bold", "Helvetica"

    return ("DMSans" if dm_sans else "Helvetica-Bold", "Manrope" if manrope else "Helvetica")


TITLE_FONT, BODY_FONT = register_fonts()


def read_products() -> list[dict[str, str | int]]:
    source = (ROOT / "src" / "data" / "products.ts").read_text(encoding="utf-8")
    matches = re.finditer(
        r'\{\s*id:\s*(\d+),\s*name:\s*"([^"]+)",\s*category:\s*"([^"]+)",[\s\S]*?description:\s*"([^"]*)"',
        source,
    )
    return [
        {"id": int(match.group(1)), "name": match.group(2), "category": match.group(3), "description": match.group(4)}
        for match in matches
    ]


PRODUCTS = read_products()
CATEGORIES = sorted({str(product["category"]) for product in PRODUCTS})
BASE_ROUTES = 8
REGIONAL_ROUTES = 11
INDUSTRY_ROUTES = 6
TOTAL_ROUTES = BASE_ROUTES + REGIONAL_ROUTES + INDUSTRY_ROUTES + len(CATEGORIES)


def footer(pdf: canvas.Canvas, page_no: int) -> None:
    width, _ = A4
    pdf.setStrokeColor(LINE)
    pdf.line(36, 34, width - 36, 34)
    pdf.setFillColor(MUTED)
    pdf.setFont(BODY_FONT, 8)
    pdf.drawString(36, 22, f"Logos International - Search Optimization Report - {REPORT_DATE}")
    pdf.drawRightString(width - 36, 22, f"Page {page_no}")


def wrap_text(text: str, max_chars: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if len(candidate) <= max_chars or not current:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def paragraph(pdf: canvas.Canvas, text: str, x: float, y: float, width_chars: int = 88, leading: float = 14, size: int = 10) -> float:
    pdf.setFont(BODY_FONT, size)
    pdf.setFillColor(INK)
    for line in wrap_text(text, width_chars):
        pdf.drawString(x, y, line)
        y -= leading
    return y


def heading(pdf: canvas.Canvas, text: str, x: float, y: float, size: int = 22) -> float:
    pdf.setFillColor(BLACK)
    pdf.setFont(TITLE_FONT, size)
    pdf.drawString(x, y, text)
    return y - size * 0.95


def label(pdf: canvas.Canvas, text: str, x: float, y: float) -> None:
    pdf.setFillColor(ACCENT)
    pdf.setFont(BODY_FONT, 8)
    pdf.drawString(x, y, text.upper())


def stat_box(pdf: canvas.Canvas, x: float, y: float, w: float, h: float, value: str, caption: str) -> None:
    pdf.setStrokeColor(LINE)
    pdf.setFillColor(WHITE)
    pdf.roundRect(x, y - h, w, h, 8, fill=1, stroke=1)
    pdf.setFillColor(BLACK)
    pdf.setFont(TITLE_FONT, 24)
    pdf.drawString(x + 14, y - 32, value)
    pdf.setFillColor(MUTED)
    pdf.setFont(BODY_FONT, 8.5)
    for idx, line in enumerate(wrap_text(caption, 22)[:2]):
        pdf.drawString(x + 14, y - 52 - idx * 11, line)


def bar_chart(pdf: canvas.Canvas, x: float, y: float, values: list[tuple[str, int, colors.Color]], max_value: int, title: str) -> None:
    pdf.setFillColor(BLACK)
    pdf.setFont(TITLE_FONT, 12)
    pdf.drawString(x, y, title)
    chart_y = y - 25
    for label_text, value, color in values:
        bar_width = 310 * value / max_value
        pdf.setFillColor(SOFT)
        pdf.roundRect(x + 128, chart_y - 7, 310, 14, 7, fill=1, stroke=0)
        pdf.setFillColor(color)
        pdf.roundRect(x + 128, chart_y - 7, bar_width, 14, 7, fill=1, stroke=0)
        pdf.setFillColor(INK)
        pdf.setFont(BODY_FONT, 9)
        pdf.drawString(x, chart_y - 3, label_text)
        pdf.drawRightString(x + 462, chart_y - 3, str(value))
        chart_y -= 24


def line_chart(pdf: canvas.Canvas, x: float, y: float, w: float, h: float, series: list[int], title: str, color: colors.Color) -> None:
    pdf.setFillColor(BLACK)
    pdf.setFont(TITLE_FONT, 12)
    pdf.drawString(x, y, title)
    top = y - 28
    pdf.setStrokeColor(LINE)
    pdf.rect(x, top - h, w, h, fill=0, stroke=1)
    for idx in range(1, 4):
        gy = top - h * idx / 4
        pdf.setStrokeColor(colors.HexColor("#ECE7DB"))
        pdf.line(x, gy, x + w, gy)
    max_value = max(series)
    points = []
    for idx, value in enumerate(series):
        px = x + idx * (w / (len(series) - 1))
        py = top - h + (value / max_value) * h
        points.append((px, py))
    pdf.setStrokeColor(color)
    pdf.setLineWidth(2)
    for first, second in zip(points, points[1:]):
        pdf.line(first[0], first[1], second[0], second[1])
    pdf.setFillColor(color)
    for px, py in points:
        pdf.circle(px, py, 2.5, fill=1, stroke=0)
    pdf.setLineWidth(1)
    pdf.setFillColor(MUTED)
    pdf.setFont(BODY_FONT, 8)
    pdf.drawString(x, top - h - 14, "Month 1")
    pdf.drawRightString(x + w, top - h - 14, "Month 12")
    pdf.drawRightString(x + w, top + 4, f"{max_value:,}")


def timeline(pdf: canvas.Canvas, x: float, y: float) -> None:
    rows = [
        ("Recrawl and indexing", 0.5, 1.5, ACCENT),
        ("Long-tail movement", 1, 3, GOLD),
        ("Category and local terms", 3, 8, GREEN),
        ("Competitive head terms", 6, 12, BLUE),
    ]
    pdf.setFillColor(BLACK)
    pdf.setFont(TITLE_FONT, 12)
    pdf.drawString(x, y, "Organic response timeline")
    start_y = y - 32
    axis_x = x + 150
    axis_w = 330
    pdf.setStrokeColor(LINE)
    pdf.line(axis_x, start_y + 18, axis_x + axis_w, start_y + 18)
    pdf.setFillColor(MUTED)
    pdf.setFont(BODY_FONT, 8)
    for month in [1, 3, 6, 9, 12]:
        mx = axis_x + (month / 12) * axis_w
        pdf.line(mx, start_y + 13, mx, start_y + 23)
        pdf.drawCentredString(mx, start_y + 30, f"M{month}")
    for idx, (name, start, end, color) in enumerate(rows):
        row_y = start_y - idx * 34
        pdf.setFillColor(INK)
        pdf.setFont(BODY_FONT, 9)
        pdf.drawString(x, row_y, name)
        sx = axis_x + (start / 12) * axis_w
        ex = axis_x + (end / 12) * axis_w
        pdf.setFillColor(SOFT)
        pdf.roundRect(axis_x, row_y - 5, axis_w, 12, 6, fill=1, stroke=0)
        pdf.setFillColor(color)
        pdf.roundRect(sx, row_y - 5, max(ex - sx, 14), 12, 6, fill=1, stroke=0)


def page_one(pdf: canvas.Canvas) -> None:
    width, height = A4
    pdf.setFillColor(WHITE)
    pdf.rect(0, 0, width, height, fill=1, stroke=0)
    label(pdf, "SEO / GEO / AEO", 48, height - 86)
    pdf.setFont(TITLE_FONT, 38)
    pdf.setFillColor(BLACK)
    pdf.drawString(48, height - 134, "Search Optimization")
    pdf.drawString(48, height - 178, "Report")
    pdf.setFont(BODY_FONT, 13)
    pdf.setFillColor(INK)
    pdf.drawString(48, height - 212, "Logos International - Work Completed & Realistic Organic Growth Outlook")
    pdf.setFillColor(MUTED)
    pdf.drawString(48, height - 236, f"{SITE_URL} - Prepared {REPORT_DATE}")
    y = paragraph(
        pdf,
        "This report documents the optimization work completed on the Logos International website and shows a realistic growth path for search engines, local discovery, and AI answer engines. The projections are planning scenarios, not guarantees.",
        48,
        height - 290,
        84,
        15,
        10,
    )
    stat_box(pdf, 48, y - 32, 150, 82, str(len(PRODUCTS)), "catalog products with internet-sourced visuals")
    stat_box(pdf, 216, y - 32, 150, 82, str(TOTAL_ROUTES), "static SEO routes and category pages")
    stat_box(pdf, 384, y - 32, 150, 82, "100+", "direct and adjacent competitors to outrank")
    footer(pdf, 1)


def page_two(pdf: canvas.Canvas) -> None:
    y = heading(pdf, "1. What Was Completed", 44, 790, 22)
    y = paragraph(
        pdf,
        "The site now has a deeper search architecture: static route metadata, 11 UAE and GCC regional pages, industry pages, catalog category pages, structured data, AI-readable discovery files, and a full visual layer for product cards and product modals.",
        44,
        y - 8,
    )
    bar_chart(
        pdf,
        58,
        y - 46,
        [
            ("Catalog products", len(PRODUCTS), ACCENT),
            ("Category pages", len(CATEGORIES), GOLD),
            ("Regional pages", REGIONAL_ROUTES, GREEN),
            ("Industry pages", INDUSTRY_ROUTES, BLUE),
            ("Discovery assets", 6, BLACK),
        ],
        max(len(PRODUCTS), 80),
        "Figure 1 - Optimization work completed, by item count",
    )
    y = 426
    label(pdf, "Classic SEO", 44, y)
    y = paragraph(
        pdf,
        f"{TOTAL_ROUTES} static routes support cleaner crawl paths for homepage, catalog, services, contact, coverage, industry, and category intent. Product schema uses quote-on-request language and now includes product image URLs.",
        44,
        y - 18,
        88,
    )
    label(pdf, "GEO - Generative Engine Optimization", 44, y - 14)
    y = paragraph(
        pdf,
        "The GEO layer gives answer engines clear entity facts: Sharjah location, UAE and GCC service areas, product categories, quote process, catalog data, and city-specific coverage pages for Sharjah, Dubai, Abu Dhabi, Ajman, Ras Al Khaimah and Fujairah plus GCC markets.",
        44,
        y - 32,
        88,
    )
    label(pdf, "AEO - Answer Engine Optimization", 44, y - 14)
    paragraph(
        pdf,
        "The AEO layer uses question-and-answer blocks, structured FAQ data, catalog summaries, llms.txt, llms-full.txt, answer-engine JSON, and geo-context JSON so AI systems can cite the business more reliably.",
        44,
        y - 32,
        88,
    )
    footer(pdf, 2)


def page_three(pdf: canvas.Canvas) -> None:
    y = heading(pdf, "2. Why Ranking Still Takes Time", 44, 790, 22)
    y = paragraph(
        pdf,
        "The work gives Logos International the right technical and content foundation, but organic ranking is not instant. The UAE and GCC supply market is crowded, with 100+ direct and adjacent supplier websites, directories, marketplaces, and local listings competing for the same PPE, safety, hardware, uniforms, printing, and industrial terms.",
        44,
        y - 8,
        88,
    )
    timeline(pdf, 58, y - 42)
    y = 430
    label(pdf, "Competitive reality", 44, y)
    y = paragraph(
        pdf,
        "The fastest wins usually come from long-tail searches such as specific product plus location. Broader terms like PPE supplier UAE, safety supplier Sharjah, or industrial supplies Dubai need more signals over time: backlinks, reviews, brand mentions, fresh category depth, and real buyer engagement.",
        44,
        y - 18,
        88,
    )
    label(pdf, "Practical expectation", 44, y - 14)
    paragraph(
        pdf,
        "Initial crawl/indexing movement can appear within days to weeks. Meaningful organic visibility is more commonly a three-to-eight-month compounding curve, while the most competitive head terms should be treated as a six-to-twelve-month campaign.",
        44,
        y - 32,
        88,
    )
    footer(pdf, 3)


def page_four(pdf: canvas.Canvas) -> None:
    y = heading(pdf, "3. Projected Analytics Scenario", 44, 790, 22)
    y = paragraph(
        pdf,
        "The following projection assumes the current SEO/GEO/AEO work remains live, the site is indexed correctly, and monthly maintenance adds authority signals through content, backlinks, citations, and buyer proof. It is a conservative planning scenario, not a promise.",
        44,
        y - 8,
        88,
    )
    impressions = [260, 380, 560, 820, 1180, 1600, 2150, 2850, 3650, 4600, 5650, 6900]
    clicks = [12, 18, 27, 39, 55, 74, 98, 126, 160, 202, 248, 305]
    inquiries = [0, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 10]
    line_chart(pdf, 54, y - 40, 218, 145, impressions, "Projected monthly search impressions", ACCENT)
    line_chart(pdf, 326, y - 40, 218, 145, clicks, "Projected monthly organic visits", BLUE)
    y2 = y - 246
    pdf.setFillColor(BLACK)
    pdf.setFont(TITLE_FONT, 12)
    pdf.drawString(54, y2, "Qualified inquiry projection")
    for idx, month in enumerate([1, 3, 6, 9, 12]):
        value = inquiries[month - 1]
        height = min(104, 8 + value * 9)
        x = 70 + idx * 82
        pdf.setFillColor(SOFT)
        pdf.roundRect(x, y2 - 122, 46, 104, 5, fill=1, stroke=0)
        pdf.setFillColor(GREEN)
        if value > 0:
            pdf.roundRect(x, y2 - 122, 46, height, 5, fill=1, stroke=0)
        pdf.setFillColor(INK)
        pdf.setFont(BODY_FONT, 9)
        pdf.drawCentredString(x + 23, y2 - 138, f"M{month}")
        pdf.setFont(TITLE_FONT, 12)
        label_y = y2 - 106 + height if value > 0 else y2 - 72
        pdf.drawCentredString(x + 23, label_y, str(value))
    paragraph(
        pdf,
        "Best-case outcomes improve when the business actively collects reviews, earns supplier citations, publishes proof-backed category content, and keeps product availability details current.",
        54,
        y2 - 176,
        80,
    )
    footer(pdf, 4)


def page_five(pdf: canvas.Canvas) -> None:
    y = heading(pdf, "4. Next 90 Days", 44, 790, 22)
    y = paragraph(
        pdf,
        "The website foundation is now much stronger. To keep moving toward top results organically, the next phase should focus on authority, freshness, and proof signals that competitors already have.",
        44,
        y - 8,
        88,
    )
    actions = [
        ("01", "Index and QA", "Submit sitemap, check route indexing, verify rich results, and monitor coverage in Search Console."),
        ("02", "Authority signals", "Build supplier citations, local business profiles, partner mentions, and relevant backlinks."),
        ("03", "Buyer proof", "Collect reviews, add real project/supply examples, and keep contact/quote details consistent."),
        ("04", "Content depth", "Add focused pages for high-value terms such as PPE Sharjah, uniforms UAE, N95 mask UAE, and marine paints GCC."),
    ]
    y -= 34
    for index, title, copy in actions:
        pdf.setFillColor(WHITE)
        pdf.setStrokeColor(LINE)
        pdf.roundRect(44, y - 74, 504, 62, 8, fill=1, stroke=1)
        pdf.setFillColor(ACCENT)
        pdf.setFont(TITLE_FONT, 15)
        pdf.drawString(62, y - 36, index)
        pdf.setFillColor(BLACK)
        pdf.setFont(TITLE_FONT, 12)
        pdf.drawString(106, y - 30, title)
        paragraph(pdf, copy, 106, y - 46, 74, 11, 8.5)
        y -= 78
    label(pdf, "Bottom line", 44, y - 8)
    paragraph(
        pdf,
        "The SEO, GEO, and AEO work gives Logos International a credible foundation to compete. It can help the website move upward, become easier for AI systems to cite, and generate more organic inquiries, but sustained ranking against 100+ competitors needs months of authority-building and consistent maintenance.",
        44,
        y - 26,
        88,
    )
    footer(pdf, 5)


def build_pdf() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(PDF_PATH), pagesize=A4)
    for page in [page_one, page_two, page_three, page_four, page_five]:
        page(pdf)
        pdf.showPage()
    pdf.save()
    print(PDF_PATH)


if __name__ == "__main__":
    build_pdf()
