import markdown
import re

parts = [
    "ai_agency_blueprint_part1.md",
    "ai_agency_blueprint_part2.md",
    "ai_agency_blueprint_part3.md",
]

part_labels = [
    "Positioning · Service Catalog · Business Model",
    "Bootstrapped Launch · India Acquisition · International",
    "Tech Stack · Team · Risks · Full Roadmap",
]

part_icons = ["📌", "🚀", "🛠"]

# Section metadata: (number, title, anchor, part_index)
all_sections = [
    (1,  "Positioning & Niche Selection",         "s1",  0),
    (2,  "Service Catalog",                        "s2",  0),
    (3,  "Business Model & Profit Maximization",   "s3",  0),
    (4,  "Bootstrapped Launch Plan",               "s4",  1),
    (5,  "Client Acquisition: India",              "s5",  1),
    (6,  "Client Acquisition: International",      "s6",  1),
    (7,  "Tools, Tech Stack & Skills",             "s7",  2),
    (8,  "Team & Scaling",                         "s8",  2),
    (9,  "Risks & Differentiation",                "s9",  2),
    (10, "The Full Roadmap",                       "s10", 2),
]

# Slugify helper
def slugify(text):
    text = re.sub(r'[^\w\s-]', '', text.lower())
    return re.sub(r'[\s]+', '-', text.strip())

# Read and convert each part; inject IDs into h2 tags
converted = []
for part_idx, fname in enumerate(parts):
    with open(fname, "r") as f:
        text = f.read()
    html = markdown.markdown(text, extensions=["tables", "fenced_code", "nl2br"])
    # Inject anchor IDs into <h2> tags for sections in this part
    for (num, title, anchor, pidx) in all_sections:
        if pidx == part_idx:
            # Match h2 containing a keyword from the title
            keyword = title.split()[1] if len(title.split()) > 1 else title.split()[0]
            html = re.sub(
                r'(<h2>)(.*?' + re.escape(keyword.split('&')[0].strip()) + r'.*?)(</h2>)',
                rf'<h2 id="{anchor}">\2</h2>',
                html, count=1, flags=re.IGNORECASE
            )
    converted.append(html)

sections_html = ""
for i, (html, label) in enumerate(zip(converted, part_labels)):
    sections_html += f"""
    <section id="part{i+1}" class="part-section">
      <div class="part-badge">{part_icons[i]} Part {i+1} of 3</div>
      <div class="part-subtitle">{label}</div>
      <div class="content">
        {html}
      </div>
    </section>
    """

# Section descriptions for the TOC table
section_descs = {
    "s1":  "Why agencies fail, universal problem strategy, 10 niche combos, validation checklist",
    "s2":  "Entry / Mid / Advanced service tiers with pricing (India & Intl), emerging skills to build",
    "s3":  "Business model comparison, pricing packages, unit economics to hit ₹1L/₹5L/₹10L/mo",
    "s4":  "What NOT to spend on, essential tools, week-by-week 90-day plan, credibility building",
    "s5":  "Master AI lead generation prompt (real leads), WhatsApp outreach scripts, LinkedIn tactics, FB groups, referral loops",
    "s6":  "Upwork strategy, LinkedIn cold outreach, cold email templates, Twitter/X, trust gap fixes",
    "s7":  "Must-learn tools (now vs later), non-technical skills, ops stack, legal MVS for India",
    "s8":  "Bhavya & Dhruv 2-person work division, AI-delegated roles, lean execution, when to hire, SOPs",
    "s9":  "Commoditization, client in-housing, API risk, regulatory — and how to build a real moat",
    "s10": "90-day milestones, 6-month goals, 12-month targets, the Year 1→2→3 mental model",
}

part_colors = ["#10b981", "#f59e0b", "#ec4899"]

# Build TOC as a full table
toc_rows = ""
for (num, title, anchor, pidx) in all_sections:
    icon = part_icons[pidx]
    color = part_colors[pidx]
    desc = section_descs.get(anchor, "")
    part_label_short = f"Part {pidx+1}"
    toc_rows += f"""
    <tr class="toc-row" onclick="scrollToAnchor('{anchor}')">
      <td class="toc-td-num"><span class="toc-num-badge">{num:02d}</span></td>
      <td class="toc-td-title">
        <div class="toc-section-title">{title}</div>
        <div class="toc-section-desc">{desc}</div>
      </td>
      <td class="toc-td-part"><span class="toc-part-pill" style="--pc:{color}">{icon} {part_label_short}</span></td>
      <td class="toc-td-link"><a href="#{anchor}" class="toc-go-btn">Jump →</a></td>
    </tr>
    """

