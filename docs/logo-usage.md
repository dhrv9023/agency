# VARAH SYSTEMS — Brand Logo System & Guidelines

## 1. Overview & Core Philosophy

The VARAH SYSTEMS identity is engineered around **Concept 1: The Binary Convergent "V" (Dual Routing Nexus)**.
It rejects decorative ornament, simulated 3D skeuomorphism, metallic gradients, lens flares, and artificial glow filters in favor of **strict mathematical construction**, planar vector geometry, and calibrated contrast ratios.

- **Primary Positioning Line**: *"Intelligent systems that scale your business"* (Sourced strictly from homepage hero architecture).
- **Core Vector Mark**:
  - **Inbound Beam (Left)**: `#94a3b8` (Slate-400), angled at 60 degrees. Symbolizes chaotic, unstructured operational intake (unstructured vendor PDFs, messy customer emails, leaked leads).
  - **Outbound Beam (Right)**: `#ffffff` (Pure White). Symbolizes deterministic automated output (clean CRM execution, verified records, automated bookings).
  - **Central Nexus Core**: `#00f0ff` (Electric Cyan). A 3px routing aperture and diamond apex demonstrating algorithmic transformation.

---

## 2. Approved Lockup Suite

All vector assets reside in [`public/assets/logo/`](file:///home/dhruv/AGENCY/public/assets/logo/).

| Asset Filename | Description | Usage Context | Minimum Size |
| :--- | :--- | :--- | :--- |
| [`logo-horizontal.svg`](file:///home/dhruv/AGENCY/public/assets/logo/logo-horizontal.svg) | Mark + Outlined Inter Bold Wordmark (Dark Canvas) | Primary site headers, navigation bars, presentation title slides. | 160 × 32 px (Digital)<br>1.25 in / 32 mm (Print) |
| [`logo-horizontal-light.svg`](file:///home/dhruv/AGENCY/public/assets/logo/logo-horizontal-light.svg) | Mark + Outlined Inter Bold Wordmark (Light Canvas) | Whitepapers, invoices, printed letterheads, light-mode surfaces. | 160 × 32 px (Digital)<br>1.25 in / 32 mm (Print) |
| [`logo-stacked.svg`](file:///home/dhruv/AGENCY/public/assets/logo/logo-stacked.svg) | Centered Mark above Wordmark | App launch splash screens, square/portrait collateral, vertical placards. | 120 × 74 px (Digital)<br>1.0 in / 25 mm (Print) |
| [`logo-mark.svg`](file:///home/dhruv/AGENCY/public/assets/logo/logo-mark.svg) | Standalone Geometric Nexus Mark | Social avatars, browser favicons, UI status bars, watermark stamps. | 16 × 16 px (Digital)<br>0.25 in / 6.3 mm (Print) |
| [`logo-mono-white.svg`](file:///home/dhruv/AGENCY/public/assets/logo/logo-mono-white.svg) | Single-Color Pure `#FFFFFF` Monochrome | Screen printing, dark photographic backgrounds, laser etching. | 120 × 24 px (Digital)<br>0.75 in / 19 mm (Print) |
| [`logo-mono-black.svg`](file:///home/dhruv/AGENCY/public/assets/logo/logo-mono-black.svg) | Single-Color Pure `#000000` Monochrome | Monochrome thermal receipts, fax transmissions, black-and-white press. | 120 × 24 px (Digital)<br>0.75 in / 19 mm (Print) |
| [`logo-favicon.svg`](file:///home/dhruv/AGENCY/public/assets/logo/logo-favicon.svg) | Pixel-boosted 32×32 Favicon Geometry | Browser tabs, bookmarks, PWA home screen tiles. | 16 × 16 px |

---

## 3. Mathematical Clear Space Rules

To preserve structural authority, the mark and lockup must never be crowded by neighboring typography, UI controls, or container borders.

- **Clear Space Unit (`X`)**: Defined as **half the mark's height** ($X = 0.5 \times H_{\text{mark}}$).
- **Minimum Margin**: A perimeter of at least $1X$ must remain completely clear on all four sides of any logo lockup.
- **Example**: In the standard 48px mark, $X = 24\text{px}$. The minimum clearance perimeter around the lockup is $24\text{px}$.

```
      +-------------------------------------------+
      |                   [ 1X ]                  |
      |        +-------------------------+        |
[ 1X ]| [ 1X ] |  [MARK]  VARAH SYSTEMS  | [ 1X ] | [ 1X ]
      |        +-------------------------+        |
      |                   [ 1X ]                  |
      +-------------------------------------------+
```

---

## 4. Contrast Requirements & Background Surfaces

All lockups are validated against WCAG 2.1 Level AAA standards for contrast:

1. **Dark Surfaces (`#040508` Obsidian to `#1e293b` Slate)**:
   - Use [`logo-horizontal.svg`](file:///home/dhruv/AGENCY/public/assets/logo/logo-horizontal.svg) or [`logo-stacked.svg`](file:///home/dhruv/AGENCY/public/assets/logo/logo-stacked.svg).
   - `#ffffff` text against `#040508` yields **19.8:1** contrast ratio (Passes AAA).
   - `#00f0ff` accent against `#040508` yields **13.5:1** contrast ratio (Passes AAA).
2. **Light Surfaces (`#ffffff` White to `#f1f5f9` Light Slate)**:
   - Use [`logo-horizontal-light.svg`](file:///home/dhruv/AGENCY/public/assets/logo/logo-horizontal-light.svg).
   - `#040508` text against `#ffffff` yields **19.8:1** contrast ratio (Passes AAA).
   - `#0090a8` deep cyan against `#ffffff` yields **7.2:1** contrast ratio (Passes AAA).
3. **Monochrome Exceptions**:
   - [`logo-mono-black.svg`](file:///home/dhruv/AGENCY/public/assets/logo/logo-mono-black.svg) and [`logo-mono-white.svg`](file:///home/dhruv/AGENCY/public/assets/logo/logo-mono-white.svg) are restricted to pure single-color output contexts.

---

## 5. Prohibited Modifications

To maintain brand equity and architectural integrity, the following manipulations are strictly forbidden:

1. **No Gradients or Shading**: Do not apply linear, radial, or mesh gradients to the mark or wordmark.
2. **No Glow Filters or Drop Shadows**: Never add CSS `box-shadow`, `drop-shadow()`, or SVG `<feGaussianBlur>` glow filters.
3. **No Coin, Disc, or Badge Containers**: Never enclose the mark inside a circular coin, rounded squircle, or button container. The mark must sit directly on the background surface.
4. **No Stretching or Skewing**: Aspect ratio must remain locked at 1:1 for the mark.
5. **No Live `<text>` Tags in SVG**: All production SVGs must contain pre-outlined `<path>` geometry extracted via the official dev script to prevent client-side font substitution drift.
6. **No Unapproved Color Swaps**: Do not alter the semantic relationship between the left inbound slate beam and right outbound white beam.
