import os

html_content = """<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>AI Agency Technical Learning Roadmap</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet"/>
<style>
  :root {
    /* Dark Mode (Default) — Onyx & Cyber Emerald / Amber */
    --bg: #08090d;
    --surface: #11121a;
    --surface2: #181a26;
    --border: #26293b;
    --text: #f3f4f6;
    --heading: #ffffff;
    --muted: #9ca3af;
    --subtle: #1f2130;

    --accent: #10b981;
    --accent-glow: rgba(16, 185, 129, 0.25);
    --accent2: #f59e0b;
    --accent3: #8b5cf6;
    --yt-red: #ff0000;
    --docs-blue: #3b82f6;

    --hero-bg: radial-gradient(ellipse at top, #1c1d2e 0%, #08090d 70%);
    --nav-bg: rgba(8, 9, 13, 0.92);
    --card-hover-border: #10b981;
  }

  html[data-theme="light"] {
    /* Light Mode — Warm Champagne & Emerald */
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
    --accent3: #7c3aed;

    --hero-bg: linear-gradient(135deg, #fef3c7, #ecfdf5, #fcfbfa);
    --nav-bg: rgba(252, 251, 250, 0.94);
    --card-hover-border: #059669;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    line-height: 1.7;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  /* ── Keyframe Animations ── */
  @keyframes pulseAura {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.06); }
  }

  .reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal.active {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Top Navigation ── */
  .nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--nav-bg);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 12px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }
  .nav-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 800;
    font-size: 1rem;
    color: var(--heading);
    letter-spacing: 0.5px;
    text-decoration: none;
  }
  .brand-icon { color: var(--accent); font-size: 1.2rem; }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--muted);
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--surface2);
    transition: all 0.2s;
  }
  .back-btn:hover {
    color: var(--heading);
    border-color: var(--accent);
  }

  /* ── Theme Switch ── */
  .theme-switch-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--surface2);
    border: 1px solid var(--border);
    padding: 4px 12px 4px 5px;
    border-radius: 999px;
    cursor: pointer;
    transition: all 0.25s ease;
    user-select: none;
  }
  .theme-switch-btn:hover {
    border-color: var(--accent);
    box-shadow: 0 0 12px var(--accent-glow);
  }
  .switch-track {
    width: 38px;
    height: 22px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 999px;
    position: relative;
    padding: 2px;
    display: flex;
    align-items: center;
  }
  .switch-thumb {
    width: 16px;
    height: 16px;
    background: var(--accent);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: #ffffff;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  html[data-theme="light"] .switch-thumb {
    transform: translateX(16px);
    background: #d97706;
  }
  .switch-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--heading);
  }

  /* ── Hero ── */
  .hero {
    background: var(--hero-bg);
    padding: 60px 40px 40px;
    text-align: center;
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid var(--border);
  }
  .hero::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(ellipse at center, rgba(16,185,129,0.15) 0%, transparent 60%);
    pointer-events: none;
    animation: pulseAura 8s ease-in-out infinite;
  }
  .hero-tag {
    display: inline-block;
    background: rgba(16, 185, 129, 0.14);
    border: 1px solid rgba(16, 185, 129, 0.4);
    color: var(--accent);
    padding: 4px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .hero h1 {
    font-size: clamp(2rem, 4.5vw, 3.2rem);
    font-weight: 800;
    background: linear-gradient(135deg, #ffffff 20%, #6ee7b7 60%, #fcd34d 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 14px;
  }
  .hero p {
    color: var(--muted);
    font-size: 1.05rem;
    max-width: 860px;
    margin: 0 auto 28px;
    line-height: 1.6;
  }

  /* Progress Tracker Header */
  .progress-container {
    max-width: 660px;
    margin: 0 auto;
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 16px 24px;
    border-radius: 14px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  }
  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 0.85rem;
    font-weight: 600;
  }
  .progress-title { color: var(--heading); }
  .progress-percent { color: var(--accent); font-family: 'JetBrains Mono', monospace; font-weight: 700; }
  .progress-bar-bg {
    width: 100%;
    height: 8px;
    background: var(--surface2);
    border-radius: 999px;
    overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    border-radius: 999px;
    transition: width 0.4s ease;
  }

  /* ── Filter Controls ── */
  .controls-bar {
    max-width: min(1800px, 96vw);
    margin: 32px auto 0;
    padding: 0 clamp(16px, 2.5vw, 40px);
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }
  .controls-top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    width: 100%;
  }
  .track-filters {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }
  .track-label {
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--muted);
    margin-right: 4px;
    white-space: nowrap;
  }
  .track-btn {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 8px 18px;
    border-radius: 999px;
    font-size: 0.84rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }
  .track-btn:hover {
    border-color: var(--accent);
    color: var(--heading);
  }
  .track-btn.active[data-track="all"] {
    background: var(--surface2);
    border-color: var(--border);
    color: var(--heading);
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  }
  .track-btn.active[data-track="bhavya"] {
    background: #0284c7;
    border-color: #0284c7;
    color: #ffffff;
    box-shadow: 0 2px 14px rgba(2, 132, 199, 0.4);
  }
  .track-btn.active[data-track="dhruv"] {
    background: #10b981;
    border-color: #10b981;
    color: #ffffff;
    box-shadow: 0 2px 14px rgba(16, 185, 129, 0.4);
  }
  .phase-filters {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }
  .filter-btn {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 7px 16px;
    border-radius: 999px;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  .filter-btn:hover, .filter-btn.active {
    background: var(--accent);
    color: #ffffff;
    border-color: var(--accent);
    box-shadow: 0 2px 10px var(--accent-glow);
  }

  .search-box {
    position: relative;
    min-width: 260px;
    flex: 0 1 340px;
  }
  .search-input {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 9px 16px 9px 38px;
    border-radius: 999px;
    font-size: 0.85rem;
    outline: none;
    transition: all 0.2s;
  }
  .search-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }
  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    font-size: 0.85rem;
  }

  /* ── Owner Pills ── */
  .owner-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 6px;
    margin-left: 8px;
    vertical-align: middle;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .owner-bhavya {
    background: rgba(2, 132, 199, 0.15);
    color: #38bdf8;
    border: 1px solid rgba(2, 132, 199, 0.4);
  }
  .owner-dhruv {
    background: rgba(16, 185, 129, 0.15);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.4);
  }
  .owner-ai {
    background: rgba(245, 158, 11, 0.15);
    color: #fbbf24;
    border: 1px solid rgba(245, 158, 11, 0.4);
  }
  .owner-shared {
    background: rgba(139, 92, 246, 0.15);
    color: #a78bfa;
    border: 1px solid rgba(139, 92, 246, 0.4);
  }

  /* ── Fast-Track Lean Cards ── */
  .fast-track-section {
    margin-bottom: 40px;
  }
  .fast-track-banner {
    background: linear-gradient(135deg, rgba(16,185,129,0.08), rgba(2,132,199,0.08));
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px 24px;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }
  .fast-banner-text h3 {
    color: var(--heading);
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 4px;
  }
  .fast-banner-text p {
    color: var(--muted);
    font-size: 0.88rem;
    margin: 0;
  }
  .fast-track-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
  }
  .fast-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 22px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.2s ease, border-color 0.2s ease;
  }
  .fast-card:hover {
    transform: translateY(-3px);
  }
  .fast-card-bhavya { border-top: 4px solid #0284c7; }
  .fast-card-dhruv { border-top: 4px solid #10b981; }
  .fast-card-ai { border-top: 4px solid #f59e0b; }
  .fast-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  .fast-card-title {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--heading);
  }
  .fast-badge {
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 999px;
  }
  .fast-badge-bhavya { background: rgba(2,132,199,0.2); color: #38bdf8; }
  .fast-badge-dhruv { background: rgba(16,185,129,0.2); color: #34d399; }
  .fast-badge-ai { background: rgba(245,158,11,0.2); color: #fbbf24; }
  .fast-card-desc {
    font-size: 0.85rem;
    color: var(--muted);
    line-height: 1.5;
    margin-bottom: 16px;
  }
  .fast-checklist {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .fast-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 0.84rem;
  }
  .fast-item input[type="checkbox"] {
    margin-top: 3px;
    cursor: pointer;
    accent-color: var(--accent);
  }
  .fast-item label {
    cursor: pointer;
    color: var(--text);
  }
  .fast-item label strong {
    color: var(--heading);
  }
  .fast-card-footer {
    margin-top: 18px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
    font-size: 0.82rem;
    color: var(--accent);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* ── Main Container ── */
  .main-container {
    max-width: min(1800px, 96vw);
    margin: 32px auto 80px;
    padding: 0 clamp(16px, 2.5vw, 40px);
    width: 100%;
  }

  /* Module Card */
  .module-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    margin-bottom: 36px;
    overflow: hidden;
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  }
  .module-card:hover {
    border-color: var(--card-hover-border);
    box-shadow: 0 10px 36px rgba(0,0,0,0.2);
  }

  .module-header {
    padding: 24px clamp(20px, 2.5vw, 36px);
    background: var(--surface2);
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;
  }
  .module-header-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .module-icon-badge {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
  }
  .module-title h2 {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--heading);
    margin: 0;
  }
  .module-subtitle {
    font-size: 0.82rem;
    color: var(--muted);
    margin-top: 2px;
  }

  .module-badge {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--accent2);
    font-size: 0.75rem;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 999px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .module-body {
    padding: 30px clamp(20px, 2.5vw, 36px);
  }

  /* Grid Layout Inside Module */
  .grid-two-col {
    display: grid;
    grid-template-columns: 1.12fr 0.88fr;
    gap: clamp(24px, 3vw, 44px);
  }

  .section-label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: var(--muted);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* Skills Checklist */
  .skills-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .skill-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 10px 14px;
    border-radius: 10px;
    transition: border-color 0.2s;
  }
  .skill-item:hover {
    border-color: var(--accent);
  }
  .skill-item input[type="checkbox"] {
    accent-color: var(--accent);
    width: 16px;
    height: 16px;
    margin-top: 3px;
    cursor: pointer;
  }
  .skill-text {
    font-size: 0.88rem;
    color: var(--text);
    line-height: 1.5;
  }
  .skill-text strong {
    color: var(--heading);
  }

  /* Resources List */
  .resources-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .resource-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 10px 14px;
    border-radius: 10px;
    text-decoration: none;
    transition: all 0.2s ease;
  }
  .resource-card:hover {
    transform: translateX(4px);
    border-color: var(--accent);
    box-shadow: 0 4px 12px var(--accent-glow);
  }
  .resource-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .resource-icon {
    font-size: 1.1rem;
  }
  .resource-title {
    font-size: 0.86rem;
    font-weight: 600;
    color: var(--heading);
  }
  .resource-type {
    font-size: 0.72rem;
    color: var(--muted);
  }

  .btn-tag {
    font-size: 0.72rem;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .btn-yt {
    background: rgba(255, 0, 0, 0.12);
    color: #ff4d4d;
    border: 1px solid rgba(255, 0, 0, 0.3);
  }
  .btn-docs {
    background: rgba(59, 130, 246, 0.12);
    color: #60a5fa;
    border: 1px solid rgba(59, 130, 246, 0.3);
  }
  .btn-course {
    background: rgba(16, 185, 129, 0.12);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }

  /* Portfolio Project Box */
  .project-box {
    margin-top: 24px;
    background: linear-gradient(135deg, rgba(16,185,129,0.06), rgba(245,158,11,0.04));
    border: 1px dashed var(--accent);
    border-radius: 12px;
    padding: 16px 20px;
  }
  .project-title {
    font-size: 0.82rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--accent);
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .project-desc {
    font-size: 0.88rem;
    color: var(--text);
    line-height: 1.5;
  }
  .project-desc strong {
    color: var(--heading);
  }

  /* ── Footer ── */
  .footer {
    text-align: center;
    padding: 40px 20px;
    color: var(--muted);
    font-size: 0.85rem;
    border-top: 1px solid var(--border);
  }
  .footer strong { color: var(--accent); }

  /* ── Responsive Breakpoints ── */
  @media (max-width: 1280px) {
    .controls-bar, .main-container {
      max-width: 98vw;
      padding: 0 clamp(16px, 2vw, 32px);
    }
    .grid-two-col {
      gap: 28px;
    }
  }

  @media (max-width: 1024px) {
    .grid-two-col {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    .controls-top-row {
      flex-direction: column;
      align-items: stretch;
      gap: 14px;
    }
    .search-box {
      min-width: 100%;
    }
    .fast-track-banner {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
    .fast-banner-actions {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
    }
  }

  @media (max-width: 768px) {
    .nav {
      padding: 12px 16px;
    }
    .nav-brand span:last-child {
      font-size: 0.9rem;
    }
    .hero {
      padding: 44px 16px 36px;
    }
    .hero h1 {
      font-size: 2rem;
    }
    .hero p {
      font-size: 0.95rem;
    }
    .controls-bar {
      padding: 0 14px;
      margin-top: 20px;
      gap: 12px;
    }
    .main-container {
      padding: 0 14px;
      margin-top: 24px;
    }
    .track-filters, .phase-filters {
      gap: 6px;
    }
    .track-btn, .filter-btn {
      padding: 6px 14px;
      font-size: 0.8rem;
    }
    .fast-card {
      padding: 20px 16px;
    }
    .module-header {
      padding: 18px 16px;
    }
    .module-body {
      padding: 20px 16px;
    }
    .project-box {
      padding: 16px;
    }
  }

  @media (max-width: 480px) {
    .nav {
      flex-direction: column;
      gap: 10px;
      align-items: flex-start;
    }
    .nav-actions {
      width: 100%;
      justify-content: space-between;
    }
    .hero h1 {
      font-size: 1.75rem;
    }
    .hero p {
      font-size: 0.9rem;
    }
    .track-btn, .filter-btn {
      font-size: 0.75rem;
      padding: 5px 10px;
    }
    .fast-track-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
</head>
<body>

<nav class="nav">
  <a href="index.html" class="nav-brand">
    <span class="brand-icon">⚡</span>
    <span>AI AGENCY ROADMAP</span>
  </a>
  <div class="nav-actions">
    <a href="index.html" class="back-btn">← Back to Blueprint</a>
    <button id="theme-toggle" class="theme-switch-btn" aria-label="Toggle Theme">
      <span class="switch-track">
        <span class="switch-thumb" id="theme-thumb">🌙</span>
      </span>
      <span id="theme-text" class="switch-label">Dark Mode</span>
    </button>
  </div>
</nav>

<div class="hero">
  <div class="hero-tag">Zero to Hero Execution Guide · 2-Person Agency Division</div>
  <h1>🚀 Technical Learning & Skill Roadmap</h1>
  <p>The exact step-by-step path divided between <strong>Bhavya</strong> (Backend Architecture & Outbound Closing) and <strong>Dhruv</strong> (n8n Automations, AI Agents & Twitter Inbound). Zero tutorial hell: learn only what you need to ship your first client project in &lt;5 days.</p>
  
  <div class="progress-container">
    <div class="progress-header">
      <span class="progress-title">Your Learning Progress</span>
      <span class="progress-percent" id="progress-text">0% Completed</span>
    </div>
    <div class="progress-bar-bg">
      <div class="progress-bar-fill" id="progress-bar"></div>
    </div>
  </div>
</div>

<div class="controls-bar">
  <div class="controls-top-row">
    <div class="track-filters">
      <span class="track-label">Target Track:</span>
      <button class="track-btn active" data-track="all" onclick="filterTrack('all', this)">👥 Both Co-Founders</button>
      <button class="track-btn" data-track="bhavya" onclick="filterTrack('bhavya', this)">👨‍💻 Bhavya's Track</button>
      <button class="track-btn" data-track="dhruv" onclick="filterTrack('dhruv', this)">🤖 Dhruv's Track</button>
    </div>
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input type="text" id="roadmap-search" class="search-input" placeholder="Search skills, tools, docs..." onkeyup="searchRoadmap()"/>
    </div>
  </div>

  <div class="phase-filters">
    <span class="track-label">Phase:</span>
    <button class="filter-btn active" onclick="filterPhase('all', this)">All Modules</button>
    <button class="filter-btn" onclick="filterPhase('p1', this)">Phase 1: Automations</button>
    <button class="filter-btn" onclick="filterPhase('p2', this)">Phase 2: LLMs & Prompts</button>
    <button class="filter-btn" onclick="filterPhase('p3', this)">Phase 3: RAG & Bots</button>
    <button class="filter-btn" onclick="filterPhase('p4', this)">Phase 4: Voice Agents</button>
    <button class="filter-btn" onclick="filterPhase('p5', this)">Phase 5: Full-Stack & Sales</button>
  </div>
</div>

<div class="main-container">

  <!-- CO-FOUNDER LEAN FAST-TRACK CARDS -->
  <div class="fast-track-section">
    <div class="fast-track-banner">
      <div class="fast-banner-text">
        <h3>⚡ Lean 5-Day Fast-Track: Stop Studying, Start Shipping</h3>
        <p>Do NOT waste weeks in tutorial hell. Complete only the 3 tasks for your track, build ONE template, and immediately start client outreach.</p>
      </div>
      <div class="fast-banner-actions">
        <button class="track-btn active" data-track="all" onclick="filterTrack('all', this)">👥 All Tracks</button>
        <button class="track-btn" data-track="bhavya" onclick="filterTrack('bhavya', this)">👨‍💻 Bhavya's Focus</button>
        <button class="track-btn" data-track="dhruv" onclick="filterTrack('dhruv', this)">🤖 Dhruv's Focus</button>
      </div>
    </div>

    <div class="fast-track-grid">
      <!-- Bhavya Card -->
      <div class="fast-card fast-card-bhavya" data-track="bhavya">
        <div>
          <div class="fast-card-header">
            <div class="fast-card-title">👨‍💻 Bhavya: Backend & Outbound Sales</div>
            <span class="fast-badge fast-badge-bhavya">4-Day Sprint</span>
          </div>
          <p class="fast-card-desc">Master the outbound phone hook and build a deployable FastAPI + Supabase backend. Zero extra study.</p>
          <ul class="fast-checklist">
            <li class="fast-item">
              <input type="checkbox" id="ft_b1" class="task-check"/>
              <label for="ft_b1"><strong>Day 1 (Cold Calls):</strong> Rehearse the 15-second phone hook & 4 objection responses out loud for 2 hours.</label>
            </li>
            <li class="fast-item">
              <input type="checkbox" id="ft_b2" class="task-check"/>
              <label for="ft_b2"><strong>Day 2–3 (Backend):</strong> Build 1 reusable FastAPI + Supabase REST endpoint with Pydantic validation.</label>
            </li>
            <li class="fast-item">
              <input type="checkbox" id="ft_b3" class="task-check"/>
              <label for="ft_b3"><strong>Day 4 (DevOps):</strong> Deploy FastAPI container to a $5 Hetzner VPS with Docker & Caddy SSL.</label>
            </li>
          </ul>
        </div>
        <div class="fast-card-footer">
          <span>🎯 Daily Metric: 15–20 cold calls/day to leads from Master Lead Engine</span>
        </div>
      </div>

      <!-- Dhruv Card -->
      <div class="fast-card fast-card-dhruv" data-track="dhruv">
        <div>
          <div class="fast-card-header">
            <div class="fast-card-title">🤖 Dhruv: AI Automations & Twitter Inbound</div>
            <span class="fast-badge fast-badge-dhruv">5-Day Sprint</span>
          </div>
          <p class="fast-card-desc">Build deployable n8n workflows, configure a Vapi voice agent, and launch daily Twitter build-in-public.</p>
          <ul class="fast-checklist">
            <li class="fast-item">
              <input type="checkbox" id="ft_d1" class="task-check"/>
              <label for="ft_d1"><strong>Day 1–2 (n8n):</strong> Build a webhook lead intake workflow that enriches data via an LLM node & alerts Telegram.</label>
            </li>
            <li class="fast-item">
              <input type="checkbox" id="ft_d2" class="task-check"/>
              <label for="ft_d2"><strong>Day 3–4 (Voice AI):</strong> Set up a Vapi.ai / Retell voice appointment receptionist connected to Google Calendar.</label>
            </li>
            <li class="fast-item">
              <input type="checkbox" id="ft_d3" class="task-check"/>
              <label for="ft_d3"><strong>Day 5 (Twitter Authority):</strong> Record 2-min Loom demos of the builds and schedule 10 build-in-public threads.</label>
            </li>
          </ul>
        </div>
        <div class="fast-card-footer">
          <span>🎯 Daily Metric: 1 Twitter breakdown/day + 10 founder comment touches</span>
        </div>
      </div>

      <!-- AI Automated Card -->
      <div class="fast-card fast-card-ai" data-track="shared">
        <div>
          <div class="fast-card-header">
            <div class="fast-card-title">⚡ 100% AI-Automated Operations</div>
            <span class="fast-badge fast-badge-ai">Zero Founder Time</span>
          </div>
          <p class="fast-card-desc">Automations running in the background so neither Bhavya nor Dhruv wastes time on admin grunt work.</p>
          <ul class="fast-checklist">
            <li class="fast-item">
              <input type="checkbox" id="ft_ai1" class="task-check"/>
              <label for="ft_ai1"><strong>Lead Extraction:</strong> Master Prompt run in Perplexity Pro pushes verified leads directly to Notion CRM.</label>
            </li>
            <li class="fast-item">
              <input type="checkbox" id="ft_ai2" class="task-check"/>
              <label for="ft_ai2"><strong>Email Sequences:</strong> Instantly.ai handles multi-inbox rotation, warmup, and outbound drip follow-ups.</label>
            </li>
            <li class="fast-item">
              <input type="checkbox" id="ft_ai3" class="task-check"/>
              <label for="ft_ai3"><strong>Meeting Notes & SOW:</strong> Fireflies.ai captures sales calls; n8n + Claude generates SOW proposal in 90 seconds.</label>
            </li>
          </ul>
        </div>
        <div class="fast-card-footer">
          <span>🎯 Efficiency: Saves 15+ hours/week of administrative founder overhead</span>
        </div>
      </div>
    </div>
  </div>

  <!-- MODULE 1 -->
  <div class="module-card reveal" data-phase="p1" data-track="dhruv bhavya">
    <div class="module-header">
      <div class="module-header-left">
        <div class="module-icon-badge">⚡</div>
        <div class="module-title">
          <h2>Module 1: Workflow Automation & Integrations</h2>
          <div class="module-subtitle">Mastering n8n, Make.com, Webhooks & REST APIs · <span class="owner-pill owner-dhruv">🤖 Dhruv (Lead)</span> <span class="owner-pill owner-bhavya">👨‍💻 Bhavya (APIs)</span></div>
        </div>
      </div>
      <div class="module-badge">Phase 1 · Week 1-2</div>
    </div>
    <div class="module-body">
      <div class="grid-two-col">
        <div>
          <div class="section-label">🎯 Core Concepts & Skills</div>
          <ul class="skills-list">
            <li class="skill-item" data-track="bhavya">
              <input type="checkbox" id="m1_1" class="task-check"/>
              <label for="m1_1" class="skill-text"><strong>Webhooks & REST APIs:</strong> GET, POST, Headers, Authorization Bearer Tokens & Webhook Triggers. <span class="owner-pill owner-bhavya">👨‍💻 Bhavya</span></label>
            </li>
            <li class="skill-item" data-track="dhruv">
              <input type="checkbox" id="m1_2" class="task-check"/>
              <label for="m1_2" class="skill-text"><strong>n8n Fundamentals:</strong> Self-hosting on Docker/Hetzner, Code Node (JS/Py), IF/Switch Logic & Error Handling. <span class="owner-pill owner-dhruv">🤖 Dhruv</span></label>
            </li>
            <li class="skill-item" data-track="dhruv">
              <input type="checkbox" id="m1_3" class="task-check"/>
              <label for="m1_3" class="skill-text"><strong>Data Transformation:</strong> Parsing complex JSON structures, filtering arrays, and mapping CRM fields. <span class="owner-pill owner-dhruv">🤖 Dhruv</span></label>
            </li>
          </ul>
        </div>
        <div>
          <div class="section-label">📚 Where to Learn (YT & Official Docs)</div>
          <div class="resources-grid">
            <a href="https://www.youtube.com/@n8n-io" target="_blank" class="resource-card">
              <div class="resource-info">
                <span class="resource-icon">▶️</span>
                <div>
                  <div class="resource-title">n8n Official YouTube Channel</div>
                  <div class="resource-type">Beginner to Advanced Workflow Tutorials</div>
                </div>
              </div>
              <span class="btn-tag btn-yt">▶ YouTube</span>
            </a>
            <a href="https://docs.n8n.io/" target="_blank" class="resource-card">
              <div class="resource-info">
                <span class="resource-icon">📄</span>
                <div>
                  <div class="resource-title">n8n Official Documentation</div>
                  <div class="resource-type">Node Reference & Hosting Guides</div>
                </div>
              </div>
              <span class="btn-tag btn-docs">📄 Docs</span>
            </a>
            <a href="https://academy.make.com/" target="_blank" class="resource-card">
              <div class="resource-info">
                <span class="resource-icon">🎓</span>
                <div>
                  <div class="resource-title">Make.com Academy</div>
                  <div class="resource-type">Free Certification & Scenario Logic</div>
                </div>
              </div>
              <span class="btn-tag btn-course">🎓 Course</span>
            </a>
          </div>
        </div>
      </div>
      <div class="project-box">
        <div class="project-title">🛠️ Portfolio Project #1</div>
        <div class="project-desc"><strong>WhatsApp/Email Lead Intake Engine:</strong> Dhruv builds the n8n workflow catching form submissions via Webhook and enriching lead data. Bhavya configures the database endpoint in Supabase / Airtable to store records.</div>
      </div>
    </div>
  </div>

  <!-- MODULE 2 -->
  <div class="module-card reveal" data-phase="p2" data-track="dhruv bhavya">
    <div class="module-header">
      <div class="module-header-left">
        <div class="module-icon-badge">🧠</div>
        <div class="module-title">
          <h2>Module 2: LLM APIs, Function Calling & Structured Prompts</h2>
          <div class="module-subtitle">OpenAI API, Claude 3.5 Sonnet Tool Use & JSON Schemas · <span class="owner-pill owner-dhruv">🤖 Dhruv (Lead)</span> <span class="owner-pill owner-bhavya">👨‍💻 Bhavya (Microservices)</span></div>
        </div>
      </div>
      <div class="module-badge">Phase 2 · Week 3-4</div>
    </div>
    <div class="module-body">
      <div class="grid-two-col">
        <div>
          <div class="section-label">🎯 Core Concepts & Skills</div>
          <ul class="skills-list">
            <li class="skill-item" data-track="dhruv">
              <input type="checkbox" id="m2_1" class="task-check"/>
              <label for="m2_1" class="skill-text"><strong>Prompt Architecture:</strong> System Prompts, Few-shot prompting, Chain of Thought (CoT), & Guardrails. <span class="owner-pill owner-dhruv">🤖 Dhruv</span></label>
            </li>
            <li class="skill-item" data-track="shared">
              <input type="checkbox" id="m2_2" class="task-check"/>
              <label for="m2_2" class="skill-text"><strong>Structured Outputs:</strong> Enforcing strict JSON Schemas (Pydantic / OpenAI JSON Mode) for zero parser errors. <span class="owner-pill owner-shared">⚡ Shared</span></label>
            </li>
            <li class="skill-item" data-track="dhruv">
              <input type="checkbox" id="m2_3" class="task-check"/>
              <label for="m2_3" class="skill-text"><strong>Tool Use & Function Calling:</strong> Allowing LLMs to execute external APIs (Search, Calculator, Database Lookup). <span class="owner-pill owner-dhruv">🤖 Dhruv</span></label>
            </li>
          </ul>
        </div>
        <div>
          <div class="section-label">📚 Where to Learn (YT & Official Docs)</div>
          <div class="resources-grid">
            <a href="https://platform.openai.com/docs/guides/function-calling" target="_blank" class="resource-card">
              <div class="resource-info">
                <span class="resource-icon">📄</span>
                <div>
                  <div class="resource-title">OpenAI Function Calling Guide</div>
                  <div class="resource-type">Official API Specifications & Examples</div>
                </div>
              </div>
              <span class="btn-tag btn-docs">📄 Docs</span>
            </a>
            <a href="https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/" target="_blank" class="resource-card">
              <div class="resource-info">
                <span class="resource-icon">🎓</span>
                <div>
                  <div class="resource-title">DeepLearning.ai Prompt Engineering</div>
                  <div class="resource-type">Free Course by Andrew Ng & Isa Fulford</div>
                </div>
              </div>
              <span class="btn-tag btn-course">🎓 Course</span>
            </a>
            <a href="https://www.youtube.com/@DaveEbbelaar" target="_blank" class="resource-card">
              <div class="resource-info">
                <span class="resource-icon">▶️</span>
                <div>
                  <div class="resource-title">Dave Ebbelaar (YouTube)</div>
                  <div class="resource-type">Production LLM Architectures & Function Calling</div>
                </div>
              </div>
              <span class="btn-tag btn-yt">▶ YouTube</span>
            </a>
          </div>
        </div>
      </div>
      <div class="project-box">
        <div class="project-title">🛠️ Portfolio Project #2</div>
        <div class="project-desc"><strong>AI Email Intent Classifier & Draft Generator:</strong> Dhruv authors the system prompt and few-shot classification logic. Bhavya wraps it in a lightweight FastAPI microservice with Pydantic output validation.</div>
      </div>
    </div>
  </div>

  <!-- MODULE 3 -->
  <div class="module-card reveal" data-phase="p3" data-track="dhruv bhavya">
    <div class="module-header">
      <div class="module-header-left">
        <div class="module-icon-badge">📚</div>
        <div class="module-title">
          <h2>Module 3: AI Chatbots & RAG Knowledge Systems</h2>
          <div class="module-subtitle">Voiceflow, Botpress, Vector Databases & Document Embeddings · <span class="owner-pill owner-dhruv">🤖 Dhruv (Bot Logic)</span> <span class="owner-pill owner-bhavya">👨‍💻 Bhavya (Vector DB)</span></div>
        </div>
      </div>
      <div class="module-badge">Phase 3 · Week 5-6</div>
    </div>
    <div class="module-body">
      <div class="grid-two-col">
        <div>
          <div class="section-label">🎯 Core Concepts & Skills</div>
          <ul class="skills-list">
            <li class="skill-item" data-track="shared">
              <input type="checkbox" id="m3_1" class="task-check"/>
              <label for="m3_1" class="skill-text"><strong>Vector Embeddings:</strong> Chunking text (character/semantic), OpenAI text-embedding-3-small, Similarity search. <span class="owner-pill owner-shared">⚡ Shared</span></label>
            </li>
            <li class="skill-item" data-track="bhavya">
              <input type="checkbox" id="m3_2" class="task-check"/>
              <label for="m3_2" class="skill-text"><strong>Vector Stores & Databases:</strong> Pinecone, Qdrant, & Supabase pgvector setup for multi-tenant client data. <span class="owner-pill owner-bhavya">👨‍💻 Bhavya</span></label>
            </li>
            <li class="skill-item" data-track="dhruv">
              <input type="checkbox" id="m3_3" class="task-check"/>
              <label for="m3_3" class="skill-text"><strong>Visual Bot Builders:</strong> Voiceflow & Botpress state management, API steps, custom JS actions, & website embedding. <span class="owner-pill owner-dhruv">🤖 Dhruv</span></label>
            </li>
          </ul>
        </div>
        <div>
          <div class="section-label">📚 Where to Learn (YT & Official Docs)</div>
          <div class="resources-grid">
            <a href="https://www.youtube.com/@Voiceflow" target="_blank" class="resource-card">
              <div class="resource-info">
                <span class="resource-icon">▶️</span>
                <div>
                  <div class="resource-title">Voiceflow Official YouTube</div>
                  <div class="resource-type">Step-by-Step AI Chatbot Tutorials</div>
                </div>
              </div>
              <span class="btn-tag btn-yt">▶ YouTube</span>
            </a>
            <a href="https://www.pinecone.io/learn/" target="_blank" class="resource-card">
              <div class="resource-info">
                <span class="resource-icon">📄</span>
                <div>
                  <div class="resource-title">Pinecone Learning Center</div>
                  <div class="resource-type">RAG Architecture & Chunking Strategies</div>
                </div>
              </div>
              <span class="btn-tag btn-docs">📄 Docs</span>
            </a>
            <a href="https://www.youtube.com/@alejandro_ao" target="_blank" class="resource-card">
              <div class="resource-info">
                <span class="resource-icon">▶️</span>
                <div>
                  <div class="resource-title">Alejandro AO (YouTube)</div>
                  <div class="resource-type">LangChain, LlamaIndex & RAG System Builds</div>
                </div>
              </div>
              <span class="btn-tag btn-yt">▶ YouTube</span>
            </a>
          </div>
        </div>
      </div>
      <div class="project-box">
        <div class="project-title">🛠️ Portfolio Project #3</div>
        <div class="project-desc"><strong>Multi-Tenant E-Commerce / Clinic Support Bot:</strong> Dhruv designs the visual Voiceflow conversation tree and website embed widget. Bhavya configures Supabase pgvector to ingest and query client PDF documents.</div>
      </div>
    </div>
  </div>

  <!-- MODULE 4 -->
  <div class="module-card reveal" data-phase="p4" data-track="dhruv bhavya">
    <div class="module-header">
      <div class="module-header-left">
        <div class="module-icon-badge">📞</div>
        <div class="module-title">
          <h2>Module 4: Conversational Voice AI Agents</h2>
          <div class="module-subtitle">Vapi.ai, Retell AI, Twilio Phone Integration & Latency Optimization · <span class="owner-pill owner-dhruv">🤖 Dhruv (Voice Agent)</span> <span class="owner-pill owner-bhavya">👨‍💻 Bhavya (Twilio & Webhook Backend)</span></div>
        </div>
      </div>
      <div class="module-badge">Phase 4 · Week 7-8</div>
    </div>
    <div class="module-body">
      <div class="grid-two-col">
        <div>
          <div class="section-label">🎯 Core Concepts & Skills</div>
          <ul class="skills-list">
            <li class="skill-item" data-track="dhruv">
              <input type="checkbox" id="m4_1" class="task-check"/>
              <label for="m4_1" class="skill-text"><strong>Voice Agent Architecture:</strong> Speech-to-Text (Deepgram), LLM (Groq/Claude), Text-to-Speech (ElevenLabs). <span class="owner-pill owner-dhruv">🤖 Dhruv</span></label>
            </li>
            <li class="skill-item" data-track="bhavya">
              <input type="checkbox" id="m4_2" class="task-check"/>
              <label for="m4_2" class="skill-text"><strong>Inbound & Outbound Calling:</strong> Purchasing Twilio phone numbers, configuring Vapi/Retell assistants & Webhooks. <span class="owner-pill owner-bhavya">👨‍💻 Bhavya</span></label>
            </li>
            <li class="skill-item" data-track="dhruv">
              <input type="checkbox" id="m4_3" class="task-check"/>
              <label for="m4_3" class="skill-text"><strong>Real-time Calendar Booking:</strong> Connecting Cal.com / Google Calendar API during a live voice phone call. <span class="owner-pill owner-dhruv">🤖 Dhruv</span></label>
            </li>
          </ul>
        </div>
        <div>
          <div class="section-label">📚 Where to Learn (YT & Official Docs)</div>
          <div class="resources-grid">
            <a href="https://docs.vapi.ai/" target="_blank" class="resource-card">
              <div class="resource-info">
                <span class="resource-icon">📄</span>
                <div>
                  <div class="resource-title">Vapi.ai Official Documentation</div>
                  <div class="resource-type">Assistant Config & Tool Calling Guides</div>
                </div>
              </div>
              <span class="btn-tag btn-docs">📄 Docs</span>
            </a>
            <a href="https://www.youtube.com/@vapi-ai" target="_blank" class="resource-card">
              <div class="resource-info">
                <span class="resource-icon">▶️</span>
                <div>
                  <div class="resource-title">Vapi.ai YouTube Channel</div>
                  <div class="resource-type">Inbound Phone Receptionist Demonstrations</div>
                </div>
              </div>
              <span class="btn-tag btn-yt">▶ YouTube</span>
            </a>
            <a href="https://www.youtube.com/@AIJason" target="_blank" class="resource-card">
              <div class="resource-info">
                <span class="resource-icon">▶️</span>
                <div>
                  <div class="resource-title">AI Jason (YouTube)</div>
                  <div class="resource-type">Building AI Voice Agents with Cal.com & n8n</div>
                </div>
              </div>
              <span class="btn-tag btn-yt">▶ YouTube</span>
            </a>
          </div>
        </div>
      </div>
      <div class="project-box">
        <div class="project-title">🛠️ Portfolio Project #4</div>
        <div class="project-desc"><strong>Dental / Real Estate AI Phone Receptionist:</strong> Dhruv programs the Vapi.ai assistant prompt, objection handling, and Google Calendar tool. Bhavya provisions the Twilio phone number and connects the server-side call logging webhook.</div>
      </div>
    </div>
  </div>

  <!-- MODULE 5 -->
  <div class="module-card reveal" data-phase="p5" data-track="bhavya dhruv">
    <div class="module-header">
      <div class="module-header-left">
        <div class="module-icon-badge">🛠️</div>
        <div class="module-title">
          <h2>Module 5: Full-Stack AI Services & Client Delivery</h2>
          <div class="module-subtitle">Next.js, FastAPI, Client Dashboards & Cold Acquisition Systems · <span class="owner-pill owner-bhavya">👨‍💻 Bhavya (Backend & Cold Calls)</span> <span class="owner-pill owner-dhruv">🤖 Dhruv (Web & Social)</span></div>
        </div>
      </div>
      <div class="module-badge">Phase 5 · Week 9-12</div>
    </div>
    <div class="module-body">
      <div class="grid-two-col">
        <div>
          <div class="section-label">🎯 Core Concepts & Skills</div>
          <ul class="skills-list">
            <li class="skill-item" data-track="bhavya">
              <input type="checkbox" id="m5_1" class="task-check"/>
              <label for="m5_1" class="skill-text"><strong>Custom AI Microservices:</strong> Python FastAPI + Pydantic backends deployed on Render / Hetzner VPS. <span class="owner-pill owner-bhavya">👨‍💻 Bhavya</span></label>
            </li>
            <li class="skill-item" data-track="dhruv">
              <input type="checkbox" id="m5_2" class="task-check"/>
              <label for="m5_2" class="skill-text"><strong>Agency Client Portal & Web:</strong> Building a sleek Next.js / HTML agency site and Notion client onboarding portal. <span class="owner-pill owner-dhruv">🤖 Dhruv</span></label>
            </li>
            <li class="skill-item" data-track="bhavya">
              <input type="checkbox" id="m5_3" class="task-check"/>
              <label for="m5_3" class="skill-text"><strong>Cold Acquisition & Phone Outreach:</strong> Sourcing leads with Master AI Lead Engine and executing 15-sec cold call closing sprints. <span class="owner-pill owner-bhavya">👨‍💻 Bhavya</span></label>
            </li>
            <li class="skill-item" data-track="dhruv">
              <input type="checkbox" id="m5_4" class="task-check"/>
              <label for="m5_4" class="skill-text"><strong>Twitter/X Inbound Authority Engine:</strong> Daily build-in-public workflow breakdowns, Loom video demos & DM nurturing. <span class="owner-pill owner-dhruv">🤖 Dhruv</span></label>
            </li>
          </ul>
        </div>
        <div>
          <div class="section-label">📚 Where to Learn (YT & Official Docs)</div>
          <div class="resources-grid">
            <a href="https://fastapi.tiangolo.com/" target="_blank" class="resource-card">
              <div class="resource-info">
                <span class="resource-icon">📄</span>
                <div>
                  <div class="resource-title">FastAPI Official Tutorial</div>
                  <div class="resource-type">High-Performance Python Web API Framework</div>
                </div>
              </div>
              <span class="btn-tag btn-docs">📄 Docs</span>
            </a>
            <a href="https://nextjs.org/docs" target="_blank" class="resource-card">
              <div class="resource-info">
                <span class="resource-icon">📄</span>
                <div>
                  <div class="resource-title">Next.js 14 Documentation</div>
                  <div class="resource-type">App Router, Server Actions & UI Building</div>
                </div>
              </div>
              <span class="btn-tag btn-docs">📄 Docs</span>
            </a>
            <a href="https://www.youtube.com/@AlexHormozi" target="_blank" class="resource-card">
              <div class="resource-info">
                <span class="resource-icon">▶️</span>
                <div>
                  <div class="resource-title">Alex Hormozi (YouTube)</div>
                  <div class="resource-type">Grand Slam Offers & Agency Sales Systems</div>
                </div>
              </div>
              <span class="btn-tag btn-yt">▶ YouTube</span>
            </a>
          </div>
        </div>
      </div>
      <div class="project-box">
        <div class="project-title">🛠️ Portfolio Project #5</div>
        <div class="project-desc"><strong>Agency Launch & Outbound Revenue Sprint:</strong> Dhruv launches the agency portfolio site and publishes daily build-in-public threads. Bhavya executes 20 outbound dials/day using the Master AI Lead Engine to sign the first paying client.</div>
      </div>
    </div>
  </div>

</div>

<div class="footer">
  Built with ❤️ for your <strong>AI Agency Business Blueprint</strong> · Track your progress and build real client systems.
</div>

<script>
  // Theme Toggle Logic
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('roadmap-theme', theme);
    const thumb = document.getElementById('theme-thumb');
    const text = document.getElementById('theme-text');
    if (theme === 'light') {
      if (thumb) thumb.textContent = '☀️';
      if (text) text.textContent = 'Light Mode';
    } else {
      if (thumb) thumb.textContent = '🌙';
      if (text) text.textContent = 'Dark Mode';
    }
  }

  const savedTheme = localStorage.getItem('roadmap-theme') || 'dark';
  setTheme(savedTheme);

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Progress Bar Tracker
  function updateProgress() {
    const checkboxes = document.querySelectorAll('.task-check');
    const total = checkboxes.length;
    let checkedCount = 0;
    checkboxes.forEach(cb => {
      if (cb.checked) checkedCount++;
    });

    const percent = Math.round((checkedCount / total) * 100);
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    if (progressBar) progressBar.style.width = percent + '%';
    if (progressText) progressText.textContent = percent + '% Completed';
  }

  // Load and save checkbox state to localStorage
  document.querySelectorAll('.task-check').forEach(cb => {
    const saved = localStorage.getItem('roadmap_' + cb.id);
    if (saved === 'true') cb.checked = true;
    cb.addEventListener('change', () => {
      localStorage.setItem('roadmap_' + cb.id, cb.checked);
      updateProgress();
    });
  });

  updateProgress();

  // Track & Phase Dual-Filter Logic
  let currentPhase = 'all';
  let currentTrack = 'all';

  function filterTrack(track, btn) {
    document.querySelectorAll('.track-btn').forEach(b => {
      if (b.getAttribute('data-track') === track) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
    currentTrack = track;
    applyFilters();
  }

  function filterPhase(phase, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentPhase = phase;
    applyFilters();
  }

  function applyFilters() {
    // Filter Module Cards
    document.querySelectorAll('.module-card').forEach(card => {
      const cardPhase = card.getAttribute('data-phase');
      const cardTrack = card.getAttribute('data-track') || 'shared';

      const phaseMatch = (currentPhase === 'all' || cardPhase === currentPhase);
      const trackMatch = (currentTrack === 'all' || cardTrack.includes(currentTrack) || cardTrack.includes('shared'));

      if (phaseMatch && trackMatch) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });

    // Filter/Highlight Fast-Track Cards
    document.querySelectorAll('.fast-card').forEach(card => {
      const cardTrack = card.getAttribute('data-track') || 'shared';
      if (currentTrack === 'all') {
        card.style.display = 'flex';
        card.style.opacity = '1';
      } else if (cardTrack === currentTrack || cardTrack === 'shared') {
        card.style.display = 'flex';
        card.style.opacity = '1';
      } else {
        card.style.display = 'none';
      }
    });

    // Dim or highlight skills inside visible cards
    document.querySelectorAll('.skill-item').forEach(item => {
      const itemTrack = item.getAttribute('data-track') || 'shared';
      if (currentTrack === 'all') {
        item.style.opacity = '1';
      } else if (itemTrack === currentTrack || itemTrack === 'shared') {
        item.style.opacity = '1';
      } else {
        item.style.opacity = '0.35';
      }
    });
  }

  // Search Logic
  function searchRoadmap() {
    const query = document.getElementById('roadmap-search').value.toLowerCase();
    document.querySelectorAll('.module-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? 'block' : 'none';
    });
  }

  // Scroll Reveal Animations
  const revealTargets = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '50px 0px 50px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));
</script>
</body>
</html>
"""

output_paths = ["learning_roadmap.html"]
for p in output_paths:
    with open(p, "w") as f:
        f.write(html_content)
    print(f"✅ Generated: {p} ({len(html_content):,} bytes)")