toc_parts_html = toc_rows

# Build Sidebar Navigation HTML
sidebar_nav_html = ""
for pidx, (label, icon) in enumerate(zip(part_labels, part_icons)):
    items = [(n, t, a) for (n, t, a, p) in all_sections if p == pidx]
    items_html = ""
    for (num, title, anchor) in items:
        items_html += f"""
        <a href="#{anchor}" class="sidebar-item" data-anchor="{anchor}">
          <span class="sidebar-num">{num:02d}</span>
          <span class="sidebar-title">{title}</span>
        </a>
        """
    sidebar_nav_html += f"""
    <div class="sidebar-group">
      <div class="sidebar-group-title">{icon} Part {pidx+1}: {label}</div>
      <div class="sidebar-group-items">
        {items_html}
      </div>
    </div>
    """

full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>🚀 AI Agency Business Blueprint</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet"/>
<style>
  :root {{
    /* Dark Mode (Default) — Onyx & Cyber Emerald / Gold Amber */
    --bg: #08090d;
    --surface: #11121a;
    --surface2: #181a26;
    --border: #26293b;
    --text: #f3f4f6;
    --heading: #ffffff;
    --muted: #9ca3af;
    --subtle: #1f2130;

    --accent: #10b981;
    --accent-glow: rgba(16, 185, 129, 0.3);
    --accent2: #f59e0b;
    --accent3: #ec4899;
    --warn: #f59e0b;
    --danger: #ef4444;

    --hero-bg: radial-gradient(ellipse at top, #1c1d2e 0%, #08090d 70%);
    --hero-radial: radial-gradient(ellipse at center, rgba(16,185,129,0.18) 0%, transparent 60%);
    --hero-tag-bg: rgba(16, 185, 129, 0.14);
    --hero-tag-border: rgba(16, 185, 129, 0.4);
    --hero-tag-text: #6ee7b7;
    --hero-h1-gradient: linear-gradient(135deg, #ffffff 20%, #6ee7b7 60%, #fcd34d 100%);

    --nav-bg: rgba(8, 9, 13, 0.92);
    --banner-bg: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(245, 158, 11, 0.08));
    --banner-border: rgba(16, 185, 129, 0.35);
    --banner-title: #6ee7b7;

    --toc-header-bg: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(245, 158, 11, 0.1));
    --toc-badge-bg: #181a26;
    --toc-badge-color: #6ee7b7;
    --toc-row-hover: rgba(16, 185, 129, 0.1);

    --table-header-bg: #181a26;
    --table-header-color: #6ee7b7;
    --table-row-even: rgba(255, 255, 255, 0.015);
    --table-row-hover: rgba(16, 185, 129, 0.08);

    --code-bg: #141622;
    --code-color: #fcd34d;
    --inline-code-bg: rgba(16, 185, 129, 0.15);
    --inline-code-border: rgba(16, 185, 129, 0.3);
    --inline-code-color: #6ee7b7;

    --blockquote-bg: rgba(245, 158, 11, 0.08);
    --blockquote-border: #f59e0b;
    --blockquote-text: #e5e7eb;

    --h3-color: #6ee7b7;
    --p-color: #d1d5db;
  }}

  html[data-theme="light"] {{
    /* Light Mode — Warm Champagne & Emerald / Amber */
    --bg: #fcfbfa;
    --surface: #ffffff;
    --surface2: #f4f3f0;
    --border: #e5e3dd;
    --text: #27272a;
    --heading: #09090b;
    --muted: #71717a;
    --subtle: #e5e3dd;

    --accent: #059669;
    --accent-glow: rgba(5, 150, 105, 0.15);
    --accent2: #d97706;
    --accent3: #db2777;
    --warn: #d97706;
    --danger: #dc2626;

    --hero-bg: linear-gradient(135deg, #fef3c7, #ecfdf5, #fcfbfa);
    --hero-radial: radial-gradient(ellipse at center, rgba(5,150,105,0.12) 0%, transparent 60%);
    --hero-tag-bg: rgba(5, 150, 105, 0.1);
    --hero-tag-border: rgba(5, 150, 105, 0.3);
    --hero-tag-text: #047857;
    --hero-h1-gradient: linear-gradient(135deg, #09090b 30%, #047857 70%, #b45309 100%);

    --nav-bg: rgba(252, 251, 250, 0.94);
    --banner-bg: linear-gradient(135deg, rgba(5, 150, 105, 0.08), rgba(217, 119, 6, 0.06));
    --banner-border: rgba(5, 150, 105, 0.25);
    --banner-title: #047857;

    --toc-header-bg: linear-gradient(135deg, rgba(5, 150, 105, 0.12), rgba(217, 119, 6, 0.08));
    --toc-badge-bg: #f4f3f0;
    --toc-badge-color: #047857;
    --toc-row-hover: rgba(5, 150, 105, 0.06);

    --table-header-bg: #f4f3f0;
    --table-header-color: #047857;
    --table-row-even: rgba(244, 243, 240, 0.6);
    --table-row-hover: rgba(5, 150, 105, 0.05);

    --code-bg: #f4f3f0;
    --code-color: #b45309;
    --inline-code-bg: rgba(5, 150, 105, 0.08);
    --inline-code-border: rgba(5, 150, 105, 0.25);
    --inline-code-color: #047857;

    --blockquote-bg: rgba(217, 119, 6, 0.06);
    --blockquote-border: #d97706;
    --blockquote-text: #27272a;

    --h3-color: #047857;
    --p-color: #27272a;
  }}

  html {{
    scroll-behavior: smooth;
    scroll-padding-top: 85px;
  }}

  [id], h2, h3, section {{
    scroll-margin-top: 85px;
  }}

  * {{ margin: 0; padding: 0; box-sizing: border-box; }}

  body {{
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    line-height: 1.7;
    transition: background-color 0.3s ease, color 0.3s ease;
  }}

  /* ── Keyframe Animations & Effects ── */
  @keyframes pulseAura {{
    0%, 100% {{ opacity: 0.4; transform: scale(1); }}
    50% {{ opacity: 0.8; transform: scale(1.08); }}
  }}

  @keyframes shimmer {{
    0% {{ background-position: -200% 0; }}
    100% {{ background-position: 200% 0; }}
  }}

  /* ── Scroll Reveal Animation ── */
  .reveal {{
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }}
  .reveal.active {{
    opacity: 1;
    transform: translateY(0);
  }}

  /* ── Hero ── */
  .hero {{
    background: var(--hero-bg);
    padding: 80px 40px 60px;
    text-align: center;
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid var(--border);
  }}
  .hero::before {{
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: var(--hero-radial);
    pointer-events: none;
    animation: pulseAura 8s ease-in-out infinite;
  }}
  .hero-tag {{
    display: inline-block;
    background: var(--hero-tag-bg);
    border: 1px solid var(--hero-tag-border);
    color: var(--hero-tag-text);
    padding: 4px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 20px;
    box-shadow: 0 0 15px var(--accent-glow);
    transition: all 0.3s ease;
  }}
  .hero-tag:hover {{
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 0 25px var(--accent-glow);
  }}
  .hero h1 {{
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800;
    background: var(--hero-h1-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
  }}
  .hero p {{
    color: var(--muted);
    font-size: 1.1rem;
    max-width: 820px;
    margin: 0 auto 32px;
    line-height: 1.6;
  }}
  .hero-stats {{
    display: flex;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
    margin-top: 32px;
  }}
  .stat {{
    text-align: center;
    padding: 14px 28px;
    border-radius: 14px;
    background: var(--surface);
    border: 1px solid var(--border);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }}
  .stat:hover {{
    transform: translateY(-4px);
    box-shadow: 0 10px 25px var(--accent-glow);
    border-color: var(--accent);
  }}
  .stat-num {{
    font-size: 1.8rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }}
  .stat-label {{
    font-size: 0.75rem;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 1px;
  }}

  /* ── Nav ── */
  .nav {{
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--nav-bg);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 14px 40px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }}
  .nav a {{
    color: var(--muted);
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    padding: 6px 14px;
    border-radius: 6px;
    transition: all 0.2s;
    white-space: nowrap;
  }}
  .nav a:hover {{
    background: var(--subtle);
    color: var(--heading);
  }}

  /* ── Nav Brand ── */
  .nav-brand {{
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 800;
    font-size: 0.95rem;
    color: var(--heading);
    letter-spacing: 0.5px;
    margin-right: 16px;
  }}
  .brand-icon {{
    color: var(--accent);
  }}

  .sidebar-toggle-btn {{
    display: none;
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.8rem;
    cursor: pointer;
  }}

  /* ── Premium Switch Theme Toggle ── */
  .theme-switch-btn {{
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--surface2);
    border: 1px solid var(--border);
    padding: 4px 14px 4px 5px;
    border-radius: 999px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
    user-select: none;
  }}
  .theme-switch-btn:hover {{
    border-color: var(--accent);
    box-shadow: 0 0 16px var(--accent-glow);
    transform: translateY(-1px);
  }}
  .switch-track {{
    width: 42px;
    height: 24px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 999px;
    position: relative;
    padding: 2px;
    display: flex;
    align-items: center;
    transition: background-color 0.25s ease, border-color 0.25s ease;
  }}
  .switch-thumb {{
    width: 18px;
    height: 18px;
    background: var(--accent);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #ffffff;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.25s ease;
    box-shadow: 0 2px 6px rgba(0,0,0,0.25);
  }}
  html[data-theme="light"] .switch-thumb {{
    transform: translateX(18px);
    background: #d97706;
  }}
  .switch-label {{
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--heading);
    letter-spacing: 0.2px;
  }}

  /* ── Full Workspace Layout ── */
  .app-shell {{
    display: flex;
    min-height: 100vh;
    width: 100%;
  }}

  .sidebar-drawer {{
    width: 300px;
    flex-shrink: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    position: sticky;
    top: 57px;
    height: calc(100vh - 57px);
    overflow-y: auto;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    z-index: 90;
  }}

  .sidebar-search-input {{
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.8rem;
    outline: none;
    transition: border-color 0.2s;
  }}
  .sidebar-search-input:focus {{
    border-color: var(--accent);
  }}

  .sidebar-group {{
    margin-bottom: 16px;
  }}
  .sidebar-group-title {{
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
    padding: 0 6px;
  }}
  .sidebar-item {{
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 8px;
    text-decoration: none;
    color: var(--text);
    font-size: 0.83rem;
    font-weight: 500;
    transition: all 0.15s ease;
    margin-bottom: 2px;
  }}
  .sidebar-item:hover, .sidebar-item.active {{
    background: var(--toc-row-hover);
    color: var(--accent);
    font-weight: 600;
  }}
  .sidebar-num {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--muted);
    background: var(--surface2);
    padding: 2px 6px;
    border-radius: 4px;
  }}

  .main-content {{
    flex: 1;
    min-width: 0;
    padding-bottom: 80px;
  }}

  .container {{
    max-width: min(1800px, 96vw);
    margin: 0 auto;
    padding: 0 clamp(20px, 3vw, 48px);
  }}

  /* ── Creative Angle Banner ── */
  .creative-banner {{
    background: var(--banner-bg);
    border: 1px solid var(--banner-border);
    border-radius: 16px;
    padding: 28px 32px;
    margin: 48px 0 0;
    position: relative;
    overflow: hidden;
  }}
  .creative-banner::before {{
    content: '💡';
    position: absolute;
    top: -10px;
    right: 20px;
    font-size: 80px;
    opacity: 0.06;
  }}
  .creative-banner h3 {{
    color: var(--banner-title);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }}
  .creative-banner p {{
    color: var(--text);
    font-size: 1rem;
    line-height: 1.7;
  }}
  .creative-banner strong {{
    color: var(--accent);
  }}

  /* ── Table of Contents ── */
  .toc-wrapper {{
    margin: 48px 0 0;
    border: 1px solid var(--border);
    border-radius: 18px;
    overflow: hidden;
    background: var(--surface);
  }}
  .toc-header {{
    background: var(--toc-header-bg);
    padding: 24px 32px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 14px;
  }}
  .toc-header-icon {{
    font-size: 1.8rem;
  }}
  .toc-header-text h2 {{
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--heading);
    margin: 0;
    padding: 0;
    border: none;
  }}
  .toc-header-text h2::before {{ display: none; }}
  .toc-header-text p {{
    font-size: 0.82rem;
    color: var(--muted);
    margin: 3px 0 0;
  }}
  .toc-table {{
    width: 100%;
    border-collapse: collapse;
  }}
  .toc-table thead th {{
    background: var(--table-header-bg);
    color: var(--muted);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    padding: 10px 20px;
    text-align: left;
    border-bottom: 1px solid var(--border);
  }}
  .toc-row {{
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    border-bottom: 1px solid var(--border);
  }}
  .toc-row:last-child {{ border-bottom: none; }}
  .toc-row:hover {{
    background: var(--toc-row-hover);
    transform: translateX(6px);
  }}
  .toc-td-num {{
    padding: 16px 16px 16px 24px;
    width: 60px;
  }}
  .toc-num-badge {{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: var(--toc-badge-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--toc-badge-color);
  }}
  .toc-td-title {{
    padding: 14px 20px;
  }}
  .toc-section-title {{
    font-size: 0.97rem;
    font-weight: 600;
    color: var(--heading);
    margin-bottom: 4px;
  }}
  .toc-section-desc {{
    font-size: 0.78rem;
    color: var(--muted);
    line-height: 1.5;
  }}
  .toc-td-part {{
    padding: 14px 16px;
    white-space: nowrap;
  }}
  .toc-part-pill {{
    display: inline-block;
    background: var(--surface2);
    border: 1px solid color-mix(in srgb, var(--pc) 40%, transparent);
    color: var(--pc);
    font-size: 0.75rem;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 999px;
  }}
  .toc-td-link {{
    padding: 14px 24px 14px 8px;
    white-space: nowrap;
  }}
  .toc-go-btn {{
    display: inline-block;
    background: var(--inline-code-bg);
    border: 1px solid var(--inline-code-border);
    color: var(--accent);
    font-size: 0.78rem;
    font-weight: 600;
    padding: 5px 14px;
    border-radius: 7px;
    text-decoration: none;
    transition: all 0.18s;
  }}
  .toc-go-btn:hover {{
    background: var(--accent);
    color: #ffffff;
  }}

  /* ── Part Sections ── */
  .part-section {{
    padding: 64px 0;
    border-bottom: 1px solid var(--border);
  }}
  .part-badge {{
    display: inline-block;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: white;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 4px 14px;
    border-radius: 999px;
    margin-bottom: 8px;
  }}
  .part-subtitle {{
    font-size: 0.9rem;
    color: var(--muted);
    margin-bottom: 40px;
    font-weight: 500;
  }}

  /* ── Content Styles ── */
  .content h1 {{ display: none; }}
  .content h2 {{
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--heading);
    margin: 52px 0 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
  }}
  .content h2::before {{
    content: '';
    display: inline-block;
    width: 4px;
    height: 24px;
    background: linear-gradient(to bottom, var(--accent), var(--accent2));
    border-radius: 2px;
  }}
  .content h3 {{
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--h3-color);
    margin: 32px 0 14px;
  }}
  .content h4 {{
    font-size: 1rem;
    font-weight: 600;
    color: var(--accent2);
    margin: 24px 0 10px;
  }}
  .content p {{
    margin-bottom: 16px;
    color: var(--p-color);
  }}
  .content strong {{ color: var(--heading); }}
  .content em {{ color: var(--muted); font-style: italic; }}
  .content hr {{
    border: none;
    border-top: 1px solid var(--border);
    margin: 36px 0;
  }}

  /* ── Tables ── */
  .content table {{
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0 32px;
    font-size: 0.88rem;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--border);
  }}
  .content thead th {{
    background: var(--table-header-bg);
    color: var(--table-header-color);
    font-weight: 700;
    font-size: 0.78rem;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid var(--border);
  }}
  .content tbody tr {{
    transition: background 0.15s;
  }}
  .content tbody tr:nth-child(even) {{
    background: var(--table-row-even);
  }}
  .content tbody tr:hover {{
    background: var(--table-row-hover);
  }}
  .content td {{
    padding: 11px 16px;
    border-bottom: 1px solid var(--border);
    color: var(--p-color);
    vertical-align: top;
  }}
  .content td:first-child {{
    color: var(--text);
    font-weight: 500;
  }}

  /* ── Code blocks ── */
  .content pre {{
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    border-radius: 10px;
    padding: 20px 24px;
    margin: 16px 0 24px;
    overflow-x: auto;
  }}
  .content code {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.83rem;
    color: var(--code-color);
    line-height: 1.6;
  }}
  .content p code {{
    background: var(--inline-code-bg);
    border: 1px solid var(--inline-code-border);
    border-radius: 4px;
    padding: 2px 6px;
    color: var(--inline-code-color);
    font-size: 0.82rem;
  }}

  /* ── Blockquotes ── */
  .content blockquote {{
    background: var(--blockquote-bg);
    border-left: 3px solid var(--blockquote-border);
    border-radius: 0 10px 10px 0;
    padding: 16px 20px;
    margin: 20px 0;
    color: var(--blockquote-text);
    font-style: normal;
  }}
  .content blockquote strong {{
    color: var(--accent2);
  }}
  .content blockquote p {{ margin: 0; color: var(--blockquote-text); }}

  /* ── Lists ── */
  .content ul, .content ol {{
    padding-left: 24px;
    margin-bottom: 20px;
  }}
  .content li {{
    color: #cbd5e1;
    margin-bottom: 6px;
    padding-left: 4px;
  }}
  .content li input[type="checkbox"] {{
    accent-color: var(--accent);
    width: 15px;
    height: 15px;
    margin-right: 8px;
    vertical-align: middle;
  }}

  /* ── Footer ── */
  .footer {{
    text-align: center;
    padding: 48px 24px;
    color: var(--muted);
    font-size: 0.85rem;
    border-top: 1px solid var(--border);
  }}
  .footer strong {{
    color: #a78bfa;
  }}

  /* ── Scroll to top ── */
  .top-btn {{
    position: fixed;
    bottom: 28px;
    right: 28px;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    font-size: 1.2rem;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(124,58,237,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: transform 0.2s;
  }}
  .top-btn:hover {{ transform: scale(1.1); }}

  /* ── Mobile & Responsive Breakpoints ── */
  @media (max-width: 1024px) {{
    .sidebar-drawer {{
      position: fixed;
      top: 57px;
      left: 0;
      width: 290px;
      height: calc(100vh - 57px);
      z-index: 999;
      transform: translateX(-100%);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 10px 0 30px rgba(0,0,0,0.5);
    }}
    .sidebar-drawer.open {{
      transform: translateX(0);
    }}
    .sidebar-toggle-btn {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--surface2);
      border: 1px solid var(--border);
      color: var(--text);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
    }}
    .sidebar-overlay {{
      display: none;
      position: fixed;
      inset: 0;
      top: 57px;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 998;
    }}
    .sidebar-overlay.active {{
      display: block;
    }}
    .container {{
      padding: 0 20px;
    }}
  }}

  @media (max-width: 768px) {{
    .nav {{
      padding: 10px 14px;
      gap: 8px;
    }}
    .nav-brand {{
      font-size: 0.85rem;
      margin-right: 4px;
    }}
    .nav-brand .brand-name {{
      display: none;
    }}
    .nav a {{
      font-size: 11px;
      padding: 5px 8px;
    }}
    .hero {{
      padding: 44px 16px 36px;
    }}
    .hero p {{
      font-size: 0.95rem;
    }}
    .hero-stats {{
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }}
    .stat {{
      padding: 12px 14px;
    }}
    .stat-num {{
      font-size: 1.4rem;
    }}
    .stat-label {{
      font-size: 0.68rem;
    }}
    .creative-banner {{
      padding: 20px 20px;
      margin-top: 32px;
    }}
    .creative-banner p {{
      font-size: 0.9rem;
    }}
    .toc-wrapper {{
      margin-top: 32px;
    }}
    .toc-header {{
      padding: 16px 20px;
    }}
    .toc-header-text h2 {{
      font-size: 1.1rem;
    }}
    .toc-table thead th:nth-child(3),
    .toc-table tbody td:nth-child(3) {{
      display: none;
    }}
    .toc-td-num {{
      padding: 12px 8px 12px 14px;
      width: 44px;
    }}
    .toc-num-badge {{
      width: 30px;
      height: 30px;
      font-size: 0.75rem;
    }}
    .toc-td-title {{
      padding: 10px 10px;
    }}
    .toc-section-title {{
      font-size: 0.88rem;
    }}
    .toc-section-desc {{
      font-size: 0.73rem;
    }}
    .toc-td-link {{
      padding: 10px 14px 10px 4px;
    }}
    .toc-go-btn {{
      font-size: 0.72rem;
      padding: 4px 10px;
    }}

    .content h2 {{
      font-size: 1.3rem;
      margin: 36px 0 16px;
    }}
    .content h3 {{
      font-size: 1.05rem;
    }}
    .content table {{
      display: block;
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      font-size: 0.78rem;
    }}
    .content td, .content thead th {{
      padding: 8px 12px;
      white-space: normal;
      min-width: 110px;
    }}
    .content pre {{
      padding: 14px 16px;
      font-size: 0.78rem;
      border-radius: 8px;
    }}
    .switch-label {{
      display: none;
    }}
    .theme-switch-btn {{
      padding: 4px 5px;
    }}
  }}
