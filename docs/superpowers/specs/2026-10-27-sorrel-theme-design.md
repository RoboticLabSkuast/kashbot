# Kashbot Agri Systems — Sorrel Editorial Theme & Official Logo Design Spec

**Date:** 2026-10-27  
**Status:** Approved  
**Topic:** Redesign Kashbot Agri Systems corporate web platform using the Sorrel editorial aesthetic and official SVG branding.

---

## 1. Overview & Objectives
Kashbot Agri Systems Private Limited is an agricultural robotics and precision machinery company based in Buchpora, Srinagar, Jammu & Kashmir. The goal of this redesign is to transition the current web interface into a high-end, editorial botanical deep-tech experience inspired directly by the **Sorrel** design language (`https://gsapvault.com/demos/qr-menu-template/index.html`), while incorporating the official logo provided in `public/logo.svg`.

---

## 2. Brand Identity & Logo Architecture

### 2.1 Logo Integration
- Source file: `public/logo.svg` (Inkscape vector containing botanical leaf, circuit traces, robotic nodes, "KASHBOT", and "AGRI SYSTEMS").
- Bounding Box Optimization:
  - The raw `public/logo.svg` has an A4 viewBox (`0 0 210 297`), which causes large vertical white gutters when embedded in standard navigation headers.
  - An optimized viewBox-fitted lockup `assets/logo.svg` will be maintained (`viewBox="45 138 125 92"`) to ensure crisp, proportionate rendering across desktop and mobile headers without clipping or excess whitespace.
  - A standalone emblem mark (`assets/logo-mark.svg`, `viewBox="64 138 75 60"`) will be generated for the browser favicon and mobile compact headers.

---

## 3. Visual System & Design Tokens (Sorrel Aesthetic)

### 3.1 Color Palette
- `--ground: #E7ECE1`: Soft, organic sage paper base with subtle fixed radial grain washes (`rgba(63, 107, 71, 0.10)` and `rgba(190, 72, 48, 0.06)`).
- `--paper: #F3F6EF`: Off-white organic parchment surface for cards, sticky headers, and containers.
- `--ink: #23291F`: Deep organic forest black for high-contrast titles and body text (exceeds WCAG 12:1).
- `--ink-soft: #55604D`: Botanical slate grey-green for descriptions, technical metadata, and sub-labels.
- `--herb: #3F6B47`: Rich natural foliage green accent for primary CTA buttons, active category pills, and key metrics. Harmonizes with the `#3e9c06` botanical green from the official logo.
- `--tomato: #BE4830`: Earthy terracotta accent for live status dots, alert indicators, and high-impact field tags.
- `--line: rgba(35, 41, 31, 0.14)`: Refined hairline borders.
- `--line-strong: rgba(35, 41, 31, 0.22)`: Elevated borders for active elements and focus states.
- `--shadow: 0 1px 0 rgba(35, 41, 31, 0.04), 0 8px 24px rgba(35, 41, 31, 0.06)`: Smooth, natural elevation.

### 3.2 Typography
- **Display Headings:** Google Font `'Yeseva One', Georgia, serif` — provides editorial authority for brand typography and section headers.
- **Body & Sans:** Google Font `'Mukta', system-ui, -apple-system, sans-serif` (weights 300, 400, 500, 600, 700) — clean, warm, accessible font matching the Sorrel design.
- **Telemetry & Technical Specs:** `'JetBrains Mono', 'Fira Code', monospace` for coordinates, laser parameters, RTK accuracy, and duty cycles.

---

## 4. Layout & Interactive Features

### 4.1 Sticky Editorial Header
- Parchment backdrop (`rgba(var(--paper-rgb), 0.9)`) with blurred backdrop filter.
- Left: Official Kashbot logo + company subtitle.
- Right: Field operations pill (`Buchpora, Srinagar · J&K | Prototypes Active · TRL-5`) and action button (`Request Pilot Trial`).

### 4.2 Hero Section
- Editorial headline set in `Yeseva One`: *"Engineering Intelligent Robotics for Modern Agriculture"*.
- Subtitle detailing Kashbot's mission in Srinagar and apple orchard automation.
- Dual action buttons: Primary Herb pill button (`Explore Technologies`) and Outline button (`Partner with Us`).
- Quick telemetry stats bar with minimalist borders and dotted metric leaders.

### 4.3 Interactive Technology & R&D Catalog (Sorrel Tabs & Filter Chips)
- **Category Navigation (`.tabs`):**
  - Tabs: `All Technologies`, `Agricultural Robotics`, `Precision Machinery`, `Intelligent Spraying`, `Laser Weed Management`, `R&D Lab`.
  - Smooth animated pill switching.
- **Field Filter Chips (`.filters`):**
  - Chips: `Field Tested`, `Sensor AI`, `Zero Chemical`, `Patent Pending`.
  - Filter active items with smooth GSAP crossfade and zero layout jump.
- **Editorial Technology Cards (`.item`):**
  - Title with dotted leader line (`.item__leader`) connecting to metric/TRL badge.
  - Concise description of operational benefits.
  - Botanical pill tags (`Autonomous`, `Vision AI`, `Eco-Targeting`).
  - Expandable detail drawers (`data-toggle`) revealing engineering specs (RTK dual-antenna accuracy, power source, spray droplet size, laser wavelength, field speeds).

### 4.4 Company Overview, R&D Pipeline & Purpose
- Structured narrative based on `public/details.txt`:
  - 5-step engineering pipeline (Identify problem → Mechanical concept → Sensors & computing → Prototype build & test → Field evaluation).
  - Purpose & Vision statements.
  - Precision impact comparison table with clean hairline dividers.

### 4.5 Editorial Footer
- Clear physical location: Buchpora, Srinagar, Jammu & Kashmir – 190020, India.
- Direct contact links: `info@kashbot.in`, `+91 7006613634`.
- Copyright & legal notice.

---

## 5. Verification & Testing Plan
1. **Visual Testing:** Verify typography loading (`Yeseva One` and `Mukta`), color token fidelity, and gradient washes.
2. **Logo Rendering:** Verify official logo appears sharp and centered in header, drawer, and footer with zero clipping or awkward padding.
3. **Interactive Testing:** Test category tab switching, filter chips toggle, and expandable accordion drawers.
4. **Responsive Testing:** Verify 375px mobile view, tablet view, and 1440px desktop view.