</style>
</head>
<body>

<nav class="nav">
  <div class="nav-brand">
    <span class="brand-icon">⚡</span>
    <span class="brand-name">AI AGENCY STUDIO</span>
  </div>
  <button id="sidebar-toggle" class="sidebar-toggle-btn" onclick="toggleSidebar()">☰ Outline</button>
  <a href="#part1">📌 Part 1</a>
  <a href="#part2">🚀 Part 2</a>
  <a href="#part3">🛠 Part 3</a>
  <a href="learning_roadmap.html" style="background: linear-gradient(135deg, rgba(16,185,129,0.18), rgba(245,158,11,0.15)); border: 1px solid var(--accent); color: var(--heading); font-weight: 700;">🎓 Learning Roadmap</a>
  <button id="theme-toggle" class="theme-switch-btn" aria-label="Toggle Theme">
    <span class="switch-track">
      <span class="switch-thumb" id="theme-thumb">🌙</span>
    </span>
    <span id="theme-text" class="switch-label">Dark Mode</span>
  </button>
</nav>

<div class="hero">
  <div class="hero-tag">Master Blueprint Studio</div>
  <h1>🚀 AI Agency Business Blueprint</h1>
  <p>A complete, numbers-backed playbook for building a profitable AI services agency — from zero to ₹10L+/month.</p>
  <div class="hero-stats">
    <div class="stat"><div class="stat-num">10</div><div class="stat-label">Sections</div></div>
    <div class="stat"><div class="stat-num">3</div><div class="stat-label">Parts</div></div>
    <div class="stat"><div class="stat-num">90</div><div class="stat-label">Day Plan</div></div>
    <div class="stat"><div class="stat-num">₹10L+</div><div class="stat-label">Revenue Target</div></div>
  </div>
</div>

<div class="app-shell">
  <aside class="sidebar-drawer" id="sidebar">
    <div class="sidebar-search-box">
      <input type="text" id="sidebar-search" class="sidebar-search-input" placeholder="🔍 Search sections..." onkeyup="filterSidebar()">
    </div>
    <nav class="sidebar-nav">
      {sidebar_nav_html}
    </nav>
  </aside>
  <div id="sidebar-overlay" class="sidebar-overlay" onclick="toggleSidebar()"></div>

  <main class="main-content">
    <div class="container">
      <div class="creative-banner">
        <h3>Your Creative Angle — Think Outside the Box</h3>
        <p>You asked: <em>"can't we do something useful for everyone?"</em> — Yes. And that's the smartest play.<br/>
        <strong>Don't niche by industry. Niche by problem.</strong><br/>
        "We automate the 3 most painful universal business bottlenecks: lead follow-up, customer support, and internal reporting." Every business — clinic, SaaS, D2C brand, real estate firm — has these 3 problems. You solve them better than anyone. That's your moat.</p>
      </div>

      <div class="toc-wrapper">
        <div class="toc-header">
          <div class="toc-header-icon">📋</div>
          <div class="toc-header-text">
            <h2>Table of Contents</h2>
            <p>10 sections · Click any row to jump directly to it</p>
          </div>
        </div>
        <table class="toc-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Section</th>
              <th>Part</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {toc_parts_html}
          </tbody>
        </table>
      </div>

      {sections_html}
    </div>

    <div class="footer">
      Built with ❤️ · <strong>AI Agency Business Blueprint Studio</strong> · All content is actionable, numbers-backed strategy.
    </div>
  </main>
</div>

<a href="#" class="top-btn" title="Back to top">↑</a>

<script>
  // Theme Toggle Logic
  function setTheme(theme) {{
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('blueprint-theme', theme);
    const thumb = document.getElementById('theme-thumb');
    const text = document.getElementById('theme-text');
    if (theme === 'light') {{
      if (thumb) thumb.textContent = '☀️';
      if (text) text.textContent = 'Light Mode';
    }} else {{
      if (thumb) thumb.textContent = '🌙';
      if (text) text.textContent = 'Dark Mode';
    }}
  }}

  const savedTheme = localStorage.getItem('blueprint-theme') || 'dark';
  setTheme(savedTheme);

  document.getElementById('theme-toggle')?.addEventListener('click', () => {{
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }});

  // Mobile Sidebar Toggle
  function toggleSidebar() {{
    const sb = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sb) sb.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
  }}

  // Auto-close sidebar on mobile item click
  document.querySelectorAll('.sidebar-item').forEach(item => {{
    item.addEventListener('click', () => {{
      if (window.innerWidth <= 1024) {{
        const sb = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sb && sb.classList.contains('open')) {{
          sb.classList.remove('open');
          if (overlay) overlay.classList.remove('active');
        }}
      }}
    }});
  }});

  // Sidebar Filter Search
  function filterSidebar() {{
    const query = document.getElementById('sidebar-search').value.toLowerCase();
    document.querySelectorAll('.sidebar-item').forEach(item => {{
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? 'flex' : 'none';
    }});
  }}

  // Make checkboxes interactive
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {{
    cb.removeAttribute('disabled');
    const saved = localStorage.getItem(cb.parentElement.textContent.trim().slice(0,40));
    if (saved === 'true') cb.checked = true;
    cb.addEventListener('change', () => {{
      localStorage.setItem(cb.parentElement.textContent.trim().slice(0,40), cb.checked);
    }});
  }});

  function scrollToAnchor(id) {{
    const el = document.getElementById(id);
    if (!el) return;
    const nav = document.querySelector('.nav');
    const navHeight = nav ? nav.offsetHeight : 60;
    const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - navHeight - 24;

    window.scrollTo({{
      top: offsetPosition,
      behavior: 'smooth'
    }});
  }}

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {{
    a.addEventListener('click', e => {{
      const href = a.getAttribute('href');
      if (href && href.length > 1) {{
        e.preventDefault();
        scrollToAnchor(href.substring(1));
      }} else if (href === '#') {{
        e.preventDefault();
        window.scrollTo({{ top: 0, behavior: 'smooth' }});
      }}
    }});
  }});

  // Highlight Active Section in Sidebar on Scroll
  const observer = new IntersectionObserver(entries => {{
    entries.forEach(entry => {{
      if (entry.isIntersecting) {{
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.sidebar-item').forEach(link => {{
          if (link.getAttribute('data-anchor') === id) {{
            link.classList.add('active');
          }} else {{
            link.classList.remove('active');
          }}
        }});
      }}
    }});
  }}, {{ rootMargin: '-10% 0px -70% 0px' }});

  document.querySelectorAll('h2[id]').forEach(h2 => observer.observe(h2));

  // Scroll Reveal Animations for Cards/Tables
  const revealTargets = document.querySelectorAll('.creative-banner, .toc-wrapper, .content table, .content pre, .content blockquote');
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(entries => {{
    entries.forEach(entry => {{
      if (entry.isIntersecting) {{
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }}
    }});
  }}, {{ threshold: 0.01, rootMargin: '50px 0px 50px 0px' }});

  revealTargets.forEach(el => revealObserver.observe(el));
</script>
</body>
</html>"""

output_paths = ["index.html"]
for p in output_paths:
    with open(p, "w") as f:
        f.write(full_html)
    print(f"✅ Generated: {p} ({len(full_html):,} bytes)")

